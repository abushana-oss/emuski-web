import { NextRequest, NextResponse } from 'next/server';
import { withSecurity, SECURITY_CONFIGS } from '@/lib/security-middleware';

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
  const { searchParams } = new URL(req.url);
  const blogId = searchParams.get('blogId');
  const maxResults = searchParams.get('maxResults') || '10';
  const label = searchParams.get('label');
  
  if (!blogId) {
    return NextResponse.json(
      { error: 'blogId parameter is required' },
      { status: 400 }
    );
  }

  const apiKey = process.env.BLOGGER_API_KEY;
  if (!apiKey) {
    console.error('BLOGGER_API_KEY not configured');
    return NextResponse.json(
      { error: 'Blog service not configured' },
      { status: 500 }
    );
  }

  try {
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
    
    return NextResponse.json(data);
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

export const GET = withSecurity(blogHandler, SECURITY_CONFIGS.API_DEFAULT);