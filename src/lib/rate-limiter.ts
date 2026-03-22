import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Service role client for rate limiting - with graceful fallback
const supabaseServiceRole = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    )
  : null;

// In-memory rate limiting for development/fallback
const memoryLimiter = new Map<string, { count: number; windowStart: number; blocked?: number }>();

/**
 * Industry-standard rate limiter with multiple tiers
 * Prevents API abuse and ensures fair usage
 */
export class RateLimiter {
  private static readonly WINDOW_MINUTE = 60 * 1000; // 1 minute
  private static readonly WINDOW_HOUR = 60 * 60 * 1000; // 1 hour
  
  // Rate limit tiers (industry standards following OWASP guidelines)
  private static readonly LIMITS = {
    // High-traffic public endpoints
    '/api/analytics/track': { minute: 60, hour: 300 },
    '/api/blog': { minute: 30, hour: 200 },
    '/api/blog/[postId]': { minute: 30, hour: 200 },
    '/api/videos/custom-manufacturing': { minute: 20, hour: 100 },
    '/api/videos/on-demand-manufacturing': { minute: 20, hour: 100 },
    '/api/cad-engine/health': { minute: 30, hour: 150 },
    
    // Contact form (stricter due to email sending)
    '/api/contact': { minute: 5, hour: 20 },
    
    // Authenticated/sensitive endpoints
    '/api/credits/status': { minute: 30, hour: 150 },
    '/api/dfm-analysis': { minute: 5, hour: 25 },
    '/api/upload/secure': { minute: 10, hour: 50 },
    
    // Authentication endpoints (very strict)
    '/api/auth': { minute: 5, hour: 15 },
    
    // Webhooks and cron (moderate limits)
    '/api/blogger-webhook': { minute: 20, hour: 100 },
    '/api/cron': { minute: 10, hour: 50 },
    '/api/revalidate': { minute: 10, hour: 50 },
    
    // Default for all other APIs (moderate)
    default: { minute: 15, hour: 100 }
  };

  /**
   * Check if request is within rate limits
   */
  static async checkRateLimit(
    req: NextRequest,
    userId?: string,
    endpoint?: string
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    try {
      // Determine the endpoint pattern
      const pathname = req.nextUrl.pathname;
      const endpointKey = this.getEndpointKey(pathname, endpoint);
      const limits = this.LIMITS[endpointKey] || this.LIMITS.default;
      
      // Use IP address if no user ID (for unauthenticated requests)
      const identifier = userId || this.getClientIdentifier(req);
      
      // Try database rate limiting first, fallback to memory
      try {
        return await this.checkDatabaseRateLimit(identifier, endpointKey, limits);
      } catch (error: any) {
        // Check for specific function overloading error
        if (error?.code === 'PGRST203' || error?.message?.includes('Could not choose the best candidate function')) {
          console.warn('Database function overloading detected, using memory fallback for rate limiting');
        } else {
          console.warn('Database rate limiting failed, using memory fallback:', error);
        }
        return this.checkMemoryRateLimit(identifier, endpointKey, limits);
      }
    } catch (error) {
      console.error('Rate limiting error:', error);
      // Allow request if rate limiting fails (fail-open for availability)
      return { allowed: true, remaining: 100, resetTime: Date.now() + this.WINDOW_MINUTE };
    }
  }

  /**
   * Database-backed rate limiting for accuracy across instances
   */
  private static async checkDatabaseRateLimit(
    identifier: string,
    endpoint: string,
    limits: { minute: number; hour: number }
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    // Industry standard: graceful degradation when external dependencies are unavailable
    if (!supabaseServiceRole) {
      throw new Error('Database rate limiting unavailable - falling back to memory');
    }

    // Call database function with type consistency
    const { data: isAllowed, error } = await supabaseServiceRole.rpc('check_rate_limit_safe', {
      p_user_id: identifier.startsWith('ip_') ? null : identifier,
      p_endpoint: endpoint, // Keep original typing
      p_requests_per_minute: limits.minute,
      p_requests_per_hour: limits.hour
    });

    if (error) throw error;

    // Calculate remaining and reset time
    const now = Date.now();
    const resetTime = now + this.WINDOW_MINUTE;
    
    return {
      allowed: isAllowed,
      remaining: isAllowed ? limits.minute - 1 : 0,
      resetTime
    };
  }

  /**
   * Memory-based rate limiting (fallback)
   */
  private static checkMemoryRateLimit(
    identifier: string,
    endpoint: string,
    limits: { minute: number; hour: number }
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const key = `${identifier}:${endpoint}`;
    const now = Date.now();
    const windowStart = Math.floor(now / this.WINDOW_MINUTE) * this.WINDOW_MINUTE;
    
    let record = memoryLimiter.get(key);
    
    // Initialize or reset window
    if (!record || record.windowStart !== windowStart) {
      record = { count: 0, windowStart, blocked: undefined };
      memoryLimiter.set(key, record);
    }
    
    // Check if currently blocked
    if (record.blocked && now < record.blocked) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.blocked
      };
    }
    
    // Check minute limit
    if (record.count >= limits.minute) {
      record.blocked = windowStart + this.WINDOW_MINUTE;
      return {
        allowed: false,
        remaining: 0,
        resetTime: record.blocked
      };
    }
    
    // Allow request
    record.count++;
    const remaining = Math.max(0, limits.minute - record.count);
    
    return {
      allowed: true,
      remaining,
      resetTime: windowStart + this.WINDOW_MINUTE
    };
  }

  /**
   * Get standardized endpoint key for rate limiting
   */
  private static getEndpointKey(pathname: string, override?: string): string {
    if (override) return override;
    
    // Match against known patterns
    for (const [pattern, limits] of Object.entries(this.LIMITS)) {
      if (pattern !== 'default' && pathname.startsWith(pattern)) {
        return pattern;
      }
    }
    
    return 'default';
  }

  /**
   * Get client identifier (IP address with privacy considerations)
   */
  private static getClientIdentifier(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for');
    const realIp = req.headers.get('x-real-ip');
    const ip = forwarded?.split(',')[0] || realIp || 'unknown';
    
    // Hash IP for privacy (GDPR compliance)
    return `ip_${this.simpleHash(ip)}`;
  }

  /**
   * Simple hash function for IP privacy
   */
  private static simpleHash(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Create rate limit response headers
   */
  static createRateLimitHeaders(
    remaining: number,
    resetTime: number,
    endpoint: string
  ): Record<string, string> {
    const limits = this.LIMITS[endpoint] || this.LIMITS.default;
    
    return {
      'X-RateLimit-Limit': limits.minute.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
      'X-RateLimit-Policy': `${limits.minute} per minute, ${limits.hour} per hour`
    };
  }

  /**
   * Clean up old memory entries
   */
  static cleanup(): void {
    const now = Date.now();
    const cutoff = now - this.WINDOW_HOUR;
    
    for (const [key, record] of memoryLimiter.entries()) {
      if (record.windowStart < cutoff) {
        memoryLimiter.delete(key);
      }
    }
    
    // Log cleanup stats
    if (memoryLimiter.size > 1000) {
      console.warn(`Rate limiter memory usage high: ${memoryLimiter.size} entries`);
    }
  }
}

/**
 * Middleware wrapper for easy rate limiting
 */
export function withRateLimit(
  handler: (req: NextRequest, context: any) => Promise<NextResponse>,
  endpoint?: string
) {
  return async (req: NextRequest, context: any): Promise<NextResponse> => {
    try {
      // Extract user ID if available (multiple methods)
      let userId: string | undefined;
      try {
        // Try Authorization header first
        const authHeader = req.headers.get('authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
          const bearerToken = authHeader.replace('Bearer ', '');
          // Validate UUID format
          if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(bearerToken)) {
            userId = bearerToken;
          }
        }
        
        // Fallback to X-User-ID header
        if (!userId) {
          const userIdHeader = req.headers.get('x-user-id');
          if (userIdHeader && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(userIdHeader)) {
            userId = userIdHeader;
          }
        }
      } catch (e) {
        // Ignore auth extraction errors
      }
      
      // Check rate limit
      const { allowed, remaining, resetTime } = await RateLimiter.checkRateLimit(
        req,
        userId,
        endpoint
      );
      
      // Create headers
      const rateLimitHeaders = RateLimiter.createRateLimitHeaders(
        remaining,
        resetTime,
        endpoint || req.nextUrl.pathname
      );
      
      // Block if rate limited
      if (!allowed) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please try again later.',
            retryAfter: Math.ceil((resetTime - Date.now()) / 1000)
          },
          {
            status: 429,
            headers: {
              ...rateLimitHeaders,
              'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString()
            }
          }
        );
      }
      
      // Process request
      const response = await handler(req, context);
      
      // Add rate limit headers to response
      Object.entries(rateLimitHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
      
    } catch (error) {
      console.error('Rate limiting middleware error:', error);
      // Continue with request if rate limiting fails
      return handler(req, context);
    }
  };
}