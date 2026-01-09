/**
 * Analytics Configuration
 * Professional-grade GA4, GTM, and Mixpanel setup
 */

export const analyticsConfig = {
  // Google Analytics 4
  ga4: {
    measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-QFDFYZLZPK',
    // Enable Google Signals for benchmarking and demographics
    config: {
      // Anonymize IP for privacy compliance
      anonymize_ip: true,
      // Enable Google Signals for cross-device tracking and demographics
      allow_google_signals: true,
      // Enable advertising features for remarketing and demographics
      allow_ad_personalization_signals: true,
      // Send page view automatically
      send_page_view: true,
      // Enable enhanced measurement
      enhanced_measurement: {
        scrolls: true,
        outbound_clicks: true,
        site_search: true,
        video_engagement: true,
        file_downloads: true,
      },
      // Cookie settings for better tracking
      cookie_flags: 'SameSite=None;Secure',
      cookie_expires: 63072000, // 2 years
      // Debug mode (only in development)
      debug_mode: process.env.NODE_ENV === 'development',
    },
  },

  // Google Tag Manager
  gtm: {
    id: process.env.NEXT_PUBLIC_GTM_ID || 'GTM-T5MDL48M',
    // Data layer name
    dataLayerName: 'dataLayer',
    // Enable preview mode in development
    preview: process.env.NODE_ENV === 'development' ? 'true' : undefined,
  },

  // Mixpanel
  mixpanel: {
    token: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || '34e275fbd2634ae7d2d952a814121c44',
    config: {
      debug: process.env.NODE_ENV === 'development',
      track_pageview: 'full-url',
      persistence: 'localStorage',
      autocapture: {
        dom_event_allowlist: ['click', 'submit', 'change'],
        element_allowlist: ['a', 'button', 'form', 'input', 'select', 'textarea'],
        css_selector_allowlist: ['[data-track]'],
      },
      // Session recording
      record_sessions_percent: process.env.NODE_ENV === 'production' ? 10 : 100,
      // Cross-subdomain tracking
      cross_subdomain_cookie: true,
      // Secure cookie in production
      secure_cookie: process.env.NODE_ENV === 'production',
      // IP geolocation
      ip: true,
    },
  },

  // Custom dimensions and metrics
  customDimensions: {
    // User properties
    user_type: 'dimension1', // 'customer', 'prospect', 'visitor'
    industry: 'dimension2', // User's industry
    company_size: 'dimension3', // 'small', 'medium', 'large'
    user_role: 'dimension4', // 'engineer', 'manager', 'executive'

    // Content properties
    content_type: 'dimension5', // 'blog', 'service', 'product'
    content_category: 'dimension6',

    // Engagement properties
    session_quality: 'dimension7', // 'high', 'medium', 'low'
    engagement_level: 'dimension8',
  },

  customMetrics: {
    scroll_depth: 'metric1',
    time_on_page: 'metric2',
    pages_per_session: 'metric3',
    quote_value: 'metric4',
  },

  // Event categories
  eventCategories: {
    engagement: 'engagement',
    conversion: 'conversion',
    navigation: 'navigation',
    interaction: 'interaction',
    form: 'form',
    media: 'media',
    ecommerce: 'ecommerce',
  },
};

// Cookie consent configuration for GDPR/CCPA compliance
export const consentConfig = {
  defaultConsent: {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'granted',
    functionality_storage: 'granted',
    personalization_storage: 'granted',
    security_storage: 'granted',
  },
  // Wait for consent before sending data
  wait_for_update: 500,
  // Region-specific consent
  region: ['US', 'GB', 'DE', 'FR', 'IN'],
};

// Conversion events configuration
export const conversionEvents = {
  // Primary conversions
  quote_request: {
    event: 'generate_lead',
    value: 100, // Estimated value
    currency: 'USD',
  },
  contact_form: {
    event: 'generate_lead',
    value: 50,
    currency: 'USD',
  },
  phone_click: {
    event: 'contact',
    value: 30,
    currency: 'USD',
  },

  // Secondary conversions
  email_signup: {
    event: 'sign_up',
    value: 20,
    currency: 'USD',
  },
  download: {
    event: 'file_download',
    value: 10,
    currency: 'USD',
  },
  video_complete: {
    event: 'video_complete',
    value: 5,
    currency: 'USD',
  },
};
