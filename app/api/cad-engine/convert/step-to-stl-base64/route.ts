import { NextRequest, NextResponse } from 'next/server';
import { getAPISecurityHeaders } from '@/lib/security-headers';
import { authenticateRequest } from '@/lib/jwt-auth';
import { withRateLimit } from '@/lib/rate-limiter';
import { withSecurity } from '@/lib/security-middleware';
import { z } from 'zod';

const SECURITY_HEADERS = getAPISecurityHeaders();
// ✅ SECURITY FIX: Remove hardcoded URL fallback
const _raw_url = process.env.CAD_ENGINE_URL;

if (!_raw_url) {
  throw new Error('CAD_ENGINE_URL environment variable is required for security');
}

const CAD_ENGINE_URL = _raw_url.endsWith('/') ? _raw_url.slice(0, -1) : _raw_url;

// File validation schema for STEP to STL conversion
const StepConversionSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 100 * 1024 * 1024, // 100MB limit
    'File size must be less than 100MB'
  ).refine(
    (file) => /\.(step|stp)$/i.test(file.name),
    'File must be a STEP file (.step, .stp)'
  ),
});

async function handleStepToStlConversion(req: NextRequest) {
  const headers = new Headers(SECURITY_HEADERS);
  
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    const authResult = await authenticateRequest(authHeader);
    
    if (!authResult.valid || !authResult.userId) {
      return NextResponse.json(
        { error: 'Authentication required for file conversion' },
        { status: 401, headers }
      );
    }

    // Get the form data from the request
    const formData = await req.formData();
    
    // Validate uploaded file
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json(
        { error: 'STEP file is required for conversion' },
        { status: 400, headers }
      );
    }

    // Validate file against schema
    const validation = StepConversionSchema.safeParse({ file });
    if (!validation.success) {
      return NextResponse.json(
        { 
          error: 'Invalid file for conversion',
          details: validation.error.errors.map(e => e.message)
        },
        { status: 400, headers }
      );
    }

    // Add user context to the form data
    formData.append('user_id', authResult.userId);
    formData.append('user_email', authResult.email || '');
    
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
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { 
      status: 503, 
      headers 
    });
  }
}

// Apply security middleware and rate limiting
export const POST = withSecurity(
  withRateLimit(handleStepToStlConversion, '/api/cad-engine/convert/step-to-stl-base64')
);