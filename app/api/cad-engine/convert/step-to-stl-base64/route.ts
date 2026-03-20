import { NextRequest, NextResponse } from 'next/server';
import { getAPISecurityHeaders } from '@/lib/security-headers';

const SECURITY_HEADERS = getAPISecurityHeaders();
const _raw_url = process.env.CAD_ENGINE_URL || process.env.NEXT_PUBLIC_CAD_ENGINE_URL || 'https://emuski-web-production.up.railway.app';
const CAD_ENGINE_URL = _raw_url.endsWith('/') ? _raw_url.slice(0, -1) : _raw_url;

export async function POST(req: NextRequest) {
  const headers = new Headers(SECURITY_HEADERS);
  
  try {
    // Get the form data from the request
    const formData = await req.formData();
    
    // Proxy the request to the CAD engine backend
    const response = await fetch(`${CAD_ENGINE_URL}/convert/step-to-stl-base64`, {
      method: 'POST',
      headers: {
        'User-Agent': 'EMUSKI-CAD-Client/1.0'
      },
      body: formData,
      signal: AbortSignal.timeout(120000) // 2 minute timeout for conversions
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Service temporarily unavailable' }));
      return NextResponse.json(errorData, { 
        status: response.status,
        headers 
      });
    }

    const result = await response.json();
    
    // Add industry-standard cache headers for successful conversions
    if (result.success) {
      headers.set('Cache-Control', 'public, max-age=3600, s-maxage=86400'); // 1 hour client, 24 hours CDN
      headers.set('ETag', `"${result.stl_filename}-${result.stl_size}"`);
      headers.set('Vary', 'Accept-Encoding');
    }
    
    return NextResponse.json(result, { headers });

  } catch (error: any) {
    console.error('CAD Engine convert proxy error:', error.message);
    // Add no-cache headers for failed conversions
    headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    return NextResponse.json({
      success: false,
      error: 'Conversion service temporarily unavailable',
      details: error.message
    }, { 
      status: 503, 
      headers 
    });
  }
}