import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
  // Continue with security headers
  const response = NextResponse.next()

  // Content Security Policy - Updated to include all Google and Mixpanel domains
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.googletagmanager.com https://*.google-analytics.com https://tagmanager.google.com https://www.googleadservices.com https://*.googlesyndication.com https://*.doubleclick.net https://cdn.mxpnl.com",
      "script-src-elem 'self' 'unsafe-inline' https://*.google.com https://*.googletagmanager.com https://*.google-analytics.com https://tagmanager.google.com https://www.googleadservices.com https://*.googlesyndication.com https://*.doubleclick.net https://cdn.mxpnl.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://tagmanager.google.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: https://*.google.com https://*.google-analytics.com https://*.googletagmanager.com https://*.doubleclick.net https://*.blogger.com https://*.blogspot.com https://blogger.googleusercontent.com https://images.unsplash.com https://via.placeholder.com",
      "connect-src 'self' https://*.google.com https://www.googleapis.com https://*.googleapis.com https://*.google-analytics.com https://*.analytics.google.com https://*.doubleclick.net https://*.googletagmanager.com https://*.blogger.com https://blogger.googleusercontent.com https://api.mixpanel.com https://api-js.mixpanel.com",
      "frame-src 'self' https://*.googletagmanager.com https://td.doubleclick.net",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "upgrade-insecure-requests"
    ].join('; ')
  )

  // Additional security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  response.headers.set('X-DNS-Prefetch-Control', 'on')

  return response
}

export const config = {
  // Apply security headers to all routes and assets
  matcher: '/:path*',
}
