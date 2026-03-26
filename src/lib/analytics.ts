/**
 * Analytics Utility for EMUSKI
 * Comprehensive tracking for Google Analytics, Tag Manager & Mixpanel
 *
 * Features:
 * - Page view tracking with enhanced parameters
 * - Event tracking (clicks, form submissions, etc.)
 * - Enhanced conversion tracking
 * - E-commerce tracking
 * - User engagement tracking (scroll depth, time on page)
 * - Blog-specific metrics (reading time, content engagement)
 * - Unified tracking across GA4, GTM, and Mixpanel
 * - Google Signals enabled for benchmarking
 */

import { analyticsConfig, conversionEvents } from './analytics/config';

// Type definitions for analytics events
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  customParams?: Record<string, any>;
}

export interface PageViewEvent {
  page_path: string;
  page_title: string;
  page_location: string;
}

export interface BlogEngagementEvent {
  blog_title: string;
  blog_category: string;
  engagement_type: 'scroll' | 'read_time' | 'share' | 'comment';
  value?: number;
}

export interface ConversionData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  value?: number;
}

// Declare window functions for TypeScript
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Helper functions to categorize content and avoid "not set" values
 */
function getServiceCategory(url: string): string {
  if (url.includes('manufacturing-services')) return 'Precision Manufacturing Services';
  if (url.includes('cost-engineering')) return 'Cost Engineering Services';
  if (url.includes('solutions/ai')) return 'AI Solutions';
  if (url.includes('tools/2d-balloon-diagram')) return 'Engineering Tools - 2D Balloon Diagram';
  if (url.includes('tools/3d-cad-analysis')) return 'Engineering Tools - 3D CAD Analysis';
  if (url.includes('tools/')) return 'Engineering Tools';
  if (url.includes('blog')) return 'Blog & Resources';
  if (url.includes('gallery')) return 'Portfolio Gallery';
  if (url.includes('contact')) return 'Contact & Inquiries';
  return 'General Pages';
}

function getIndustryFocus(url: string): string {
  if (url.includes('automotive')) return 'Automotive';
  if (url.includes('aerospace')) return 'Aerospace';
  if (url.includes('medical')) return 'Medical Devices';
  if (url.includes('electronics')) return 'Electronics';
  if (url.includes('defense')) return 'Defense & Military';
  return 'Multi-Industry';
}

function getTrafficSource(): string {
  if (typeof window === 'undefined') return 'unknown';
  
  const referrer = document.referrer;
  if (!referrer) return 'direct';
  
  if (referrer.includes('google')) return 'google_search';
  if (referrer.includes('linkedin')) return 'linkedin';
  if (referrer.includes('facebook')) return 'facebook';
  if (referrer.includes('twitter')) return 'twitter';
  if (referrer.includes('youtube')) return 'youtube';
  
  return 'external_referral';
}

/**
 * Send custom event to Google Analytics and GTM
 * Enhanced with custom parameters support
 */
export const trackEvent = ({
  action,
  category,
  label,
  value,
  customParams = {},
}: AnalyticsEvent): void => {
  try {
    // Google Analytics 4
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
        ...customParams,
      });
    }

    // GTM dataLayer
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'custom_event',
        eventAction: action,
        eventCategory: category,
        eventLabel: label,
        eventValue: value,
        ...customParams,
      });
    }
  } catch (error) {
    // Silently fail - don't let analytics break the app
    console.warn('[Analytics] Event tracking failed:', error);
  }
};

/**
 * Track page views on GA and GTM
 */
export const trackPageView = (url: string, title?: string): void => {
  const pageTitle = title || (typeof window !== 'undefined' ? document.title : '');
  const pageLocation = typeof window !== 'undefined' ? window.location.href : '';

  // Google Analytics with enhanced parameters
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_title: pageTitle,
      page_location: pageLocation,
      page_referrer: document.referrer || '(direct)',
      content_group1: getServiceCategory(url),
      content_group2: getIndustryFocus(url),
      traffic_source: getTrafficSource()
    });
  }

  // GTM dataLayer
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'pageview',
      page: {
        path: url,
        title: pageTitle,
        location: pageLocation,
      },
    });
  }
};

/**
 * Track blog engagement
 */
export const trackBlogEngagement = ({
  blog_title,
  blog_category,
  engagement_type,
  value,
}: BlogEngagementEvent): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'blog_engagement', {
      blog_title,
      blog_category,
      engagement_type,
      value,
    });
  }

  // GTM dataLayer
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'blog_engagement',
      blogTitle: blog_title,
      blogCategory: blog_category,
      engagementType: engagement_type,
      engagementValue: value,
    });
  }
};

/**
 * Track scroll depth
 */
export const trackScrollDepth = (percentage: number, pagePath: string): void => {
  trackEvent({
    action: 'scroll_depth',
    category: 'engagement',
    label: pagePath,
    value: percentage,
  });
};

/**
 * Track time on page
 */
export const trackTimeOnPage = (seconds: number, pagePath: string): void => {
  trackEvent({
    action: 'time_on_page',
    category: 'engagement',
    label: pagePath,
    value: seconds,
  });
};

/**
 * Track button/link clicks
 */
export const trackClick = (elementName: string, elementType: string): void => {
  trackEvent({
    action: 'click',
    category: 'interaction',
    label: `${elementType}: ${elementName}`,
  });
};

/**
 * Track form submissions
 */
export const trackFormSubmission = (formName: string, success: boolean): void => {
  trackEvent({
    action: success ? 'form_submit_success' : 'form_submit_error',
    category: 'form',
    label: formName,
  });
};

/**
 * Track outbound links
 */
export const trackOutboundLink = (url: string, linkText: string): void => {
  trackEvent({
    action: 'outbound_click',
    category: 'navigation',
    label: `${linkText} -> ${url}`,
  });
};

/**
 * Track file downloads
 */
export const trackDownload = (fileName: string, fileType: string): void => {
  trackEvent({
    action: 'download',
    category: 'file',
    label: `${fileType}: ${fileName}`,
  });
};

/**
 * Track search queries
 */
export const trackSearch = (query: string, resultsCount: number): void => {
  trackEvent({
    action: 'search',
    category: 'engagement',
    label: query,
    value: resultsCount,
  });
};

/**
 * Track video/media interactions
 */
export const trackMediaInteraction = (
  mediaName: string,
  action: 'play' | 'pause' | 'complete',
  progress?: number
): void => {
  trackEvent({
    action: `video_${action}`,
    category: 'media',
    label: mediaName,
    value: progress,
  });
};

/**
 * Track CTA (Call to Action) clicks
 */
export const trackCTA = (ctaName: string, ctaLocation: string): void => {
  trackEvent({
    action: 'cta_click',
    category: 'conversion',
    label: `${ctaName} (${ctaLocation})`,
  });
};

/**
 * Track manufacturing service inquiries
 */
export const trackServiceInquiry = (
  serviceName: string,
  inquiryType: 'quote' | 'contact' | 'demo'
): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'service_inquiry', {
      service_name: serviceName,
      inquiry_type: inquiryType,
    });
  }

  // GTM dataLayer
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'service_inquiry',
      serviceName,
      inquiryType,
    });
  }
};

/**
 * Track lead generation
 */
export const trackLead = (leadSource: string, leadValue?: number): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'generate_lead', {
      currency: 'USD',
      value: leadValue || 0,
      lead_source: leadSource,
    });
  }

  // GTM dataLayer
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'generate_lead',
      leadSource,
      leadValue: leadValue || 0,
    });
  }
};

/**
 * Enhanced E-commerce tracking for manufacturing quotes
 * Tracks as a conversion with proper value
 */
export const trackQuoteRequest = (quoteData: {
  service: string;
  quantity?: number;
  estimatedValue?: number;
  userEmail?: string;
  userPhone?: string;
  userName?: string;
}): void => {
  const value = quoteData.estimatedValue || conversionEvents.quote_request.value;

  // Google Analytics 4 - Track as conversion
  if (typeof window !== 'undefined' && window.gtag) {
    // Track the conversion event
    window.gtag('event', 'generate_lead', {
      currency: 'USD',
      value: value,
      lead_source: 'quote_request',
      service_name: quoteData.service,
      quantity: quoteData.quantity || 1,
    });

    // Also track as begin_checkout for ecommerce funnel
    window.gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: value,
      items: [
        {
          item_id: quoteData.service.toLowerCase().replace(/\s+/g, '_'),
          item_name: quoteData.service,
          item_category: 'manufacturing_service',
          quantity: quoteData.quantity || 1,
          price: value,
        },
      ],
    });

    // Set enhanced conversion data if available
    if (quoteData.userEmail || quoteData.userPhone) {
      window.gtag('set', 'user_data', {
        email: quoteData.userEmail,
        phone_number: quoteData.userPhone,
      });
    }
  }

  // GTM dataLayer
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'quote_request',
      service: quoteData.service,
      quantity: quoteData.quantity,
      estimatedValue: value,
      userEmail: quoteData.userEmail,
      userPhone: quoteData.userPhone,
    });
  }

  // Mixpanel
  if (typeof window !== 'undefined' && window.mixpanel) {
    window.mixpanel.track('Quote Request', {
      service: quoteData.service,
      quantity: quoteData.quantity,
      estimated_value: value,
      currency: 'USD',
    });

    // Identify user if email provided
    if (quoteData.userEmail) {
      window.mixpanel.identify(quoteData.userEmail);
      if (quoteData.userName) {
        window.mixpanel.people.set({
          $name: quoteData.userName,
          $email: quoteData.userEmail,
          $phone: quoteData.userPhone,
        });
      }
    }
  }
};

/**
 * Track enhanced conversion with user data
 * Use this when users submit forms with personal information
 */
export const trackEnhancedConversion = (
  eventName: string,
  conversionData: ConversionData
): void => {
  if (typeof window === 'undefined' || !window.gtag) return;

  const eventConfig = conversionEvents[eventName as keyof typeof conversionEvents];

  // Set enhanced conversion data
  window.gtag('set', 'user_data', {
    email: conversionData.email,
    phone_number: conversionData.phone,
    address: {
      first_name: conversionData.firstName,
      last_name: conversionData.lastName,
    },
  });

  // Track the conversion
  window.gtag('event', eventConfig?.event || eventName, {
    value: conversionData.value || eventConfig?.value || 0,
    currency: eventConfig?.currency || 'USD',
    transaction_id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  });

  // GTM dataLayer
  if (window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      conversionValue: conversionData.value,
      userEmail: conversionData.email,
      company: conversionData.company,
    });
  }

  // Mixpanel
  if (window.mixpanel && conversionData.email) {
    window.mixpanel.identify(conversionData.email);
    window.mixpanel.people.set({
      $email: conversionData.email,
      $phone: conversionData.phone,
      $first_name: conversionData.firstName,
      $last_name: conversionData.lastName,
      company: conversionData.company,
    });
  }
};

/**
 * Track user identification for cross-session tracking
 */
export const identifyUser = (userId: string, properties?: Record<string, any>): void => {
  // GA4 - Set user ID
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', analyticsConfig.ga4.measurementId, {
      user_id: userId,
    });

    if (properties) {
      window.gtag('set', 'user_properties', properties);
    }
  }

  // GTM dataLayer
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'user_identified',
      userId: userId,
      ...properties,
    });
  }
};

/**
 * Track exception/error for monitoring
 */
export const trackException = (description: string, fatal: boolean = false): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'exception', {
      description: description,
      fatal: fatal,
    });
  }
};

/**
 * Track timing/performance metrics
 */
export const trackTiming = (
  category: string,
  variable: string,
  value: number,
  label?: string
): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'timing_complete', {
      name: variable,
      value: value,
      event_category: category,
      event_label: label,
    });
  }
};
