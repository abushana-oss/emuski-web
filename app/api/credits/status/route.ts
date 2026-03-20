import { NextRequest, NextResponse } from 'next/server';
import { CreditsManager } from '@/lib/credits-manager';
import { getAPISecurityHeaders } from '@/lib/security-headers';
import { authenticateRequest } from '@/lib/jwt-auth';
import { withRateLimit } from '@/lib/rate-limiter';

const SECURITY_HEADERS = getAPISecurityHeaders();

// Add caching for performance (5 minutes)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function handleGET(req: NextRequest) {
  const startTime = Date.now();
  const headers = new Headers(SECURITY_HEADERS);
  
  try {
    // Industry Standard: JWT Bearer Token Authentication ONLY
    const authHeader = req.headers.get('authorization');
    
    // Return 401 immediately if no auth header
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          details: 'Valid JWT Bearer token required',
          code: 'UNAUTHORIZED'
        },
        { status: 401, headers }
      );
    }
    
    const authResult = await authenticateRequest(authHeader);
    
    if (!authResult.valid || !authResult.userId) {
      return NextResponse.json(
        { 
          error: 'Authentication required',
          details: authResult.error || 'Invalid JWT token',
          code: 'UNAUTHORIZED'
        },
        { status: 401, headers }
      );
    }

    const userId = authResult.userId;
    
    // Check cache first for performance
    const cacheKey = `credits_${userId}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
      const totalDuration = Date.now() - startTime;
      
      // Industry standard: Add cache performance headers
      headers.set('X-Response-Time', `${totalDuration}ms`);
      headers.set('X-Cache-Status', 'hit');
      headers.set('X-Cache-Age', `${Math.floor((Date.now() - cachedData.timestamp) / 1000)}s`);
      
      return NextResponse.json(cachedData.data, { headers });
    }

    // Get authenticated user credits with performance tracking
    const dbStartTime = Date.now();
    const userCredits = await CreditsManager.getUserCredits(userId);
    const dbDuration = Date.now() - dbStartTime;
    
    // Calculate time until reset using industry standard fixed UTC reset time
    const now = new Date();
    const nextReset = CreditsManager.getNextResetTime(new Date(userCredits.last_reset));
    const msUntilReset = nextReset.getTime() - now.getTime();
    const hoursUntilReset = Math.max(0, Math.ceil(msUntilReset / (1000 * 60 * 60)));

    const responseData = {
      creditsRemaining: userCredits.credits_remaining,
      creditsLimit: userCredits.credits_limit,
      nextResetTime: nextReset.toISOString(),
      hoursUntilReset,
      lastResetTime: userCredits.last_reset,
      userType: 'authenticated',
      authMethod: 'jwt',
      resetSchedule: 'daily',
      usage: {
        totalUsed: userCredits.credits_limit - userCredits.credits_remaining,
        percentUsed: Math.round(((userCredits.credits_limit - userCredits.credits_remaining) / userCredits.credits_limit) * 100)
      }
    };

    // Cache the response for performance
    cache.set(cacheKey, { data: responseData, timestamp: Date.now() });
    
    // Clean up old cache entries (simple cleanup)
    if (cache.size > 1000) {
      const oldEntries = Array.from(cache.entries()).filter(
        ([key, value]) => (Date.now() - value.timestamp) > CACHE_DURATION
      );
      oldEntries.forEach(([key]) => cache.delete(key));
    }

    const totalDuration = Date.now() - startTime;
    
    // Industry standard: Add performance headers
    headers.set('X-Response-Time', `${totalDuration}ms`);
    headers.set('X-Cache-Status', 'miss');
    headers.set('X-Database-Time', `${dbDuration}ms`);
    

    return NextResponse.json(responseData, { headers });

  } catch (error: any) {
    const totalDuration = Date.now() - startTime;
    console.error('Credit status error:', { error: error.message, duration: totalDuration });
    
    // Return error instead of fallback to avoid confusion
    return NextResponse.json({
      error: 'Unable to fetch credit status. Please refresh the page.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500, headers });
  }
}

// Export with rate limiting
export const GET = withRateLimit(handleGET, '/api/credits/status');