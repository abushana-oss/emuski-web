'use client'

import { useEffect, useRef } from 'react'

/**
 * Minimal Client-Side Engagement Tracker
 *
 * Lightweight tracker that sends events to server-side endpoint
 * Tracks ONLY critical events for bot filtering:
 * - scroll_10: User scrolled 10% of page
 * - time_15s: User spent 15+ seconds on page
 * - contact_click: Contact button clicks
 * - pdf_download: PDF downloads (vendor evaluation)
 *
 * Benefits:
 * - Works in China (bypasses Great Firewall issues)
 * - Bypasses ad blockers
 * - Minimal client-side JS
 * - Better performance
 */

// Helper to get client ID from cookie
function getClientId(): string {
  if (typeof document === 'undefined') return ''

  const match = document.cookie.match(/_ga_client_id=([^;]+)/)
  return match ? match[1] : ''
}

// Helper to get session ID from cookie
function getSessionId(): string {
  if (typeof document === 'undefined') return ''

  const match = document.cookie.match(/_ga_session_id=([^;]+)/)
  return match ? match[1] : `${Date.now()}`
}

// Send event to server-side endpoint
async function trackEvent(eventName: string, eventParams: any = {}) {
  try {
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventName,
        eventParams: {
          ...eventParams,
          page_location: window.location.href,
          page_referrer: document.referrer,
          page_title: document.title,
          session_id: getSessionId(),
          engagement_time_msec: Date.now() - startTimeRef,
          traffic_type: 'organic',
        },
        clientId: getClientId(),
      }),
      keepalive: true, // Ensure event fires even if user navigates away
    })
  } catch (error) {
    // Silently fail - don't break user experience
    console.error('[Client Analytics] Failed to track event:', error)
  }
}

let startTimeRef = Date.now()

export function UserEngagementTracker() {
  const hasScrolled10 = useRef(false)
  const hasTracked15s = useRef(false)

  useEffect(() => {
    startTimeRef = Date.now()

    // CRITICAL EVENT 1: scroll_10 (scroll >10% of page)
    const handleScroll = () => {
      if (hasScrolled10.current) return

      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100

      if (scrollPercent >= 10) {
        hasScrolled10.current = true
        trackEvent('scroll_10', {
          scroll_percent: Math.round(scrollPercent),
          time_to_scroll: Date.now() - startTimeRef,
        })
      }
    }

    // CRITICAL EVENT 2: time_15s (spent 15+ seconds)
    const track15Seconds = () => {
      if (hasTracked15s.current) return

      hasTracked15s.current = true
      trackEvent('time_15s', {
        time_on_page: 15,
        has_scrolled: hasScrolled10.current,
      })
    }

    // CRITICAL EVENT 3: contact_click (any click on contact elements)
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      // Check if clicked element is contact-related
      if (
        target.closest('a[href*="contact"]') ||
        target.closest('a[href^="tel:"]') ||
        target.closest('a[href^="mailto:"]') ||
        target.closest('button[aria-label*="contact" i]') ||
        target.closest('[class*="contact" i]')
      ) {
        trackEvent('contact_click', {
          element_type: target.tagName.toLowerCase(),
          element_text: target.textContent?.substring(0, 50) || '',
          element_href: (target as HTMLAnchorElement).href || '',
        })
      }

      // Check for PDF downloads
      if (target.closest('a[href$=".pdf"]')) {
        const href = (target.closest('a') as HTMLAnchorElement).href
        trackEvent('pdf_download', {
          pdf_url: href,
          pdf_name: href.split('/').pop() || 'unknown',
        })
      }
    }

    // Add event listeners
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('click', handleClick, { passive: true })

    // Track 15 seconds
    const timeoutId = setTimeout(track15Seconds, 15000)

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClick)
      clearTimeout(timeoutId)
    }
  }, [])

  // This component doesn't render anything
  return null
}
