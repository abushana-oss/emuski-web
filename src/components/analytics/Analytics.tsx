/**
 * Global Analytics Component
 * Automatically tracks page views and engagement across all pages
 */

'use client';

import { useAnalytics } from '@/lib/hooks/useAnalytics';

export function Analytics() {
  // Enable global tracking for all pages
  useAnalytics({
    trackScroll: true,
    trackVisibility: true,
  });

  return null;
}
