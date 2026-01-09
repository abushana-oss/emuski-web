// Centralized Mixpanel tracking utilities
// Note: Window.mixpanel types are declared in src/lib/analytics.ts

export const trackError = (
  errorType: string,
  errorMessage: string,
  errorCode?: string,
  pageUrl?: string
) => {
  if (typeof window !== 'undefined' && window.mixpanel) {
    window.mixpanel.track('Error', {
      error_type: errorType,
      error_message: errorMessage,
      error_code: errorCode || 'unknown',
      page_url: pageUrl || window.location.href
    });
  }
};

export const trackSearch = (
  searchQuery: string,
  resultsCount: number
) => {
  if (typeof window !== 'undefined' && window.mixpanel) {
    window.mixpanel.track('Search', {
      search_query: searchQuery,
      results_count: resultsCount,
      page_url: window.location.href
    });
  }
};

export const trackConversion = (
  conversionType: string,
  conversionValue?: number,
  additionalProps?: Record<string, any>
) => {
  if (typeof window !== 'undefined' && window.mixpanel) {
    window.mixpanel.track('Conversion', {
      'Conversion Type': conversionType,
      'Conversion Value': conversionValue,
      'page_url': window.location.href,
      ...additionalProps
    });
  }
};

/**
 * Identify a user by email and set their profile properties
 * Use this when users provide their email (subscriptions, contact forms)
 */
export const identifyUser = (
  email: string,
  properties?: {
    name?: string;
    phone?: string;
    [key: string]: any;
  }
) => {
  if (typeof window !== 'undefined' && window.mixpanel) {
    // Identify user by email
    window.mixpanel.identify(email);

    // Set user profile properties
    const profileData: Record<string, any> = {
      '$email': email,
      'User Type': 'Lead',
      'Last Seen': new Date().toISOString(),
    };

    if (properties?.name) {
      profileData['$name'] = properties.name;
    }

    if (properties?.phone) {
      profileData['$phone'] = properties.phone;
    }

    // Add any additional properties
    if (properties) {
      Object.keys(properties).forEach(key => {
        if (key !== 'name' && key !== 'phone') {
          profileData[key] = properties[key];
        }
      });
    }

    // Set the profile
    window.mixpanel.people.set(profileData);
  }
};
