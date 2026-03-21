import { NextRequest, NextResponse } from 'next/server';
import { CreditsManager } from '@/lib/credits-manager';
import { getAPISecurityHeaders } from '@/lib/security-headers';
import { authenticateRequest } from '@/lib/jwt-auth';
import { withRateLimit } from '@/lib/rate-limiter';

const SECURITY_HEADERS = getAPISecurityHeaders();

// Add caching for performance (1 minute for faster updates)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 1 * 60 * 1000; // 1 minute
const AUTH_CACHE = new Map<string, { userId: string; timestamp: number }>();
const AUTH_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for auth

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
    
    // Check auth cache first to avoid repeated JWT verification
    const token = authHeader.replace('Bearer ', '');
    const cachedAuth = AUTH_CACHE.get(token);
    
    let userId: string;
    
    if (cachedAuth && (Date.now() - cachedAuth.timestamp) < AUTH_CACHE_DURATION) {
      userId = cachedAuth.userId;
    } else {
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
      
      userId = authResult.userId;
      // Cache successful auth for 10 minutes
      AUTH_CACHE.set(token, { userId, timestamp: Date.now() });
    }
    
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
    
    // Clean up auth cache too
    if (AUTH_CACHE.size > 500) {
      const oldAuthEntries = Array.from(AUTH_CACHE.entries()).filter(
        ([key, value]) => (Date.now() - value.timestamp) > AUTH_CACHE_DURATION
      );
      oldAuthEntries.forEach(([key]) => AUTH_CACHE.delete(key));
    }

    const totalDuration = Date.now() - startTime;
    
    // Industry standard: Add performance headers
    headers.set('X-Response-Time', `${totalDuration}ms`);
    headers.set('X-Cache-Status', 'miss');
    headers.set('X-Database-Time', `${dbDuration}ms`);
    

    return NextResponse.json(responseData, { headers });

  } catch (error: any) {
    const totalDuration = Date.now() - startTime;
    
    // Provide user-friendly error responses following industry standards
    let statusCode = 500;
    let userMessage = {
      title: 'Service Issue',
      message: 'Unable to fetch your credit status. This is usually temporary.',
      action: 'Please refresh the page or try again in a moment',
      canRetry: true,
    };
    
    if (error.message?.includes('service role key') || error.code === 'SUPABASE_SERVICE_ROLE_KEY_MISSING') {
      statusCode = 503;
      userMessage = {
        title: 'Service Maintenance',
        message: 'Our credit system is temporarily unavailable due to maintenance.',
        action: 'Please try again in a few minutes',
        canRetry: true,
      };
    } else if (error.code === 'PGRST301') {
      statusCode = 503;
      userMessage = {
        title: 'Database Connection Issue',
        message: 'We\'re experiencing connectivity issues with our database.',
        action: 'Our team has been notified. Please try again shortly',
        canRetry: true,
      };
    } else if (error.message?.includes('timeout')) {
      statusCode = 408;
      userMessage = {
        title: 'Request Timed Out',
        message: 'The request took too long to process.',
        action: 'Please try again',
        canRetry: true,
      };
    }
    
    return NextResponse.json({
      error: userMessage,
      success: false,
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === 'development' && { 
        debug: { 
          originalError: error.message,
          stack: error.stack 
        } 
      })
    }, { status: statusCode, headers });
  }
}

// Export with rate limiting
export const GET = withRateLimit(handleGET, '/api/credits/status');