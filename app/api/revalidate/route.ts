/**
 * On-Demand Revalidation API Route
 *
 * Webhook endpoint for invalidating cache when new blog posts are published
 * Call this from Blogger webhooks or manually to force cache refresh
 * Protected with secret token and rate limiting
 *
 * Usage:
 * POST /api/revalidate
 * Body: { "secret": "your_secret", "blogType": "manufacturing" | "engineering" | "successStories" }
 *
 * Or revalidate all blogs:
 * POST /api/revalidate
 * Body: { "secret": "your_secret" }
 */

import { revalidateBlog } from '@/lib/api/blogger';
import { NextRequest, NextResponse } from 'next/server';
// Rate limiting removed - using simple webhook protection

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, blogType } = body;

    // Verify secret from environment
    const validSecret = process.env.REVALIDATE_SECRET;

    if (!validSecret) {
      return NextResponse.json(
        { error: 'Revalidation secret not configured' },
        { status: 500 }
      );
    }

    if (secret !== validSecret) {
      return NextResponse.json(
        { error: 'Invalid revalidation secret' },
        { status: 401 }
      );
    }

    // Revalidate specific blog or all blogs
    if (blogType && ['manufacturing', 'engineering', 'successStories'].includes(blogType)) {
      await revalidateBlog(blogType as 'manufacturing' | 'engineering' | 'successStories');
      return NextResponse.json({
        revalidated: true,
        blogType,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Revalidate all blogs
      await revalidateBlog();
      return NextResponse.json({
        revalidated: true,
        blogType: 'all',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Unknown error',
        }),
      },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    message: 'Revalidation API is running',
    usage: 'POST with { secret, blogType } to revalidate cache',
    timestamp: new Date().toISOString(),
  });
}
