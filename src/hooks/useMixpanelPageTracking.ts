'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useMixpanelPageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).mixpanel) {
      (window as any).mixpanel.track('Page View', {
        'page_url': window.location.href,
        'page_title': document.title,
        'page_path': pathname
      });
    }
  }, [pathname]);
}
