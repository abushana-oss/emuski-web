/**
 * React Hooks for Analytics
 * Auto-track page views, scroll depth, time on page, and engagement
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  trackPageView,
  trackScrollDepth,
  trackTimeOnPage,
  trackBlogEngagement,
} from '@/lib/analytics';

/**
 * Auto-track page views on route changes
 */
export function usePageTracking() {
  const pathname = usePathname();
  const [startTime] = useState(Date.now());
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!hasTracked.current) {
      trackPageView(pathname);
      hasTracked.current = true;
    }

    // Track time on page when user leaves
    return () => {
      const timeOnPage = Math.round((Date.now() - startTime) / 1000);
      trackTimeOnPage(timeOnPage, pathname);
    };
  }, [pathname, startTime]);
}

/**
 * Auto-track scroll depth with configurable thresholds
 */
export function useScrollTracking(thresholds: number[] = [25, 50, 75, 100]) {
  const pathname = usePathname();
  const trackedDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      );

      thresholds.forEach((threshold) => {
        if (
          scrollPercentage >= threshold &&
          !trackedDepths.current.has(threshold)
        ) {
          trackedDepths.current.add(threshold);
          trackScrollDepth(threshold, pathname);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname, thresholds]);
}

/**
 * Track blog reading progress and engagement
 */
export function useBlogTracking(blogTitle: string, blogCategory: string) {
  const pathname = usePathname();
  const [readingTime, setReadingTime] = useState(0);
  const startTime = useRef(Date.now());
  const hasTracked50Percent = useRef(false);
  const hasTracked100Percent = useRef(false);

  useEffect(() => {
    // Track reading time every 10 seconds
    const interval = setInterval(() => {
      const currentReadingTime = Math.round((Date.now() - startTime.current) / 1000);
      setReadingTime(currentReadingTime);

      // Track milestones
      if (currentReadingTime >= 30 && !hasTracked50Percent.current) {
        trackBlogEngagement({
          blog_title: blogTitle,
          blog_category: blogCategory,
          engagement_type: 'read_time',
          value: 30,
        });
        hasTracked50Percent.current = true;
      }

      if (currentReadingTime >= 60 && !hasTracked100Percent.current) {
        trackBlogEngagement({
          blog_title: blogTitle,
          blog_category: blogCategory,
          engagement_type: 'read_time',
          value: 60,
        });
        hasTracked100Percent.current = true;
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [blogTitle, blogCategory]);

  // Track scroll depth for blog posts
  useEffect(() => {
    const trackedDepths = new Set<number>();

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrollPercentage = Math.round(
        ((scrollTop + windowHeight) / documentHeight) * 100
      );

      [25, 50, 75, 100].forEach((threshold) => {
        if (scrollPercentage >= threshold && !trackedDepths.has(threshold)) {
          trackedDepths.add(threshold);
          trackBlogEngagement({
            blog_title: blogTitle,
            blog_category: blogCategory,
            engagement_type: 'scroll',
            value: threshold,
          });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [blogTitle, blogCategory]);

  return { readingTime };
}

/**
 * Track visibility/tab focus (engaged time)
 */
export function useVisibilityTracking() {
  const pathname = usePathname();
  const engagedTime = useRef(0);
  const lastActiveTime = useRef(Date.now());
  const isVisible = useRef(true);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab became inactive - record engaged time
        isVisible.current = false;
        engagedTime.current += Date.now() - lastActiveTime.current;
      } else {
        // Tab became active again
        isVisible.current = true;
        lastActiveTime.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      // Track total engaged time when component unmounts
      if (isVisible.current) {
        engagedTime.current += Date.now() - lastActiveTime.current;
      }

      const totalEngagedSeconds = Math.round(engagedTime.current / 1000);
      if (totalEngagedSeconds > 0) {
        trackTimeOnPage(totalEngagedSeconds, pathname);
      }
    };
  }, [pathname]);
}

/**
 * Combined analytics hook - use this in most pages
 */
export function useAnalytics(options?: {
  trackScroll?: boolean;
  trackVisibility?: boolean;
}) {
  usePageTracking();

  if (options?.trackScroll !== false) {
    useScrollTracking();
  }

  if (options?.trackVisibility !== false) {
    useVisibilityTracking();
  }
}
