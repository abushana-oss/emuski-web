/**
 * Enhanced Google Analytics (gtag.js) Configuration
 * Implements GA4 with Google Signals, Enhanced Measurement, and Conversion Tracking
 */

import { analyticsConfig, consentConfig } from './config';

// Type definitions for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Initialize Google Analytics with enhanced configuration
 * Call this once in your root layout
 */
export const initializeGA = () => {
  if (typeof window === 'undefined') return;

  const { measurementId, config } = analyticsConfig.ga4;

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];

  // Define gtag function
  window.gtag = function gtag(...args: any[]) {
    window.dataLayer.push(args);
  };

  // Set default consent mode (GDPR/CCPA compliance)
  window.gtag('consent', 'default', consentConfig.defaultConsent);

  // Initialize GA4 with configuration
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    ...config,
    // User properties for segmentation
    custom_map: {
      ...analyticsConfig.customDimensions,
      ...analyticsConfig.customMetrics,
    },
  });

  // Enable Google Signals for benchmarking and cross-device tracking
  window.gtag('config', measurementId, {
    allow_google_signals: true,
    allow_ad_personalization_signals: true,
  });

  // Set user properties
  setUserProperties({
    user_type: 'visitor', // Default, update on auth
    traffic_source: getTrafficSource(),
    device_category: getDeviceCategory(),
  });

  console.log('[Analytics] GA4 initialized with Google Signals enabled');
};

/**
 * Update consent after user accepts/rejects
 */
export const updateConsent = (consent: {
  ad_storage?: 'granted' | 'denied';
  analytics_storage?: 'granted' | 'denied';
  ad_personalization?: 'granted' | 'denied';
}) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('consent', 'update', {
    ad_storage: consent.ad_storage,
    ad_user_data: consent.ad_storage,
    ad_personalization: consent.ad_personalization,
    analytics_storage: consent.analytics_storage,
  });

  console.log('[Analytics] Consent updated:', consent);
};

/**
 * Set user properties for segmentation
 */
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('set', 'user_properties', properties);
};

/**
 * Track enhanced conversion (for form submissions with user data)
 */
export const trackEnhancedConversion = (userData: {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
}) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  // Hash sensitive data before sending (if needed)
  const enhancedConversionData: any = {};

  if (userData.email) enhancedConversionData.email = userData.email;
  if (userData.phone) enhancedConversionData.phone_number = userData.phone;
  if (userData.firstName) enhancedConversionData.first_name = userData.firstName;
  if (userData.lastName) enhancedConversionData.last_name = userData.lastName;
  if (userData.address) enhancedConversionData.address = userData.address;

  window.gtag('set', 'user_data', enhancedConversionData);

  console.log('[Analytics] Enhanced conversion data set');
};

/**
 * Track conversion events with value
 */
export const trackConversion = (
  eventName: string,
  params?: {
    value?: number;
    currency?: string;
    transaction_id?: string;
    items?: any[];
    [key: string]: any;
  }
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, {
    send_to: analyticsConfig.ga4.measurementId,
    ...params,
  });

  console.log('[Analytics] Conversion tracked:', eventName, params);
};

/**
 * Track page view with custom parameters
 */
export const trackPageView = (
  url: string,
  title?: string,
  additionalParams?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', 'page_view', {
    page_path: url,
    page_title: title || document.title,
    page_location: window.location.href,
    ...additionalParams,
  });
};

/**
 * Track custom event with parameters
 */
export const trackEvent = (
  eventName: string,
  params?: Record<string, any>
) => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('event', eventName, params);
};

// Helper functions

function getTrafficSource(): string {
  if (typeof window === 'undefined') return 'direct';

  const urlParams = new URLSearchParams(window.location.search);
  const utmSource = urlParams.get('utm_source');
  const utmMedium = urlParams.get('utm_medium');
  const referrer = document.referrer;

  if (utmSource) return `${utmSource}${utmMedium ? `/${utmMedium}` : ''}`;
  if (referrer) return new URL(referrer).hostname;
  return 'direct';
}

function getDeviceCategory(): string {
  if (typeof window === 'undefined') return 'desktop';

  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Enable debug mode for testing
 */
export const enableDebugMode = () => {
  if (typeof window === 'undefined' || !window.gtag) return;

  window.gtag('config', analyticsConfig.ga4.measurementId, {
    debug_mode: true,
  });

  console.log('[Analytics] Debug mode enabled');
};
