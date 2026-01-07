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
