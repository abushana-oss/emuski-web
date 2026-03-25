import { NextRequest, NextResponse } from 'next/server';
import { getAPISecurityHeaders } from '@/lib/security-headers';
import { withRateLimit } from '@/lib/rate-limiter';

const SECURITY_HEADERS = getAPISecurityHeaders();
// ✅ SECURITY FIX: Remove hardcoded URL fallback and client-side exposure
const _raw_url = process.env.CAD_ENGINE_URL;

if (!_raw_url) {
  throw new Error('CAD_ENGINE_URL environment variable is required for security');
}

const CAD_ENGINE_URL = _raw_url.endsWith('/') ? _raw_url.slice(0, -1) : _raw_url;

async function getHandler(req: NextRequest): Promise<NextResponse> {
  const headers = new Headers(SECURITY_HEADERS);
  
  try {
    // Proxy the health check to the CAD engine backend with shorter timeout
    const response = await fetch(`${CAD_ENGINE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'EMUSKI-CAD-Client/1.0'
      },
      signal: AbortSignal.timeout(5000) // 5 second timeout
    });

    if (!response.ok) {
      throw new Error(`CAD Engine health check failed: ${response.status} ${response.statusText}`);
    }

    const healthData = await response.json();

    return NextResponse.json({
      status: 'healthy',
      service: 'CAD Engine Proxy',
      backend: {
        url: CAD_ENGINE_URL,
        status: healthData.status || 'unknown',
        ...healthData
      },
      timestamp: new Date().toISOString()
    }, { headers });

  } catch (error: any) {
    console.error('CAD Engine health check failed:', error.message);
    
    return NextResponse.json({
      status: 'unhealthy',
      service: 'CAD Engine Proxy', 
      backend: {
        url: CAD_ENGINE_URL,
        status: 'unreachable',
        error: error.message
      },
      timestamp: new Date().toISOString()
    }, { 
      status: 503, 
      headers 
    });
  }
}

// Apply rate limiting
export const GET = withRateLimit(getHandler, '/api/cad-engine/health');