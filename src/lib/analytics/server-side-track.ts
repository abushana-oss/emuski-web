/**
 * Server-Side Analytics Tracking
 * Sends events to our API endpoint which forwards to GA4
 */

interface TrackEventData {
  eventName: string
  eventParams?: Record<string, any>
  clientId?: string
  userId?: string
  sessionId?: string
  page_location?: string
  page_title?: string
  page_referrer?: string
}

/**
 * Send tracking event to server-side GA4 endpoint
 */
export async function trackServerSideEvent(data: TrackEventData): Promise<boolean> {
  try {
    // Validate event name format for GA4
    if (!data.eventName || !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(data.eventName)) {
      console.warn('[Analytics] Invalid event name:', data.eventName)
      return false
    }

    // Ensure event name is within GA4 limits
    if (data.eventName.length > 40) {
      console.warn('[Analytics] Event name too long:', data.eventName)
      return false
    }

    // Clean and validate parameters
    const cleanParams: Record<string, any> = {}
    if (data.eventParams) {
      Object.entries(data.eventParams).forEach(([key, value]) => {
        // GA4 parameter name validation
        if (key.length <= 40 && /^[a-zA-Z][a-zA-Z0-9_]*$/.test(key)) {
          // Convert values to GA4 acceptable types
          if (typeof value === 'string' && value.length <= 500) {
            cleanParams[key] = value
          } else if (typeof value === 'number' && isFinite(value)) {
            cleanParams[key] = value
          } else if (typeof value === 'boolean') {
            cleanParams[key] = value
          }
        }
      })
    }

    // Prepare payload
    const payload: TrackEventData = {
      eventName: data.eventName,
      eventParams: cleanParams,
      clientId: data.clientId,
      userId: data.userId,
      sessionId: data.sessionId,
      page_location: data.page_location || (typeof window !== 'undefined' ? window.location.href : undefined),
      page_title: data.page_title || (typeof window !== 'undefined' ? document.title : undefined),
      page_referrer: data.page_referrer || (typeof window !== 'undefined' ? document.referrer : undefined)
    }

    // Remove undefined values
    Object.keys(payload).forEach(key => {
      if (payload[key as keyof TrackEventData] === undefined) {
        delete payload[key as keyof TrackEventData]
      }
    })

    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
      console.error('[Analytics] Server tracking failed:', {
        status: response.status,
        error: errorData
      })
      return false
    }

    const result = await response.json()
    return result.success === true

  } catch (error) {
    console.error('[Analytics] Client tracking error:', error)
    return false
  }
}

/**
 * Enhanced page view tracking with automatic data collection
 */
export function trackPageView(customData?: Partial<TrackEventData>): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false)

  const data: TrackEventData = {
    eventName: 'page_view',
    eventParams: {
      page_location: window.location.href,
      page_title: document.title,
      page_referrer: document.referrer || '(direct)',
      ...customData?.eventParams
    },
    page_location: window.location.href,
    page_title: document.title,
    page_referrer: document.referrer || '(direct)',
    ...customData
  }

  return trackServerSideEvent(data)
}

/**
 * Track custom events with automatic validation
 */
export function trackCustomEvent(
  eventName: string, 
  parameters?: Record<string, any>
): Promise<boolean> {
  return trackServerSideEvent({
    eventName,
    eventParams: parameters
  })
}

/**
 * Track form submissions
 */
export function trackFormSubmission(
  formName: string, 
  success: boolean, 
  errorMessage?: string
): Promise<boolean> {
  return trackServerSideEvent({
    eventName: success ? 'form_submit_success' : 'form_submit_error',
    eventParams: {
      form_name: formName,
      success,
      ...(errorMessage && { error_message: errorMessage })
    }
  })
}

/**
 * Track button/link clicks
 */
export function trackClick(
  elementText: string, 
  elementType: 'button' | 'link' | 'cta' = 'button',
  location?: string
): Promise<boolean> {
  return trackServerSideEvent({
    eventName: 'click',
    eventParams: {
      element_text: elementText,
      element_type: elementType,
      ...(location && { click_location: location })
    }
  })
}