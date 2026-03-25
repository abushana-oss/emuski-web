import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { withRateLimit } from '@/lib/rate-limiter'
import { AnalyticsEventSchema, validateRequest } from '@/lib/input-validation'

export const dynamic = 'force-dynamic'; // Prevent static generation

/**
 * GA4 Measurement Protocol Server-Side Tracking
 *
 * This endpoint sends events directly to Google Analytics 4 from the server
 * Benefits:
 * - Works in China (bypasses Great Firewall)
 * - Bypasses ad blockers
 * - More accurate bot detection
 * - Better for privacy compliance
 */

// GA4 Configuration - Secure environment variables
const GA4_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''
const GA4_API_SECRET = process.env.GA4_API_SECRET || ''

// Security validation
if (!GA4_MEASUREMENT_ID) {
  console.warn('GA4_MEASUREMENT_ID not configured - analytics disabled')
}
if (!GA4_API_SECRET) {
  console.warn('GA4_API_SECRET not configured - server-side analytics disabled')
}

// GA4 Measurement Protocol endpoint
const GA4_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${GA4_MEASUREMENT_ID}&api_secret=${GA4_API_SECRET}`

// Generate or retrieve client ID from cookie
function getClientId(request: NextRequest): string {
  const cookies = request.cookies
  let clientId = cookies.get('_ga_client_id')?.value

  if (!clientId) {
    // Generate new client ID (format: timestamp.random)
    clientId = `${Date.now()}.${Math.random().toString(36).substring(2, 11)}`
  }

  return clientId
}

// Get user's real IP address (handles proxies)
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')

  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  if (realIp) {
    return realIp
  }

  return 'unknown'
}

// Get user agent
function getUserAgent(request: NextRequest): string {
  return request.headers.get('user-agent') || 'unknown'
}

async function postHandler(request: NextRequest): Promise<NextResponse> {
  try {
    // Security check - ensure analytics is properly configured
    if (!GA4_MEASUREMENT_ID || !GA4_API_SECRET) {
      return NextResponse.json(
        { success: false, error: 'Analytics not configured' },
        { status: 503 }
      )
    }

    // Validate analytics event data with comprehensive schema
    const validation = await validateRequest(request, AnalyticsEventSchema);
    
    if (!validation.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid analytics data',
          details: 'error' in validation ? validation.error : 'Validation failed'
        },
        { status: 400 }
      );
    }

    const { eventName, eventParams, clientId: providedClientId } = validation.data;

    // Get or generate client ID
    const clientId = providedClientId || getClientId(request)

    // Get client info for better tracking
    const clientIp = getClientIp(request)
    const userAgent = getUserAgent(request)

    // Build GA4 Measurement Protocol payload
    const payload = {
      client_id: clientId,
      user_id: validation.data.userId || undefined,
      timestamp_micros: Date.now() * 1000,
      non_personalized_ads: false,
      events: [
        {
          name: eventName,
          params: {
            ...eventParams,

            // Server-side tracking marker
            tracking_method: 'server_side',

            // Session info
            session_id: eventParams.session_id || `${Date.now()}`,
            engagement_time_msec: eventParams.engagement_time_msec || 100,

            // Page info
            page_location: eventParams.page_location || '',
            page_referrer: eventParams.page_referrer || '',
            page_title: eventParams.page_title || '',

            // Traffic source (important for bot detection)
            traffic_type: eventParams.traffic_type || 'organic',

            // User properties for bot detection
            user_agent: userAgent,
            client_ip_country: eventParams.country || 'IN',
          },
        },
      ],
    }

    // Send to GA4
    const response = await fetch(GA4_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      console.error('[GA4 Server] Failed to send event:', response.statusText)
      return NextResponse.json(
        { success: false, error: 'GA4 API error' },
        { status: 500 }
      )
    }

    // Set cookie with client ID for future requests
    const res = NextResponse.json({ success: true, clientId })
    res.cookies.set('_ga_client_id', clientId, {
      maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
      httpOnly: false, // Allow client access
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return res
  } catch (error) {
    console.error('[GA4 Server] Error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getHandler(request: NextRequest): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    endpoint: 'GA4 Server-Side Tracking',
    configured: !!GA4_API_SECRET,
  })
}

// Apply rate limiting to all endpoints
export const POST = withRateLimit(postHandler, '/api/analytics/track')
export const GET = withRateLimit(getHandler, '/api/analytics/track')
