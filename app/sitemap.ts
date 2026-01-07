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
  const currentDate = new Date().toISOString();

  // Static pages with high priority (only include pages that actually exist)
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/manufacturing-services`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/precision-engineering`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/solutions/ai`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/cookie-policy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-and-conditions`,
      lastModified: currentDate,
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
