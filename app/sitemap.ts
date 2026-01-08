import { MetadataRoute } from 'next';
import { fetchAllBlogs } from '@/lib/api/blogger';

/**
 * Dynamic Sitemap Generation for EMUSKI
 *
 * Industry Standard SEO Implementation:
 * - Automatically includes all blog posts from Blogger API
 * - Updates every hour via ISR (revalidate: 3600)
 * - Proper priority and changefreq settings
 * - Ensures Google discovers all canonical URLs
 *
 * Performance: ISR-cached, rebuilds hourly to stay in sync with blog updates
 */
export const revalidate = 3600; // 1 hour ISR, matches blog revalidation

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.emuski.com';

  // Fixed dates for static pages - only update when pages actually change
  // This prevents unnecessary crawling and crawl budget waste
  const STATIC_PAGES_LASTMOD = '2026-01-08'; // Update this when you modify static pages
  const LEGAL_PAGES_LASTMOD = '2024-11-01'; // Update this when legal pages change
  const currentDate = new Date().toISOString(); // Only for dynamic blog listing

  // Static pages with high priority (only include pages that actually exist)
  // 2026 SEO Best Practice: Strategic priority and change frequency optimization
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: STATIC_PAGES_LASTMOD,
      changeFrequency: 'weekly',
      priority: 1.0, // Homepage - highest priority
    },
    // Core service pages - very high priority (2026 focus on service pages)
    {
      url: `${baseUrl}/services`,
      lastModified: STATIC_PAGES_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.98, // Main services hub - critical for conversions
    },
    {
      url: `${baseUrl}/precision-engineering`,
      lastModified: STATIC_PAGES_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.97, // Primary service page - optimized for indexing
    },
    {
      url: `${baseUrl}/manufacturing-services`,
      lastModified: STATIC_PAGES_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.96, // Primary service page
    },
    {
      url: `${baseUrl}/cost-engineering-services`,
      lastModified: STATIC_PAGES_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.95, // Core service offering
    },
    // Geographic-specific service pages
    {
      url: `${baseUrl}/manufacturing-in-bangalore`,
      lastModified: STATIC_PAGES_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.94, // Local SEO focus
    },
    {
      url: `${baseUrl}/cost-engineering-uk`,
      lastModified: STATIC_PAGES_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.93, // International market focus
    },
    {
      url: `${baseUrl}/cost-engineering-usa`,
      lastModified: STATIC_PAGES_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.93, // International market focus
    },
    {
      url: `${baseUrl}/cost-engineering-germany`,
      lastModified: STATIC_PAGES_LASTMOD,
      changeFrequency: 'weekly',
      priority: 0.93, // International market focus
    },
    // Innovation and technology pages
    {
      url: `${baseUrl}/solutions/ai`,
      lastModified: STATIC_PAGES_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.90, // Technology showcase
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: STATIC_PAGES_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate, // Dynamic - changes when new posts are added
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: STATIC_PAGES_LASTMOD,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: LEGAL_PAGES_LASTMOD,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: LEGAL_PAGES_LASTMOD,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: LEGAL_PAGES_LASTMOD,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Fetch all blog posts dynamically - now fetches ALL posts automatically
  let blogPages: MetadataRoute.Sitemap = [];

  try {
    const { all: allPosts } = await fetchAllBlogs(true);

    blogPages = allPosts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.publishDate || currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

    console.log(`Sitemap generated with ${blogPages.length} blog posts`);
  } catch (error) {
    console.error('Error generating blog sitemap entries:', error);
    // Return static pages even if blog fetch fails
  }

  return [...staticPages, ...blogPages];
}
