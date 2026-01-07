/**
 * Rate Limiting Utility
 *
 * Implements rate limiting for API routes using Upstash Redis
 * Falls back to in-memory storage for development without Redis
 *
 * @author Principal Software Engineer
 * @version 1.0.0
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// In-memory fallback for development (when Redis is not configured)
class InMemoryRatelimit {
  private requests: Map<string, number[]> = new Map();
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(maxRequests: number, windowMs: number) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async limit(identifier: string): Promise<{ success: boolean; remaining: number }> {
    const now = Date.now();
    const windowStart = now - this.windowMs;

    // Get existing requests for this identifier
    let timestamps = this.requests.get(identifier) || [];

    // Filter out old requests outside the window
    timestamps = timestamps.filter(timestamp => timestamp > windowStart);

    // Check if limit exceeded
    const success = timestamps.length < this.maxRequests;

    if (success) {
      timestamps.push(now);
      this.requests.set(identifier, timestamps);
    }

    const remaining = Math.max(0, this.maxRequests - timestamps.length);

    return { success, remaining };
  }
}

// Configuration for different rate limiters
const rateLimitConfigs = {
  // Contact form: 5 requests per 15 minutes
  contact: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many contact form submissions. Please try again in 15 minutes.',
  },

  // Revalidation: 10 requests per hour
  revalidate: {
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    message: 'Too many revalidation requests. Please try again later.',
  },

  // Email subscription: 3 requests per 10 minutes
  subscribe: {
    maxRequests: 3,
    windowMs: 10 * 60 * 1000, // 10 minutes
    message: 'Too many subscription attempts. Please try again in 10 minutes.',
  },
};

// Initialize rate limiters
let rateLimiters: Record<string, Ratelimit | InMemoryRatelimit> = {};

function initializeRateLimiters() {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    // Production: Use Upstash Redis
    console.log('✅ Rate limiting: Using Upstash Redis');

    const redis = new Redis({
      url: upstashUrl,
      token: upstashToken,
    });

    rateLimiters = {
      contact: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(
          rateLimitConfigs.contact.maxRequests,
          `${rateLimitConfigs.contact.windowMs}ms`
        ),
        analytics: true,
        prefix: '@emuski/ratelimit/contact',
      }),

      revalidate: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(
          rateLimitConfigs.revalidate.maxRequests,
          `${rateLimitConfigs.revalidate.windowMs}ms`
        ),
        analytics: true,
        prefix: '@emuski/ratelimit/revalidate',
      }),

      subscribe: new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(
          rateLimitConfigs.subscribe.maxRequests,
          `${rateLimitConfigs.subscribe.windowMs}ms`
        ),
        analytics: true,
        prefix: '@emuski/ratelimit/subscribe',
      }),
    };
  } else {
    // Development: Use in-memory fallback
    console.warn('⚠️  Rate limiting: Using in-memory fallback (development only)');
    console.warn('⚠️  For production, configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN');

    rateLimiters = {
      contact: new InMemoryRatelimit(
        rateLimitConfigs.contact.maxRequests,
        rateLimitConfigs.contact.windowMs
      ),
      revalidate: new InMemoryRatelimit(
        rateLimitConfigs.revalidate.maxRequests,
        rateLimitConfigs.revalidate.windowMs
      ),
      subscribe: new InMemoryRatelimit(
        rateLimitConfigs.subscribe.maxRequests,
        rateLimitConfigs.subscribe.windowMs
      ),
    };
  }
}

// Initialize on module load
initializeRateLimiters();

/**
 * Get client identifier from request
 * Uses IP address or forwarded IP from proxies
 */
function getIdentifier(request: NextRequest): string {
  // Try to get real IP from headers (for proxies/load balancers)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');

  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(',')[0].trim();
  }

  if (realIp) {
    return realIp;
  }

  // Fallback to Next.js IP detection
  return request.ip || '127.0.0.1';
}

/**
 * Apply rate limiting to an API route
 *
 * @param request - Next.js request object
 * @param type - Type of rate limiter to use
 * @returns NextResponse with 429 status if rate limit exceeded, null if allowed
 *
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const rateLimitResponse = await checkRateLimit(request, 'contact');
 *   if (rateLimitResponse) return rateLimitResponse;
 *
 *   // ... rest of handler
 * }
 * ```
 */
export async function checkRateLimit(
  request: NextRequest,
  type: keyof typeof rateLimitConfigs
): Promise<NextResponse | null> {
  try {
    const identifier = getIdentifier(request);
    const limiter = rateLimiters[type];
    const config = rateLimitConfigs[type];

    if (!limiter) {
      console.error(`Rate limiter not found for type: ${type}`);
      // Allow request if limiter not found (fail open for availability)
      return null;
    }

    const { success, remaining } = await limiter.limit(identifier);

    if (!success) {
      console.warn(`Rate limit exceeded for ${type} from ${identifier}`);

      return NextResponse.json(
        {
          error: config.message,
          retryAfter: Math.ceil(config.windowMs / 1000), // seconds
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(config.windowMs / 1000).toString(),
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + config.windowMs).toISOString(),
          },
        }
      );
    }

    // Add rate limit headers to successful requests
    // This will be applied by the calling handler
    return null;
  } catch (error) {
    console.error('Rate limit check error:', error);
    // Fail open: allow request if rate limiting fails
    return null;
  }
}

/**
 * Get rate limit headers for successful requests
 */
export function getRateLimitHeaders(
  type: keyof typeof rateLimitConfigs,
  remaining: number = 0
): Record<string, string> {
  const config = rateLimitConfigs[type];

  return {
    'X-RateLimit-Limit': config.maxRequests.toString(),
    'X-RateLimit-Remaining': remaining.toString(),
    'X-RateLimit-Reset': new Date(Date.now() + config.windowMs).toISOString(),
  };
}
