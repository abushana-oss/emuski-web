/**
 * Netlify Scheduled Function for Automatic Blog Refresh
 *
 * This function automatically fetches new blogs from Blogger API
 * and refreshes the cache every 5 minutes.
 *
 * Netlify automatically runs this based on the schedule in netlify.toml
 */

export default async (request, context) => {
  console.log('[Netlify Cron] Starting automatic blog refresh...');

  try {
    // Call the Next.js API route to refresh blogs
    const siteUrl = process.env.URL || process.env.DEPLOY_PRIME_URL || 'https://www.emuski.com';
    const cronSecret = process.env.CRON_SECRET || process.env.REVALIDATE_SECRET;

    console.log(`[Netlify Cron] Calling API at: ${siteUrl}/api/cron/refresh-blogs`);

    const response = await fetch(`${siteUrl}/api/cron/refresh-blogs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cronSecret}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Netlify Cron] API Error Response: ${errorText}`);
      throw new Error(`Failed to refresh blogs: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('[Netlify Cron] Successfully refreshed all blogs:', data);

    return new Response(JSON.stringify({
      success: true,
      message: 'Blogs refreshed successfully',
      timestamp: new Date().toISOString(),
      data,
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('[Netlify Cron] ❌ Error refreshing blogs:', error);
    console.error('[Netlify Cron] Error stack:', error instanceof Error ? error.stack : 'No stack trace');

    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to refresh blogs',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
