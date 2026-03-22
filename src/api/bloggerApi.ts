// SECURITY WARNING: This client-side file should NOT contain API keys
// Client-side API calls should route through secure server endpoints
const BLOGGER_API_BASE = 'https://www.googleapis.com/blogger/v3';

// Use server-side API endpoint for secure requests
const INTERNAL_API_BASE = '/api/blog';

console.warn('Client-side Blogger API is deprecated. Use server-side /api/blog endpoints for security.');

// Cache blog IDs by URL to support multiple blogs
const BLOG_ID_CACHE = new Map<string, string>();

export interface BloggerPost {
  id: string;
  title: string;
  content: string;
  published: string;
  updated: string;
  url: string;
  author: {
    displayName: string;
    image?: {
      url: string;
    };
  };
  labels?: string[];
  images?: {
    url: string;
  }[];
  snippet?: string; // Custom description/snippet from Blogger
}

export interface BloggerResponse {
  items: BloggerPost[];
  nextPageToken?: string;
}

// DEPRECATED: Use server-side API instead for security
// Get blog ID from blog URL via secure server endpoint
export async function getBlogId(blogUrl: string): Promise<string> {
  console.warn('DEPRECATED: getBlogId should use server-side API for security');
  
  // Check if we already have this blog ID cached
  if (BLOG_ID_CACHE.has(blogUrl)) {
    return BLOG_ID_CACHE.get(blogUrl)!;
  }

  try {
    // Route through secure server endpoint instead of direct API call
    const response = await fetch(`${INTERNAL_API_BASE}/blog-id?url=${encodeURIComponent(blogUrl)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch blog ID');
    }

    const data = await response.json();
    // Cache the blog ID for this specific URL
    BLOG_ID_CACHE.set(blogUrl, data.id);
    return data.id;
  } catch (error) {
    console.error('Error fetching blog ID:', error);
    throw error;
  }
}

// DEPRECATED: Use server-side API instead for security
// Fetch blog posts via secure server endpoint
export async function fetchBloggerPosts(
  blogId: string,
  maxResults: number = 10,
  pageToken?: string
): Promise<BloggerResponse> {
  console.warn('DEPRECATED: fetchBloggerPosts should use server-side API for security');
  
  try {
    // Route through secure server endpoint
    const params = new URLSearchParams({
      blogId,
      maxResults: maxResults.toString(),
      ...(pageToken && { pageToken })
    });

    const response = await fetch(`${INTERNAL_API_BASE}?${params}`);

    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

// DEPRECATED: Use server-side API instead for security
// Fetch a single post by ID via secure server endpoint
export async function fetchBloggerPost(blogId: string, postId: string): Promise<BloggerPost> {
  console.warn('DEPRECATED: fetchBloggerPost should use server-side API for security');
  
  try {
    // Route through secure server endpoint
    const params = new URLSearchParams({ blogId });
    const response = await fetch(`${INTERNAL_API_BASE}/${postId}?${params}`);

    if (!response.ok) {
      throw new Error('Failed to fetch blog post');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }
}

// DEPRECATED: Use server-side API instead for security
// Search posts by label via secure server endpoint
export async function searchBloggerPostsByLabel(
  blogId: string,
  label: string,
  maxResults: number = 10
): Promise<BloggerResponse> {
  console.warn('DEPRECATED: searchBloggerPostsByLabel should use server-side API for security');
  
  try {
    // Route through secure server endpoint
    const params = new URLSearchParams({
      blogId,
      label: encodeURIComponent(label),
      maxResults: maxResults.toString()
    });

    const response = await fetch(`${INTERNAL_API_BASE}?${params}`);

    if (!response.ok) {
      throw new Error('Failed to search blog posts');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching blog posts:', error);
    throw error;
  }
}

// Helper function to decode HTML entities and clean text
function decodeHtmlEntities(text: string): string {
  const textarea = typeof document !== 'undefined' ? document.createElement('textarea') : null;
  if (textarea) {
    textarea.innerHTML = text;
    return textarea.value;
  }
  // Fallback for server-side: manual decode common entities
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&rsquo;/g, "'")
    .replace(/&lsquo;/g, "'")
    .replace(/&rdquo;/g, '"')
    .replace(/&ldquo;/g, '"');
}

/**
 * SEO-optimized description extraction
 * Extracts a meaningful description following Google's best practices:
 * - 150-160 characters for optimal search result display
 * - First meaningful paragraph (skips headings, titles, etc.)
 * - Clean, readable text without HTML or special formatting
 *
 * @param content - Raw HTML content from Blogger
 * @returns Clean, SEO-friendly description
 */
function extractSEODescription(content: string): string {
  // Remove script and style tags completely
  let cleaned = content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<head[^>]*>[\s\S]*?<\/head>/gi, '');

  // Extract all paragraphs
  const paragraphMatches = cleaned.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];

  let description = '';

  // Find the first meaningful paragraph
  for (const para of paragraphMatches) {
    // Remove HTML tags from paragraph
    const text = para
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Decode HTML entities
    const decoded = decodeHtmlEntities(text);

    // Skip if it's too short (likely a heading or label)
    if (decoded.length < 20) continue;

    // Skip common structural elements
    if (
      /^(title|subtitle|heading|who the client|what the challenge|what emuski did|the result):/i.test(decoded) ||
      /^(introduction|overview|summary):/i.test(decoded)
    ) {
      continue;
    }

    // This is likely our description
    description = decoded;
    break;
  }

  // If no good paragraph found, try getting first meaningful text block
  if (!description) {
    const textContent = cleaned
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    description = decodeHtmlEntities(textContent);

    // Remove common prefixes
    description = description
      .replace(/^Title:\s*[^.!?]+[.!?]\s*/i, '')
      .replace(/^Breaking the Barrier:\s*[^.!?]+[.!?]\s*/i, '')
      .replace(/^Zero-Zero Tolerance:\s*[^.!?]+[.!?]\s*/i, '')
      .replace(/^Sourcing the Impossible:\s*[^.!?]+[.!?]\s*/i, '')
      .replace(/^Accelerating Innovation:\s*[^.!?]+[.!?]\s*/i, '')
      .trim();
  }

  // Optimize length for SEO (150-160 characters is ideal for meta descriptions)
  if (description.length > 160) {
    // Try to cut at sentence boundary
    const sentences = description.match(/[^.!?]+[.!?]+/g) || [];
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
      description = optimized.trim();
    } else {
      // Otherwise, cut at word boundary
      description = description.substring(0, 157).trim();
      const lastSpace = description.lastIndexOf(' ');
      if (lastSpace > 100) {
        description = description.substring(0, lastSpace) + '...';
      } else {
        description = description + '...';
      }
    }
  }

  return description;
}

// Convert Blogger post to our BlogPost format
export function convertBloggerPostToLocalFormat(post: BloggerPost) {
  // Extract first image from content if available
  const imgMatch = post.content.match(/<img[^>]+src="([^">]+)"/);
  const image = imgMatch ? imgMatch[1] : 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&q=80';

  // Use snippet/description if available from Blogger (Search Description)
  // Otherwise use our SEO-optimized extraction algorithm
  let excerpt = '';
  if (post.snippet) {
    // Use the custom description from Blogger
    excerpt = decodeHtmlEntities(post.snippet.trim());

    // Ensure it's within SEO-optimal length (150-160 characters)
    if (excerpt.length > 160) {
      const lastSpace = excerpt.substring(0, 157).lastIndexOf(' ');
      excerpt = excerpt.substring(0, lastSpace > 100 ? lastSpace : 157) + '...';
    }
  } else {
    // Use our intelligent SEO description extraction
    excerpt = extractSEODescription(post.content);
  }

  // Extract full text content for word count
  let textContent = post.content
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  textContent = decodeHtmlEntities(textContent);

  // Generate slug from title
  const slug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  // Calculate read time (rough estimate: 200 words per minute)
  const wordCount = textContent.split(/\s+/).length;
  const readTime = `${Math.ceil(wordCount / 200)} min read`;

  return {
    id: post.id,
    slug: slug,
    title: post.title,
    excerpt: excerpt,
    content: textContent.substring(0, 500),
    fullContent: post.content,
    category: post.labels?.[0] || 'Blog',
    author: post.author.displayName,
    authorBio: '',
    authorImage: post.author.image?.url || '/assets/authors/default.jpg',
    publishDate: new Date(post.published).toISOString().split('T')[0],
    readTime: readTime,
    image: image,
    tags: post.labels || [],
    featured: false,
    seoTitle: post.title,
    metaDescription: excerpt,
    keywords: post.labels || [],
    bloggerUrl: post.url // Original Blogger post URL
  };
}
