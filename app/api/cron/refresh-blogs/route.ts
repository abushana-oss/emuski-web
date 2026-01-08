/**
 * Automatic Blog Refresh Cron Job
 *
 * This endpoint automatically fetches new blogs from Blogger API
 * and refreshes the cache every time it's called.
 *
 * Setup with Vercel Cron (vercel.json):
 * {
 *   "crons": [{
 *     "path": "/api/cron/refresh-blogs",
 *     "schedule": "* * * * *"  // Every minute
 *   }]
 * }
 *
 * Or use external cron service (cron-job.org, EasyCron):
 * - URL: https://yourdomain.com/api/cron/refresh-blogs
 * - Schedule: Every 1 minute
 * - Method: GET or POST
 * - Header: Authorization: Bearer YOUR_CRON_SECRET
 */

import { revalidateBlog } from '@/lib/api/blogger';
import { NextRequest, NextResponse } from 'next/server';

const CRON_SECRET = process.env.CRON_SECRET || process.env.REVALIDATE_SECRET;

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret for security
    const authHeader = request.headers.get('authorization');
    const providedSecret = authHeader?.replace('Bearer ', '') || authHeader;

    // Allow requests without secret in development, require in production
    if (process.env.NODE_ENV === 'production' && providedSecret !== CRON_SECRET) {
      console.warn('[Blog Cron] Unauthorized cron attempt');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.info('[Blog Cron] Starting automatic blog refresh...');

    // Revalidate all blogs (manufacturing, engineering, success stories)
    await revalidateBlog();

    console.info('[Blog Cron] ✅ Successfully refreshed all blogs from Blogger API');

    return NextResponse.json({
      success: true,
      message: 'All blogs refreshed successfully',
      blogs: ['manufacturing', 'engineering', 'successStories'],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[Blog Cron] ❌ Error refreshing blogs:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to refresh blogs',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Also support POST requests
export async function POST(request: NextRequest) {
  return GET(request);
}
