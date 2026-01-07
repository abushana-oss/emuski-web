/**
 * CORS Configuration Utility
 *
 * Implements Cross-Origin Resource Sharing (CORS) for API routes
 * Restricts API access to authorized domains only
 *
 * @author Principal Software Engineer
 * @version 1.0.0
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Allowed origins for CORS
 * Add your production domains here
 */
const ALLOWED_ORIGINS = [
  'https://www.emuski.com',
  'https://emuski.com',
  // Add staging/preview URLs if needed
  ...(process.env.NODE_ENV === 'development'
    ? ['http://localhost:3000', 'http://localhost:3001', 'http://127.0.0.1:3000']
    : []),
];

/**
 * Check if origin is allowed
 */
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Add CORS headers to a response
 *
 * @param response - Next.js response object
 * @param request - Next.js request object
 * @returns Response with CORS headers
 */
export function addCorsHeaders(response: NextResponse, request: NextRequest): NextResponse {
  const origin = request.headers.get('origin');

  // Check if origin is allowed
  if (origin && isOriginAllowed(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }

  // CORS headers
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With'
  );
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  return response;
}

/**
 * Handle CORS preflight (OPTIONS) requests
 *
 * @param request - Next.js request object
 * @returns 200 response with CORS headers
 */
export function handleCorsPreflightRequest(request: NextRequest): NextResponse {
  const response = new NextResponse(null, { status: 200 });
  return addCorsHeaders(response, request);
}

/**
 * Wrap an API route handler with CORS
 *
 * @param handler - API route handler function
 * @returns Handler with CORS support
 *
 * @example
 * ```typescript
 * export const POST = withCors(async (request: NextRequest) => {
 *   // Your handler logic
 *   return NextResponse.json({ success: true });
 * });
 * ```
 */
export function withCors(
  handler: (request: NextRequest) => Promise<NextResponse>
): (request: NextRequest) => Promise<NextResponse> {
  return async (request: NextRequest) => {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return handleCorsPreflightRequest(request);
    }

    // Execute handler and add CORS headers to response
    try {
      const response = await handler(request);
      return addCorsHeaders(response, request);
    } catch (error) {
      // On error, still return CORS headers
      const errorResponse = NextResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      );
      return addCorsHeaders(errorResponse, request);
    }
  };
}
