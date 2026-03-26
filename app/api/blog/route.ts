import { NextRequest, NextResponse } from 'next/server';
import { withSecurity, SECURITY_CONFIGS } from '@/lib/security-middleware';
import { withRateLimit } from '@/lib/rate-limiter';
import { BlogQuerySchema, validateRequest } from '@/lib/input-validation';

export const dynamic = 'force-dynamic'; // Prevent static generation

// In-memory cache for blog posts
const blogCache = new Map<string, { data: any, timestamp: number }>()
const CACHE_TTL = 300000 // 5 minutes

interface BlogPost {
  kind: string;
  id: string;
  blog: {
    id: string;
  };
  published: string;
  updated: string;
  url: string;
  selfLink: string;
  title: string;
  content: string;
  author: {
    id: string;
    displayName: string;
    url: string;
    image: {
      url: string;
    };
  };
  replies: {
    totalItems: string;
    selfLink: string;
  };
  labels?: string[];
}

interface BlogPostsResponse {
  kind: string;
  nextPageToken?: string;
  items: BlogPost[];
}

async function blogHandler(req: NextRequest): Promise<NextResponse> {
  // Extract and validate query parameters using Zod schema
  const { searchParams } = new URL(req.url);
  const queryParams = {
    blogId: searchParams.get('blogId'),
    maxResults: searchParams.get('maxResults') || '10',
    label: searchParams.get('label'),
  };
  
  // Validate using Zod schema
  const validation = BlogQuerySchema.safeParse(queryParams);
  if (!validation.success) {
    return NextResponse.json(
      { 
        error: 'Invalid query parameters',
        details: validation.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
      },
      { status: 400 }
    );
  }
  
  const { blogId, maxResults, label } = validation.data;

  const apiKey = process.env.BLOGGER_API_KEY;
  if (!apiKey) {
    console.error('BLOGGER_API_KEY not configured');
    return NextResponse.json(
      { error: 'Blog service not configured' },
      { status: 500 }
    );
  }

  try {
    // Check cache first
    const cacheKey = `${blogId}-${maxResults}-${label || 'all'}`
    const cached = blogCache.get(cacheKey)
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
      return NextResponse.json(cached.data, {
        headers: { 'X-Cache': 'HIT' }
      });
    }

    // Build API URL with optional label filter
    let apiUrl = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}&maxResults=${maxResults}&orderBy=published`;
    
    if (label) {
      apiUrl += `&labels=${encodeURIComponent(label)}`;
    }

    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Blogger API error: ${response.status} ${response.statusText}`);
    }

    const data: BlogPostsResponse = await response.json();
    
    // Cache the result
    blogCache.set(cacheKey, { data, timestamp: Date.now() })
    
    // Clean old cache entries
    if (blogCache.size > 50) {
      const oldestKeys = Array.from(blogCache.entries())
        .sort(([,a], [,b]) => a.timestamp - b.timestamp)
        .slice(0, 10)
        .map(([key]) => key)
      
      oldestKeys.forEach(key => blogCache.delete(key))
    }
    
    return NextResponse.json(data, {
      headers: { 'X-Cache': 'MISS' }
    });
  } catch (error: any) {
    console.error('Blog API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch blog posts',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Apply both security and rate limiting middleware
const securedHandler = withSecurity(blogHandler, SECURITY_CONFIGS.API_DEFAULT);
export const GET = withRateLimit(securedHandler, '/api/blog');