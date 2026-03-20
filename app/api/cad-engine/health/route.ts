import { NextRequest, NextResponse } from 'next/server';
import { getAPISecurityHeaders } from '@/lib/security-headers';

const SECURITY_HEADERS = getAPISecurityHeaders();
const CAD_ENGINE_URL = process.env.CAD_ENGINE_URL || process.env.NEXT_PUBLIC_CAD_ENGINE_URL || 'https://mithran-production-dc9d.up.railway.app';

export async function GET(req: NextRequest) {
  const headers = new Headers(SECURITY_HEADERS);
  
  try {
    // Proxy the health check to the CAD engine backend
    const response = await fetch(`${CAD_ENGINE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'EMUSKI-CAD-Client/1.0'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
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