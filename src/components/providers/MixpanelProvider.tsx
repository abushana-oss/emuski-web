'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { trackPageView, mixpanel } from '@/lib/mixpanel';

function MixpanelTracking() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Track page views on route change
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

      trackPageView(pathname, {
        url,
        referrer: document.referrer,
        title: document.title,
      });

      // Also track as a custom event for better analytics
      mixpanel.track('Page View', {
        page: pathname,
        url,
        referrer: document.referrer,
        title: document.title,
      });
    }
  }, [pathname, searchParams]);

  // Track user engagement time
  useEffect(() => {
    const startTime = Date.now();

    return () => {
      const endTime = Date.now();
      const timeSpent = Math.round((endTime - startTime) / 1000); // in seconds

      if (timeSpent > 0) {
        mixpanel.track('Page Engagement', {
          page: pathname,
          time_spent_seconds: timeSpent,
        });
      }
    };
  }, [pathname]);

  return null;
}

export function MixpanelProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <MixpanelTracking />
      </Suspense>
      {children}
    </>
  );
}
