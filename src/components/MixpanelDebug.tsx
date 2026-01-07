'use client';

import { useEffect, useState } from 'react';
import { mixpanel, trackEvent } from '@/lib/mixpanel';

export function MixpanelDebug() {
  const [status, setStatus] = useState<string>('Checking...');
  const [events, setEvents] = useState<string[]>([]);

  useEffect(() => {
    // Check if Mixpanel is loaded
    if (typeof window !== 'undefined' && mixpanel) {
      setStatus('✅ Mixpanel loaded successfully');

      // Send a test event
      try {
        mixpanel.track('Debug Test Event', {
          timestamp: new Date().toISOString(),
          page: window.location.pathname,
          userAgent: navigator.userAgent
        });
        setEvents(prev => [...prev, '✅ Test event sent']);

        // Track page load
        mixpanel.track('Page Loaded', {
          url: window.location.href,
          referrer: document.referrer,
          timestamp: new Date().toISOString()
        });
        setEvents(prev => [...prev, '✅ Page load event sent']);

        // Get Mixpanel info
        const distinctId = mixpanel.get_distinct_id();
        setEvents(prev => [...prev, `👤 Distinct ID: ${distinctId}`]);

        console.log('Mixpanel Debug Info:', {
          token: '34e275fbd2634ae7d2d952a814121c44',
          distinctId,
          config: mixpanel.get_config()
        });
      } catch (error) {
        setStatus('❌ Error: ' + (error as Error).message);
        console.error('Mixpanel error:', error);
      }
    } else {
      setStatus('❌ Mixpanel not loaded');
    }
  }, []);

  const handleTestClick = () => {
    trackEvent('Button Click Test', {
      buttonName: 'Test Button',
      timestamp: new Date().toISOString()
    });
    setEvents(prev => [...prev, '✅ Button click event sent']);
  };

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'white',
      border: '2px solid #333',
      borderRadius: '8px',
      padding: '15px',
      maxWidth: '350px',
      zIndex: 9999,
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '10px', fontSize: '14px' }}>
        🔍 Mixpanel Debug
      </div>
      <div style={{ marginBottom: '10px' }}>
        Status: <strong>{status}</strong>
      </div>
      <div style={{ marginBottom: '10px', maxHeight: '150px', overflow: 'auto' }}>
        {events.map((event, i) => (
          <div key={i} style={{ margin: '5px 0', fontSize: '11px' }}>{event}</div>
        ))}
      </div>
      <button
        onClick={handleTestClick}
        style={{
          background: '#17B8BA',
          color: 'white',
          border: 'none',
          padding: '8px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          width: '100%'
        }}
      >
        Send Test Event
      </button>
      <div style={{ marginTop: '10px', fontSize: '10px', color: '#666' }}>
        Check browser console for detailed logs
      </div>
    </div>
  );
}
