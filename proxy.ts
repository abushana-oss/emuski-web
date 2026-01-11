import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js Proxy Middleware
 * Handles:
 * - Server-side GA4 analytics tracking
 * - SEO-friendly URL normalization
 * - Security headers
 */

// GA4 Configuration for Server-Side Tracking
const GA4_MEASUREMENT_ID = 'G-QFDFYZLZPK'
const GA4_API_SECRET = process.env.GA4_API_SECRET || ''
const GA4_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`

// Helper: Check if path should be tracked
function shouldTrackAnalytics(pathname: string): boolean {
  // Exclude API routes and static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/assets/') ||
    pathname.includes('.')
  ) {
    return false
  }
  return true
}

// Helper: Get or generate client ID
function getClientId(request: NextRequest): string {
  const gaClientId = request.cookies.get('_ga_client_id')?.value
  return gaClientId || `${Date.now()}.${Math.random().toString(36).substring(2, 11)}`
}

// Helper: Get or generate session ID
function getSessionId(request: NextRequest): string {
  const sessionId = request.cookies.get('_ga_session_id')?.value
  return sessionId || `${Date.now()}`
}

// Helper: Send GA4 event (non-blocking)
async function sendGA4Event(payload: any) {
  if (!GA4_API_SECRET) return // Skip if not configured

  try {
    fetch(GA4_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      // Silently fail - don't block response
    })
  } catch {
    // Silently fail
  }
}

export default function middleware(request: NextRequest) {
  const { pathname, search, searchParams, origin } = request.nextUrl
  const host = request.headers.get('host') || ''
  const protocol = request.headers.get('x-forwarded-proto') || 'https'

  // === CANONICAL DOMAIN ENFORCEMENT (SEO CRITICAL) ===
  // Force HTTPS + WWW to prevent duplicate indexing
  const CANONICAL_DOMAIN = 'www.emuski.com'

  // Skip enforcement for:
  // - Next.js internals (_next, api)
  // - Static files (images, fonts, etc.)
  // - Local development
  const isLocalDev = host.includes('localhost') || host.includes('127.0.0.1')
  const skipCanonicalEnforcement =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    isLocalDev

  if (!skipCanonicalEnforcement) {
    const needsCanonicalRedirect =
      protocol !== 'https' || // Force HTTPS
      host !== CANONICAL_DOMAIN // Force www.emuski.com

    if (needsCanonicalRedirect) {
      const canonicalUrl = `https://${CANONICAL_DOMAIN}${pathname}${search}`
      console.log(`[SEO Canonical Redirect] ${protocol}://${host}${pathname} → ${canonicalUrl}`)

      return NextResponse.redirect(canonicalUrl, {
        status: 301, // Permanent redirect for SEO
        headers: {
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }
  }

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

  // Continue with response
  const response = NextResponse.next()

  // === GA4 Server-Side Tracking ===
  if (shouldTrackAnalytics(pathname) && GA4_API_SECRET) {
    const clientId = getClientId(request)
    const sessionId = getSessionId(request)
    const isFirstVisit = !request.cookies.has('_ga_client_id')
    const isNewSession = !request.cookies.has('_ga_session_id')

    // Set cookies for tracking
    response.cookies.set('_ga_client_id', clientId, {
      maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    response.cookies.set('_ga_session_id', sessionId, {
      maxAge: 60 * 30, // 30 minutes
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    // Prepare events
    const events = []
    const pageLocation = origin + pathname + (searchParams.toString() ? '?' + searchParams.toString() : '')
    const pageReferrer = request.headers.get('referer') || ''

    // First visit event
    if (isFirstVisit) {
      events.push({
        name: 'first_visit',
        params: {
          page_location: pageLocation,
          page_referrer: pageReferrer,
          session_id: sessionId,
          engagement_time_msec: 100,
          tracking_method: 'server_side',
        },
      })
    }

    // Session start event
    if (isNewSession) {
      events.push({
        name: 'session_start',
        params: {
          page_location: pageLocation,
          page_referrer: pageReferrer,
          session_id: sessionId,
          engagement_time_msec: 100,
          tracking_method: 'server_side',
        },
      })
    }

    // Page view event (always)
    events.push({
      name: 'page_view',
      params: {
        page_location: pageLocation,
        page_referrer: pageReferrer,
        page_title: pathname,
        session_id: sessionId,
        engagement_time_msec: 100,
        tracking_method: 'server_side',
      },
    })

    // Send events to GA4 (non-blocking)
    const payload = {
      client_id: clientId,
      timestamp_micros: Date.now() * 1000,
      non_personalized_ads: false,
      events,
    }

    sendGA4Event(payload)
  }

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
