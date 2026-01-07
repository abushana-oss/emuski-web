import mixpanel from 'mixpanel-browser';

// Initialize Mixpanel
const MIXPANEL_TOKEN = '34e275fbd2634ae7d2d952a814121c44';

// Check if we're in the browser
const isBrowser = typeof window !== 'undefined';

if (isBrowser) {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: process.env.NODE_ENV === 'development',
    track_pageview: true,
    persistence: 'localStorage',
    autocapture: true,
    record_sessions_percent: 100,
    // Additional recommended settings
    ignore_dnt: false,
    api_host: 'https://api.mixpanel.com',
    loaded: (mixpanel) => {
      console.log('Mixpanel initialized successfully');
    },
  });
}

export { mixpanel };

// Type-safe event tracking helper
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (isBrowser) {
    mixpanel.track(eventName, properties);
  }
};

// Identify user
export const identifyUser = (userId: string, userProperties?: Record<string, any>) => {
  if (isBrowser) {
    mixpanel.identify(userId);
    if (userProperties) {
      mixpanel.people.set(userProperties);
    }
  }
};

// Track page view
export const trackPageView = (pageName: string, properties?: Record<string, any>) => {
  if (isBrowser) {
    mixpanel.track_pageview({
      page: pageName,
      ...properties,
    });
  }
};

// Reset user (logout)
export const resetUser = () => {
  if (isBrowser) {
    mixpanel.reset();
  }
};

// Set user properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (isBrowser) {
    mixpanel.people.set(properties);
  }
};

// Register super properties (sent with every event)
export const registerSuperProperties = (properties: Record<string, any>) => {
  if (isBrowser) {
    mixpanel.register(properties);
  }
};
