/**
 * Next.js 16.1 Proxy Configuration
 * Handles static asset caching and connection management
 */

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function proxy(request: NextRequest) {
  // Handle static assets with better caching
  if (request.nextUrl.pathname.startsWith('/_next/static/')) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
    response.headers.set('Connection', 'keep-alive')
    return response
  }
  
  // Handle chunks specifically
  if (request.nextUrl.pathname.includes('.js') && request.nextUrl.pathname.startsWith('/_next/')) {
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'public, max-age=3600')
    response.headers.set('Connection', 'keep-alive')
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/_next/static/:path*',
    '/_next/:path*\\.js',
  ],
}