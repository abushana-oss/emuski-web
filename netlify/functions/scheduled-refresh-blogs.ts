/**
 * Netlify Scheduled Function for Automatic Blog Refresh
 *
 * This function automatically fetches new blogs from Blogger API
 * and refreshes the cache every minute.
 *
 * Netlify automatically runs this based on the schedule in netlify.toml
 */

import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  console.log('[Netlify Cron] Starting automatic blog refresh...');

  try {
    // Call the Next.js API route to refresh blogs
    const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || 'https://www.emuski.com';
    const cronSecret = process.env.CRON_SECRET || process.env.REVALIDATE_SECRET;

    const response = await fetch(`${siteUrl}/api/cron/refresh-blogs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to refresh blogs: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[Netlify Cron] ✅ Successfully refreshed all blogs:', data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Blogs refreshed successfully',
        timestamp: new Date().toISOString(),
        data,
      }),
    };
  } catch (error) {
    console.error('[Netlify Cron] ❌ Error refreshing blogs:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: 'Failed to refresh blogs',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }),
    };
  }
};

export { handler };
