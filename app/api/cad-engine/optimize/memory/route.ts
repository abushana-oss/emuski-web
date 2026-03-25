import { NextRequest, NextResponse } from 'next/server';
import { getAPISecurityHeaders } from '@/lib/security-headers';

const SECURITY_HEADERS = getAPISecurityHeaders();
// ✅ SECURITY FIX: Remove hardcoded URL fallback and client-side exposure
const _raw_url = process.env.CAD_ENGINE_URL;

if (!_raw_url) {
  throw new Error('CAD_ENGINE_URL environment variable is required for security');
}

const CAD_ENGINE_URL = _raw_url.endsWith('/') ? _raw_url.slice(0, -1) : _raw_url;

export async function POST(req: NextRequest) {
  const headers = new Headers(SECURITY_HEADERS);
  
  try {
    // Get the form data from the request
    const formData = await req.formData();
    
    // Proxy the request to the CAD engine backend
    const response = await fetch(`${CAD_ENGINE_URL}/optimize/memory`, {
      method: 'POST',
      headers: {
        'User-Agent': 'EMUSKI-CAD-Client/1.0'
      },
      body: formData,
      signal: AbortSignal.timeout(120000) // 2 minute timeout for optimization
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Service temporarily unavailable' }));
      return NextResponse.json(errorData, { 
        status: response.status,
        headers 
      });
    }

    const result = await response.json();
    return NextResponse.json(result, { headers });

  } catch (error: any) {
    console.error('CAD Engine optimize proxy error:', error.message);
    
    return NextResponse.json({
      success: false,
      error: 'Optimization service temporarily unavailable',
      details: error.message
    }, { 
      status: 503, 
      headers 
    });
  }
}