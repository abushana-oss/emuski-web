/**
 * Next.js Middleware - Minimal Production Error Handling
 * Handles connection errors and chunk loading issues
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)
  
  // Add cache control for static assets to prevent connection issues
  const url = request.nextUrl
  
  // Handle static assets with better caching
  if (url.pathname.startsWith('/_next/static/')) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    response.headers.set('Connection', 'keep-alive')
    return response
  }
  
  // Handle chunks specifically
  if (url.pathname.includes('.js') && url.pathname.startsWith('/_next/')) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'public, max-age=3600')
    response.headers.set('Connection', 'keep-alive')
    return response
  }
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/image|favicon.ico).*)',
  ],
}