'use client'

import React, { useEffect, useRef, useState } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

// TypeScript declaration is now unified in register page

interface RecaptchaEnterpriseProps {
  onVerify: (token: string | null) => void;
  onError?: () => void;
  className?: string;
  theme?: 'light' | 'dark';
  size?: 'compact' | 'normal' | 'invisible';
  sitekey?: string;
  action?: string;
}

export const RecaptchaEnterprise = ({
  onVerify,
  onError,
  className = '',
  theme = 'light',
  size = 'normal',
  sitekey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6Ld_KTQsAAAAAJt4Dy21iNt02bzSUUPRLuZwju11',
  action = 'CONTACT_FORM',
}: RecaptchaEnterpriseProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const loadAttemptRef = useRef(0);
  const maxLoadAttempts = 20; // Try for 10 seconds (20 * 500ms)

  useEffect(() => {
    let mounted = true;
    let checkInterval: NodeJS.Timeout | null = null;

    // Function to check if reCAPTCHA is ready
    const checkRecaptchaReady = () => {
      loadAttemptRef.current += 1;

      if (!mounted) {
        if (checkInterval) clearInterval(checkInterval);
        return;
      }

      // Check if grecaptcha.enterprise is available
      if (window.grecaptcha && window.grecaptcha.enterprise) {
        if (checkInterval) clearInterval(checkInterval);

        // Wait for ready callback
        window.grecaptcha.enterprise.ready(() => {
          if (mounted) {
            setIsLoaded(true);
            setError(null);
            renderRecaptcha();
          }
        });
      } else if (loadAttemptRef.current >= maxLoadAttempts) {
        // Timeout - reCAPTCHA failed to load
        if (checkInterval) clearInterval(checkInterval);

        if (mounted) {
          setError('Failed to load reCAPTCHA. Please refresh the page and try again.');
          setIsLoaded(false);
          if (onError) onError();
        }
      }
    };

    // Start checking for reCAPTCHA
    checkRecaptchaReady(); // Check immediately
    checkInterval = setInterval(checkRecaptchaReady, 500); // Then check every 500ms

    // Cleanup
    return () => {
      mounted = false;
      if (checkInterval) clearInterval(checkInterval);

      if (widgetIdRef.current !== null && window.grecaptcha?.enterprise) {
        try {
          window.grecaptcha.enterprise.reset(widgetIdRef.current);
        } catch (e) {
          // Silent cleanup failure - no logging for security
        }
      }
    };
  }, [sitekey]);

  const renderRecaptcha = () => {
    if (!recaptchaRef.current || !window.grecaptcha?.enterprise) {
      return;
    }

    // Don't render if already rendered
    if (widgetIdRef.current !== null) {
      return;
    }

    try {
      widgetIdRef.current = window.grecaptcha.enterprise.render(recaptchaRef.current, {
        sitekey,
        theme,
        size,
        callback: handleVerify,
        'expired-callback': handleExpired,
        'error-callback': handleError,
      });
    } catch (e) {
      handleError();
    }
  };

  const handleVerify = (token: string) => {
    setError(null);
    setIsExpired(false);
    onVerify(token);
  };

  const handleExpired = () => {
    setIsExpired(true);
    onVerify(null);
  };

  const handleError = () => {
    const errorMsg = 'Failed to load reCAPTCHA. Please check your internet connection and try again.';
    setError(errorMsg);
    if (onError) {
      onError();
    }
  };

  const handleReset = () => {
    if (widgetIdRef.current !== null && window.grecaptcha?.enterprise) {
      try {
        window.grecaptcha.enterprise.reset(widgetIdRef.current);
        setError(null);
        setIsExpired(false);
      } catch (e) {
        setError('Failed to reset. Please refresh the page.');
      }
    }
  };

  if (size === 'invisible') {
    return <div ref={recaptchaRef} />;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="recaptcha-container min-h-[78px]">
        {!isLoaded && !error && (
          <div className="flex items-center space-x-2 text-sm text-gray-500 py-6">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emuski-teal"></div>
            <span>Loading security verification...</span>
          </div>
        )}
        <div ref={recaptchaRef} />
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
            <button
              onClick={handleReset}
              className="text-red-600 hover:text-red-800 transition-colors ml-2"
              type="button"
              aria-label="Retry"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {isExpired && (
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-orange-800">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">reCAPTCHA has expired. Please verify again.</span>
            </div>
            <button
              onClick={handleReset}
              className="text-orange-600 hover:text-orange-800 transition-colors ml-2"
              type="button"
              aria-label="Reset"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {isLoaded && !error && (
        <p className="text-xs text-gray-500">
          This site is protected by reCAPTCHA Enterprise and the Google{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            Terms of Service
          </a>{' '}
          apply.
        </p>
      )}
    </div>
  );
};

export default RecaptchaEnterprise;
