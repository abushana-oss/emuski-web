import { NextRequest, NextResponse } from 'next/server';
import { withSecurity, SECURITY_CONFIGS } from '@/lib/security-middleware';
import { withRateLimit } from '@/lib/rate-limiter';

async function imageProxyHandler(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);
  const imageUrl = searchParams.get('url');
  
  if (!imageUrl) {
    return NextResponse.json({ error: 'Missing image URL' }, { status: 400 });
  }

  // Validate allowed domains for security
  const allowedDomains = [
    'blogger.googleusercontent.com',
    'images.unsplash.com',
    'blogspot.com'
  ];
  
  const url = new URL(imageUrl);
  if (!allowedDomains.includes(url.hostname)) {
    return NextResponse.json({ error: 'Domain not allowed' }, { status: 403 });
  }

  try {
    // Fetch the image with proper headers
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'EMUSKI-ImageProxy/1.0',
        'Accept': 'image/*',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Return the image with CORP headers for COEP compliance
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cross-Origin-Resource-Policy': 'cross-origin',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      },
    });
  } catch (error: any) {
    console.error('Image proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
}

// Apply security and rate limiting
const securedHandler = withSecurity(imageProxyHandler, SECURITY_CONFIGS.API_DEFAULT);
export const GET = withRateLimit(securedHandler, '/api/image-proxy');