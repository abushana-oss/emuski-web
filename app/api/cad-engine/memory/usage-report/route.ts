import { NextRequest, NextResponse } from 'next/server';
import { getAPISecurityHeaders } from '@/lib/security-headers';
import { authenticateRequest } from '@/lib/jwt-auth';
import { isAdminUser } from '@/lib/auth-config';
import { withRateLimit } from '@/lib/rate-limiter';
import { withSecurity } from '@/lib/security-middleware';

export const dynamic = 'force-dynamic'; // Prevent static generation

const SECURITY_HEADERS = getAPISecurityHeaders();
// ✅ SECURITY FIX: Remove hardcoded URL fallback
const _raw_url = process.env.CAD_ENGINE_URL;

if (!_raw_url) {
  throw new Error('CAD_ENGINE_URL environment variable is required for security');
}

const CAD_ENGINE_URL = _raw_url.endsWith('/') ? _raw_url.slice(0, -1) : _raw_url;

async function handleMemoryReport(req: NextRequest) {
  const headers = new Headers(SECURITY_HEADERS);
  
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    const authResult = await authenticateRequest(authHeader);
    
    if (!authResult.valid || !authResult.userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401, headers }
      );
    }

    // Check admin privileges
    const adminStatus = await isAdminUser(authResult.email || '');
    if (!adminStatus) {
      return NextResponse.json(
        { error: 'Admin privileges required for memory reports' },
        { status: 403, headers }
      );
    }
    // Proxy the request to the CAD engine backend
    const response = await fetch(`${CAD_ENGINE_URL}/memory/usage-report`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'EMUSKI-CAD-Client/1.0'
      },
      signal: AbortSignal.timeout(30000) // 30 second timeout for reports
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
    console.error('CAD Engine memory report proxy error:', error.message);
    
    return NextResponse.json({
      success: false,
      error: 'Memory report service temporarily unavailable',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { 
      status: 503, 
      headers 
    });
  }
}

// Apply security middleware and rate limiting (admin only)
export const GET = withSecurity(
  withRateLimit(handleMemoryReport, '/api/cad-engine/memory/usage-report')
);