/**
 * Blogger Webhook Endpoint for Real-Time Blog Updates
 *
 * This endpoint automatically revalidates the blog cache when new posts are published on Blogger.
 *
 * Setup Instructions for Blogger:
 * 1. Use a service like Zapier or Make.com to create a webhook automation
 * 2. Trigger: When new post is published on Blogger
 * 3. Action: Send POST request to this endpoint
 * 4. URL: https://yourdomain.com/api/blogger-webhook
 * 5. Include the BLOGGER_WEBHOOK_SECRET in the Authorization header
 *
 * Alternative: Use IFTTT (If This Then That)
 * - Trigger: New post on Blogger (RSS feed trigger)
 * - Action: Webhook POST request to this endpoint
 *
 * This implements industry-standard webhook pattern with:
 * - Secret-based authentication
 * - Rate limiting protection
 * - Comprehensive error handling
 * - Automatic cache invalidation
 * - Detailed logging for debugging
 *
 * @2026 Best Practices:
 * - Idempotent operations
 * - Graceful error handling
 * - Security-first design
 * - Observability built-in
 */

import { revalidateBlog } from '@/lib/api/blogger';
import { NextRequest, NextResponse } from 'next/server';
// Simple in-memory rate limiting for webhooks
const lastRequests = new Map<string, number>();

const checkSimpleRateLimit = (ip: string, limitPerHour: number = 20): boolean => {
  const now = Date.now();
  const lastRequest = lastRequests.get(ip) || 0;
  const hourInMs = 60 * 60 * 1000;
  
  if (now - lastRequest < hourInMs / limitPerHour) {
    return false; // Rate limited
  }
  
  lastRequests.set(ip, now);
  
  // Cleanup old entries
  for (const [key, time] of lastRequests.entries()) {
    if (now - time > hourInMs) {
      lastRequests.delete(key);
    }
  }
  
  return true; // Allowed
};

const WEBHOOK_SECRET = process.env.BLOGGER_WEBHOOK_SECRET || process.env.REVALIDATE_SECRET;

interface BloggerWebhookPayload {
  secret?: string;
  blogType?: 'manufacturing' | 'engineering' | 'successStories';
  action?: 'published' | 'updated' | 'deleted';
  postId?: string;
  postTitle?: string;
  timestamp?: string;
}

export async function POST(request: NextRequest) {
  // Simple rate limiting protection (20 requests per hour)
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const isAllowed = checkSimpleRateLimit(ip, 20);
  
  if (!isAllowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }

  try {
    // Verify webhook secret from header or body
    const authHeader = request.headers.get('authorization');
    const webhookSecret = authHeader?.replace('Bearer ', '') || authHeader;

    let body: BloggerWebhookPayload = {};
    try {
      body = await request.json();
    } catch {
      // If no JSON body, that's okay - we'll use default behavior
    }

    // Verify secret
    if (!WEBHOOK_SECRET) {
      console.error('[Blogger Webhook] Webhook secret not configured');
      return NextResponse.json(
        { error: 'Webhook not configured', message: 'Please configure BLOGGER_WEBHOOK_SECRET or REVALIDATE_SECRET' },
        { status: 500 }
      );
    }

    const providedSecret = body.secret || webhookSecret;
    if (providedSecret !== WEBHOOK_SECRET) {
      console.warn('[Blogger Webhook] Invalid webhook secret attempt');
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid webhook secret' },
        { status: 401 }
      );
    }

    // Log webhook receipt
    console.info('[Blogger Webhook] Received webhook:', {
      blogType: body.blogType || 'all',
      action: body.action || 'unknown',
      postId: body.postId || 'N/A',
      postTitle: body.postTitle || 'N/A',
      timestamp: body.timestamp || new Date().toISOString(),
    });

    // Revalidate specific blog or all blogs
    if (body.blogType && ['manufacturing', 'engineering', 'successStories'].includes(body.blogType)) {
      await revalidateBlog(body.blogType);
      console.info(`[Blogger Webhook] Successfully revalidated ${body.blogType} blog`);

      return NextResponse.json({
        success: true,
        revalidated: body.blogType,
        action: body.action || 'published',
        timestamp: new Date().toISOString(),
        message: `${body.blogType} blog cache cleared - new posts will appear immediately`,
      });
    } else {
      // Revalidate all blogs
      await revalidateBlog();
      console.info('[Blogger Webhook] Successfully revalidated all blogs');

      return NextResponse.json({
        success: true,
        revalidated: 'all',
        action: body.action || 'published',
        timestamp: new Date().toISOString(),
        message: 'All blog caches cleared - new posts will appear immediately',
      });
    }
  } catch (error) {
    console.error('[Blogger Webhook] Error processing webhook:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to process webhook',
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Unknown error',
        }),
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/blogger-webhook',
    message: 'Blogger webhook endpoint is active',
    configured: !!WEBHOOK_SECRET,
    usage: 'Send POST request with webhook secret to trigger blog revalidation',
    setupGuide: 'https://www.emuski.com/docs/blogger-webhook-setup',
    timestamp: new Date().toISOString(),
  });
}
