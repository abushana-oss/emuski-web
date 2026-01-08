import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  // SEO-friendly URL normalization for blog query parameters
  if (pathname === '/blog' && search) {
    const url = new URL(request.url)
    let needsRedirect = false

    // Normalize tag parameter: Convert spaces to hyphens and lowercase
    // Example: /blog?tag=OEM%20supplier%20management → /blog?tag=oem-supplier-management
    const tagParam = url.searchParams.get('tag')
    if (tagParam) {
      const hasSpaces = tagParam.includes(' ') || /%20|\+/.test(tagParam)
      const hasUppercase = /[A-Z]/.test(tagParam)

      if (hasSpaces || hasUppercase) {
        const normalizedTag = tagParam
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/%20/g, '-')
          .replace(/\+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '')

        url.searchParams.set('tag', normalizedTag)
        needsRedirect = true
      }
    }

    // Normalize category parameter: Convert to lowercase and kebab-case
    // Example: /blog?category=Success%20Story → /blog?category=success-story
    const categoryParam = url.searchParams.get('category')
    if (categoryParam) {
      const hasSpaces = categoryParam.includes(' ') || /%20|\+/.test(categoryParam)
      const hasUppercase = /[A-Z]/.test(categoryParam)

      if (hasSpaces || hasUppercase) {
        const normalizedCategory = categoryParam
          .toLowerCase()
          .trim()
          .replace(/\s+/g, '-')
          .replace(/%20/g, '-')
          .replace(/\+/g, '-')
          .replace(/[^a-z0-9-]/g, '')
          .replace(/-+/g, '-')
          .replace(/^-+|-+$/g, '')

        url.searchParams.set('category', normalizedCategory)
        needsRedirect = true
      }
    }

    // Return 301 permanent redirect if any parameter was normalized
    if (needsRedirect) {
      return NextResponse.redirect(url, {
        status: 301,
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }
  }

  // Continue with security headers
  const response = NextResponse.next()

  // Content Security Policy - Updated to include all Google, Mixpanel, and reCAPTCHA domains
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com https://*.gstatic.com https://*.googletagmanager.com https://*.google-analytics.com https://tagmanager.google.com https://www.googleadservices.com https://*.googlesyndication.com https://*.doubleclick.net https://cdn.mxpnl.com",
      "script-src-elem 'self' 'unsafe-inline' https://*.google.com https://*.gstatic.com https://*.googletagmanager.com https://*.google-analytics.com https://tagmanager.google.com https://www.googleadservices.com https://*.googlesyndication.com https://*.doubleclick.net https://cdn.mxpnl.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://tagmanager.google.com",
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https: https://*.google.com https://*.gstatic.com https://*.google-analytics.com https://*.googletagmanager.com https://*.doubleclick.net https://*.blogger.com https://*.blogspot.com https://blogger.googleusercontent.com https://images.unsplash.com https://via.placeholder.com",
      "connect-src 'self' https://*.google.com https://www.googleapis.com https://*.googleapis.com https://*.google-analytics.com https://*.analytics.google.com https://*.doubleclick.net https://*.googletagmanager.com https://*.blogger.com https://blogger.googleusercontent.com https://api.mixpanel.com https://api-js.mixpanel.com https://cdn.mxpnl.com https://*.supabase.co",
      "frame-src 'self' https://*.google.com https://*.googletagmanager.com https://td.doubleclick.net",
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
