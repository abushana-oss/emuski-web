/**
 * Mixpanel Analytics Configuration for EMUSKI
 *
 * Features:
 * - Autocapture: Automatically tracks clicks, form submissions, and page changes
 * - Session Recording: Records 100% of user sessions for deep insights
 * - User identification and profile tracking
 * - Custom event tracking
 */

'use client';

import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel
const MIXPANEL_TOKEN = '34e275fbd2634ae7d2d952a814121c44';

let initialized = false;

const initMixpanel = () => {
  if (typeof window !== 'undefined' && !initialized) {
    try {
      mixpanel.init(MIXPANEL_TOKEN, {
        autocapture: true,
        record_sessions_percent: 100,
        persistence: 'localStorage',
        debug: false,
        track_pageview: true,
        ignore_dnt: false,
        loaded: (mixpanel) => {
          console.log('✓ Mixpanel loaded successfully');
          // Send verification event
          mixpanel.track('Mixpanel Initialized', {
            platform: 'Web',
            environment: process.env.NODE_ENV,
          });
        },
      });
      initialized = true;
    } catch (error) {
      console.error('Mixpanel initialization error:', error);
    }
  }
};

// Auto-initialize on import (client-side only)
if (typeof window !== 'undefined') {
  initMixpanel();
}

// Helper functions for Mixpanel tracking

/**
 * Track custom event
 */
export const trackMixpanelEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    mixpanel.track(eventName, properties);
  }
};

/**
 * Track page view
 */
export const trackMixpanelPageView = (pageName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    mixpanel.track('Page View', {
      page: pageName,
      ...properties,
    });
  }
};

/**
 * Identify user (for logged-in users or lead tracking)
 */
export const identifyMixpanelUser = (userId: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    mixpanel.identify(userId);
    if (properties) {
      mixpanel.people.set(properties);
    }
  }
};

/**
 * Track user properties
 */
export const setMixpanelUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined') {
    mixpanel.people.set(properties);
  }
};

/**
 * Reset Mixpanel (on logout)
 */
export const resetMixpanel = () => {
  if (typeof window !== 'undefined') {
    mixpanel.reset();
  }
};

/**
 * Track manufacturing-specific events
 */
export const trackManufacturingEvent = {
  quoteRequest: (service: string, details?: Record<string, any>) => {
    trackMixpanelEvent('Quote Request', {
      service,
      ...details,
    });
  },

  serviceInquiry: (service: string, inquiryType: string) => {
    trackMixpanelEvent('Service Inquiry', {
      service,
      inquiryType,
    });
  },

  blogEngagement: (blogTitle: string, action: string, value?: number) => {
    trackMixpanelEvent('Blog Engagement', {
      blogTitle,
      action,
      value,
    });
  },

  contactFormSubmit: (formType: string, success: boolean) => {
    trackMixpanelEvent('Contact Form Submit', {
      formType,
      success,
    });
  },

  catalogDownload: (catalogName: string) => {
    trackMixpanelEvent('Catalog Download', {
      catalogName,
    });
  },
};

export default mixpanel;
