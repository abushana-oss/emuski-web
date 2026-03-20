import { NextRequest, NextResponse } from 'next/server';
import { withSecurity, SECURITY_CONFIGS } from '@/lib/security-middleware';

async function singlePostHandler(
  req: NextRequest,
  { params }: { params: { postId: string } }
): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const blogId = searchParams.get('blogId');
  const { postId } = params;
  
  if (!blogId || !postId) {
    return NextResponse.json(
      { error: 'blogId and postId parameters are required' },
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
    const response = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${postId}?key=${apiKey}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Blogger API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Single post API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch blog post',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export const GET = withSecurity(singlePostHandler, SECURITY_CONFIGS.API_DEFAULT);