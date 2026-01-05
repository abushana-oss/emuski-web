'use client'

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import ReCAPTCHAType from 'react-google-recaptcha';

// Lazy load reCAPTCHA to prevent blocking page load
const ReCAPTCHA = React.lazy(() => import('react-google-recaptcha'));

interface RecaptchaProps {
  onVerify: (token: string | null) => void;
  onError?: () => void;
  className?: string;
  theme?: 'light' | 'dark';
  size?: 'compact' | 'normal';
  sitekey?: string;
}

export const Recaptcha = ({
  onVerify,
  onError,
  className = '',
  theme = 'light',
  size = 'normal',
  sitekey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''
}: RecaptchaProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHAType>(null);

  const handleVerify = (token: string | null) => {
    setError(null);
    setIsExpired(false);
    onVerify(token);
  };

  const handleExpired = () => {
    setIsExpired(true);
    onVerify(null);
  };

  const handleError = () => {
    setError('Failed to load reCAPTCHA. Please check your internet connection and try again.');
    if (onError) {
      onError();
    }
  };

  const handleReset = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
      setError(null);
      setIsExpired(false);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setError(null);
  };

  useEffect(() => {
    // Cleanup function to reset state when component unmounts
    return () => {
      setError(null);
      setIsExpired(false);
      setIsLoaded(false);
    };
  }, [sitekey]);

  if (!sitekey) {
    return (
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          reCAPTCHA is not configured. Please add NEXT_PUBLIC_RECAPTCHA_SITE_KEY to your environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="recaptcha-container inline-block">
        <Suspense fallback={
          <div className="flex items-center space-x-2 text-sm text-gray-500 py-6">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emuski-teal"></div>
            <span>Loading security verification...</span>
          </div>
        }>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={sitekey}
            onChange={handleVerify}
            onExpired={handleExpired}
            onErrored={handleError}
            theme={theme}
            size={size}
          />
        </Suspense>
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

      {isLoaded && !error && size === 'normal' && (
        <p className="text-xs text-gray-500">
          This site is protected by reCAPTCHA and the Google{' '}
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

export default Recaptcha;