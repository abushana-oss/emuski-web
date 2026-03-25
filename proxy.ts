import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { generateCSPNonce, getEnhancedSecurityHeaders } from './src/lib/csp-nonce'
import crypto from 'crypto'

/**
 * Next.js Proxy Middleware
 * Handles:
 * - Server-side GA4 analytics tracking
 * - SEO-friendly URL normalization
 * - Security headers
 * - Basic security validation
 */

// Security configuration
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-DNS-Prefetch-Control': 'off',
  'Cross-Origin-Resource-Policy': 'cross-origin'
};

// GA4 Configuration for Server-Side Tracking
const GA4_MEASUREMENT_ID = 'G-QFDFYZLZPK'
const GA4_API_SECRET = process.env.GA4_API_SECRET || ''
const GA4_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`

// Admin route protection
const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'abushan.a@emuski.com')
  .split(',')
  .map(email => email.trim())

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

// Helper: Get proper page title based on pathname
function getPageTitle(pathname: string): string {
  const titleMap: Record<string, string> = {
    '/': 'EMUSKI - Your One-Stop Solution for OEM in Bangalore, India',
    '/manufacturing-services': 'Manufacturing Services - EMUSKI Engineering Solutions',
    '/cost-engineering': 'Cost Engineering & Optimization - EMUSKI',
    '/tools/3d-cad-analysis': '3D CAD Analysis Tool - EMUSKI',
    '/tools/2d-balloon-diagram': '2D Balloon Diagram Tool - EMUSKI',
    '/solutions/ai': 'AI Solutions for Manufacturing - EMUSKI',
    '/blog': 'Blog - Manufacturing Industry Insights | EMUSKI',
    '/gallery': 'Gallery - EMUSKI Manufacturing Portfolio',
    '/contact': 'Contact EMUSKI - Get Manufacturing Quote',
    '/auth/login': 'Login - EMUSKI Portal',
    '/auth/register': 'Register - EMUSKI Portal',
  }
  return titleMap[pathname] || `EMUSKI - ${pathname.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`
}

// Helper: Get content category for analytics
function getContentCategory(pathname: string): string {
  if (pathname.startsWith('/blog')) return 'blog'
  if (pathname === '/manufacturing-services') return 'services'
  if (pathname === '/cost-engineering') return 'cost-engineering'
  if (pathname.startsWith('/tools/')) return 'tools'
  if (pathname.startsWith('/solutions/')) return 'solutions'
  if (pathname.startsWith('/auth')) return 'auth'
  if (pathname === '/gallery') return 'gallery'
  if (pathname === '/contact') return 'contact'
  return 'general'
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

export default async function middleware(request: NextRequest) {
  try {
    // Generate CSP nonce for this request
    const nonce = generateCSPNonce()
    
    const { pathname, search, searchParams, origin } = request.nextUrl
    const host = request.headers.get('host') || ''
    const protocol = request.headers.get('x-forwarded-proto') || 'https'

    // Strip stale router state headers that cause parse failures
    // This fixes the "router state header could not be parsed" 500 errors on /auth/register
    // Known Turbopack/Next.js 15-16 issue with cached client headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.delete('Next-Router-State-Tree')
    requestHeaders.delete('Next-Router-Prefetch')
    requestHeaders.delete('Next-Url')
    // Set nonce on request headers so that:
    //  - next/headers() in the layout reads the same value (prevents SSR/hydration mismatch)
    //  - Next.js automatically threads it into <Script> components via x-nonce
    requestHeaders.set('x-nonce', nonce)

    // Skip authentication checks for static assets and API routes (except protected ones)
    if (
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/assets/') ||
      pathname.startsWith('/images/') ||
      pathname.endsWith('.ico') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.jpg') ||
      pathname.endsWith('.jpeg') ||
      pathname.endsWith('.svg') ||
      pathname.endsWith('.webp') ||
      pathname.endsWith('.gif') ||
      pathname.endsWith('.css') ||
      pathname.endsWith('.js') ||
      pathname.startsWith('/api/') && !pathname.startsWith('/api/admin')
    ) {
      return NextResponse.next({
        request: { headers: requestHeaders }
      })
    }

    // === ADMIN ROUTE PROTECTION ===
    // Server-side admin verification for admin routes
    if (pathname.startsWith('/admin')) {
      try {
        const response = NextResponse.next({
          request: { headers: requestHeaders }
        })
        
        const supabase = createServerClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            cookies: {
              get(name: string) {
                return request.cookies.get(name)?.value
              },
              set(name: string, value: string, options: any) {
                response.cookies.set(name, value, options)
              },
              remove(name: string, options: any) {
                response.cookies.set(name, '', { ...options, maxAge: 0 })
              },
            },
          }
        )
        
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session || !ADMIN_EMAILS.includes(session.user.email?.toLowerCase() ?? '')) {
          return NextResponse.redirect(new URL('/auth/login?redirectTo=' + encodeURIComponent(pathname), request.url))
        }
      } catch (error) {
        console.error('Admin auth middleware error:', error)
        return NextResponse.redirect(new URL('/auth/login', request.url))
      }
    }

    // === AUTHENTICATION NOTES ===
    // General authentication is handled client-side using ProtectedRoute component
    // Admin routes have server-side protection above
    // This middleware focuses on analytics, SEO, and security headers

    // === CANONICAL DOMAIN ENFORCEMENT (DISABLED TO FIX ERROR 520) ===
    // The canonical domain redirect was causing Error 520 due to redirect loops
    // Cloudflare is already handling the www redirection via page rules
    // Canonical tags in metadata are still enforcing canonical URLs for SEO

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

    // Continue with response using cleaned headers
    const response = NextResponse.next({
      request: { headers: requestHeaders }
    })

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
          page_title: getPageTitle(pathname),
          session_id: sessionId,
          engagement_time_msec: 100,
          tracking_method: 'server_side',
          page_path: pathname,
          content_group1: getContentCategory(pathname),
          content_group2: 'web',
          traffic_source: pageReferrer ? new URL(pageReferrer).hostname : 'direct',
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

    // Apply enhanced security headers with CSP nonce
    const enhancedHeaders = getEnhancedSecurityHeaders(nonce)
    Object.entries(enhancedHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })
    
    // Add nonce to response headers for client access
    response.headers.set('X-Nonce', nonce)
    
    // Generate unique request ID for tracking
    response.headers.set('X-Request-ID', crypto.randomUUID())

    return response
  } catch (error) {
    // Production error handling: log and continue without blocking
    console.error('[Middleware Error]', error)
    // Return basic response to prevent site outage with cleaned headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.delete('Next-Router-State-Tree')
    requestHeaders.delete('Next-Router-Prefetch')
    requestHeaders.delete('Next-Url')
    return NextResponse.next({
      request: { headers: requestHeaders }
    })
  }
}

export const config = {
  // Production-ready matcher: exclude static assets and Next.js internals
  // This prevents middleware from running on every asset request (images, fonts, etc.)
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, robots.txt, sitemap.xml
     * - Static file extensions (images, fonts, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:jpg|jpeg|gif|png|svg|ico|webp|avif|woff|woff2|ttf|eot|otf|css|js|map)$).*)',
  ],
}
