/**
 * Engineering Blog API Hook
 * Fetches posts from the EMUSKI Engineering Blogger API
 *
 * NOTE: This is optional - if the blog doesn't exist yet, it gracefully returns empty array
 */

import { useState, useEffect } from 'react';
import { BlogPostSummary } from '../api/types';

// Engineering Blog ID - Read from backend environment
const ENGINEERING_BLOG_ID = '3127439607261561130';

// Feature flag to enable/disable engineering blog
const ENABLE_ENGINEERING_BLOG = true;

interface UseEngineeringPostsResult {
  posts: BlogPostSummary[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook to fetch engineering blog posts from Blogger API
 * Gracefully handles missing blog by returning empty array
 * @param maxResults - Maximum number of posts to fetch (default: 20)
 */
export const useEngineeringPosts = (maxResults: number = 20): UseEngineeringPostsResult => {
  const [posts, setPosts] = useState<BlogPostSummary[]>([]);
  const [loading, setLoading] = useState(false); // Start as false since it's optional
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEngineeringPosts = async () => {
      // Skip if feature is disabled or Blog ID not configured
      if (!ENABLE_ENGINEERING_BLOG || !ENGINEERING_BLOG_ID) {
        console.info('Engineering blog is disabled or not configured - skipping');
        setPosts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Use secure API route instead of direct Blogger API
        const response = await fetch(`/api/blog?blogId=${ENGINEERING_BLOG_ID}&maxResults=${maxResults}`);

        // Handle 404 or other errors gracefully
        if (!response.ok) {
          if (response.status === 404) {
            console.info('Engineering blog not found - it may not exist yet');
          } else {
            console.warn(`Engineering blog fetch failed: ${response.status} ${response.statusText}`);
          }
          setPosts([]);
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.items && Array.isArray(data.items)) {
          const transformedPosts: BlogPostSummary[] = data.items.map((item: any) => {
            // Extract first image from content
            const imgRegex = /<img[^>]+src="([^">]+)"/;
            const imgMatch = item.content?.match(imgRegex);
            const featuredImage = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800';

            // SEO-optimized description extraction
            let excerpt = '';
            let textContent = '';

            if (item.snippet) {
              // Use the custom description from Blogger
              excerpt = item.snippet.trim();

              // Ensure it's within SEO-optimal length (150-160 characters)
              if (excerpt.length > 160) {
                const lastSpace = excerpt.substring(0, 157).lastIndexOf(' ');
                excerpt = excerpt.substring(0, lastSpace > 100 ? lastSpace : 157) + '...';
              }
            } else {
              // Extract first meaningful paragraph for SEO
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = item.content || '';

              // Try to find first meaningful paragraph
              const paragraphs = Array.from(tempDiv.querySelectorAll('p'));
              let foundDescription = false;

              for (const para of paragraphs) {
                const text = (para.textContent || '').trim();

                // Skip short paragraphs (likely headings)
                if (text.length < 20) continue;

                // Skip common structural elements
                if (
                  /^(title|subtitle|heading|introduction|overview):/i.test(text) ||
                  /^(who the client|what the challenge|what emuski did|the result)/i.test(text)
                ) {
                  continue;
                }

                // Found our description
                excerpt = text;
                foundDescription = true;
                break;
              }

              // Fallback if no good paragraph found
              if (!foundDescription) {
                textContent = tempDiv.textContent || tempDiv.innerText || '';
                excerpt = textContent;
              }

              // Optimize length for SEO (150-160 characters is ideal)
              if (excerpt.length > 160) {
                // Try to cut at sentence boundary
                const sentences = excerpt.match(/[^.!?]+[.!?]+/g) || [];
                let optimized = '';

                for (const sentence of sentences) {
                  if ((optimized + sentence).length <= 160) {
                    optimized += sentence;
                  } else {
                    break;
                  }
                }

                // If we have a good sentence-based description, use it
                if (optimized.length >= 100) {
                  excerpt = optimized.trim();
                } else {
                  // Otherwise, cut at word boundary
                  const lastSpace = excerpt.substring(0, 157).lastIndexOf(' ');
                  excerpt = excerpt.substring(0, lastSpace > 100 ? lastSpace : 157) + '...';
                }
              }
            }

            // Get full text content for word count
            if (!textContent) {
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = item.content || '';
              textContent = tempDiv.textContent || tempDiv.innerText || '';
            }

            // Generate slug from title
            const slug = item.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '');

            // Estimate read time (average reading speed: 200 words/min)
            const wordCount = textContent.split(/\s+/).length;
            const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));
            const readTime = `${readTimeMinutes} min read`;

            return {
              id: item.id,
              title: item.title,
              slug: slug,
              excerpt: excerpt,
              fullContent: item.content || '',
              category: 'Engineering', // Default category for engineering blog
              tags: item.labels || [],
              author: item.author?.displayName || 'EMUSKI | Engineering',
              authorImage: item.author?.image?.url || '/assets/authors/default.jpg',
              publishDate: item.published,
              readTime: readTime,
              image: featuredImage,
            };
          });

          setPosts(transformedPosts);
        } else {
          setPosts([]);
        }
      } catch (err) {
        // Log error but don't break the app
        console.warn('Engineering blog fetch error (non-critical):', err);
        setPosts([]);
      } finally {
        setLoading(false);
        setError(null); // Don't propagate error since this is optional
      }
    };

    fetchEngineeringPosts();
  }, [maxResults]);

  return { posts, loading, error };
};
