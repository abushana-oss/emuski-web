/**
 * EventTracker Component
 * Provides click tracking for buttons, links, and CTAs
 */

'use client';

import { trackEvent, trackCTA, trackOutboundLink } from '@/lib/analytics';
import { ReactNode, MouseEvent } from 'react';

interface EventTrackerProps {
  children: ReactNode;
  eventName: string;
  eventCategory: string;
  eventLabel?: string;
  eventValue?: number;
  trackAs?: 'event' | 'cta' | 'outbound';
  ctaLocation?: string;
  className?: string;
  onClick?: (e: MouseEvent) => void;
}

/**
 * Wrapper component for tracking user interactions
 * Usage:
 * <EventTracker eventName="button_click" eventCategory="conversion" eventLabel="Get Quote">
 *   <button>Get a Quote</button>
 * </EventTracker>
 */
export function EventTracker({
  children,
  eventName,
  eventCategory,
  eventLabel,
  eventValue,
  trackAs = 'event',
  ctaLocation,
  className,
  onClick,
}: EventTrackerProps) {
  const handleClick = (e: MouseEvent) => {
    // Track the event based on type
    switch (trackAs) {
      case 'cta':
        trackCTA(eventName, ctaLocation || 'unknown');
        break;
      case 'outbound':
        const href = (e.currentTarget as HTMLElement).getAttribute('href');
        if (href) {
          trackOutboundLink(href, eventLabel || eventName);
        }
        break;
      default:
        trackEvent({
          action: eventName,
          category: eventCategory,
          label: eventLabel,
          value: eventValue,
        });
    }

    // Call original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
}

/**
 * Hook for manual event tracking
 */
export function useEventTracking() {
  return {
    trackEvent: (name: string, category: string, label?: string, value?: number) => {
      trackEvent({
        action: name,
        category,
        label,
        value,
      });
    },
    trackCTA: (name: string, location: string) => {
      trackCTA(name, location);
    },
    trackOutboundLink: (url: string, text: string) => {
      trackOutboundLink(url, text);
    },
  };
}
