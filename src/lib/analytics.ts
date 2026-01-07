/**
 * Analytics Utility for EMUSKI
 * Comprehensive tracking for Google Analytics, Tag Manager & Mixpanel
 *
 * Features:
 * - Page view tracking
 * - Event tracking (clicks, form submissions, etc.)
 * - E-commerce tracking
 * - User engagement tracking (scroll depth, time on page)
 * - Blog-specific metrics (reading time, content engagement)
 * - Unified tracking across GA, GTM, and Mixpanel
 */

import { trackMixpanelEvent, trackMixpanelPageView } from './mixpanel';

// Type definitions for analytics events
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
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

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer?: any[];
  }
}

/**
 * Send custom event to Google Analytics, GTM, and Mixpanel
 */
export const trackEvent = ({
  action,
  category,
  label,
  value,
}: AnalyticsEvent): void => {
  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
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
    });
  }

  // Mixpanel
  trackMixpanelEvent(action, {
    category,
    label,
    value,
  });
};

/**
 * Track page views on GA, GTM, and Mixpanel
 */
export const trackPageView = (url: string, title?: string): void => {
  const pageTitle = title || (typeof window !== 'undefined' ? document.title : '');
  const pageLocation = typeof window !== 'undefined' ? window.location.href : '';

  // Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_title: pageTitle,
      page_location: pageLocation,
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

  // Mixpanel
  trackMixpanelPageView(url, {
    title: pageTitle,
    location: pageLocation,
  });
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
 */
export const trackQuoteRequest = (quoteData: {
  service: string;
  quantity?: number;
  estimatedValue?: number;
}): void => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: quoteData.estimatedValue || 0,
      items: [
        {
          item_name: quoteData.service,
          quantity: quoteData.quantity || 1,
        },
      ],
    });
  }

  // GTM dataLayer
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push({
      event: 'quote_request',
      service: quoteData.service,
      quantity: quoteData.quantity,
      estimatedValue: quoteData.estimatedValue,
    });
  }
};
