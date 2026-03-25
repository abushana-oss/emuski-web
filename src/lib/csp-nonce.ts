import crypto from 'crypto';
import { headers } from 'next/headers';

/**
 * Generate a secure CSP nonce
 */
export function generateCSPNonce(): string {
  return crypto.randomBytes(16).toString('base64');
}

/**
 * Get CSP nonce from headers (for use in components)
 */
export async function getCSPNonce(): Promise<string> {
  const headersList = await headers();
  return headersList.get('x-nonce') || '';
}

/**
 * Generate enhanced CSP policy with nonce support
 */
export function generateCSPWithNonce(nonce: string): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const directives = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      `'nonce-${nonce}'`,
      // Only allow unsafe-eval in development
      ...(isDevelopment ? ["'unsafe-eval'"] : []),
      // Trusted third-party scripts
      'https://www.google.com',
      'https://www.gstatic.com',
      'https://www.googletagmanager.com',
      'https://tagmanager.google.com',
      'https://www.google-analytics.com',
      'https://ssl.google-analytics.com',
      'https://js.apollo.io',
      'https://assets.apollo.io',  // Apollo tracker script host
      'https://cdn.mxpnl.com',
      'https://api-js.mixpanel.com',
      // Supabase
      'https://unpkg.com/@supabase/supabase-js',
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Still needed for dynamic styles in many React components
      'https://fonts.googleapis.com',
      'https://www.google.com',
      'https://tagmanager.google.com',
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      // Specific trusted domains
      'https://*.google.com',
      'https://*.gstatic.com',
      'https://*.supabase.co',
      'https://*.apollocdn.com',
    ],
    'font-src': [
      "'self'",
      'data:',
      'https://fonts.gstatic.com',
    ],
    'connect-src': [
      "'self'",
      'blob:',
      'data:',
      // Development
      ...(isDevelopment ? [
        'ws://localhost:*',
        'wss://localhost:*',
        'http://localhost:*',
        'https://localhost:*',
      ] : []),
      // Analytics and tracking
      'https://*.google.com',
      'https://www.googleapis.com',
      'https://*.googleapis.com',
      'https://accounts.google.com',
      'https://oauth2.googleapis.com',
      'https://*.google-analytics.com',
      'https://*.analytics.google.com',
      'https://*.googletagmanager.com',
      'https://*.doubleclick.net',
      'https://*.blogger.com',
      'https://blogger.googleusercontent.com',
      'https://api.mixpanel.com',
      'https://api-js.mixpanel.com',
      'https://cdn.mxpnl.com',
      'https://*.apollo.io',
      'https://assets.apollo.io',
      'https://aplo-evnt.com',
      'https://*.aplo-evnt.com',   // Apollo event tracking domains
      'https://app.apollo.io',     // Apollo app API
      'https://track.apollo.io',   // Apollo event POST endpoint
      // Supabase
      'https://*.supabase.co',
      'wss://*.supabase.co',
      // Anthropic AI
      'https://api.anthropic.com',
      // CAD Engine (server-side only, configurable via environment)
      ...(process.env.CAD_ENGINE_URL ? [process.env.CAD_ENGINE_URL] : []),
    ],
    'frame-ancestors': ["'none'"],
    'frame-src': [
      "'self'",
      'https://www.google.com',
      'https://www.googletagmanager.com',
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'manifest-src': ["'self'"],
    'media-src': [
      "'self'",
      'blob:',
      'data:',
      'https:',
    ],
    'worker-src': [
      "'self'",
      'blob:',
      'data:',
    ],
    'child-src': [
      "'self'",
      'blob:',
      'data:',
    ],
    // Enhanced security directives
    'upgrade-insecure-requests': [],
    'block-all-mixed-content': [],
  };

  // Convert directives to CSP string
  const cspString = Object.entries(directives)
    .map(([directive, sources]) => {
      if (sources.length === 0) {
        return directive;
      }
      return `${directive} ${sources.join(' ')}`;
    })
    .join('; ');

  return cspString;
}

/**
 * Enhanced security headers with CSP nonce support
 */
export function getEnhancedSecurityHeaders(nonce: string) {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  const headers: Record<string, string> = {
    // Content Security Policy with nonce
    'Content-Security-Policy': generateCSPWithNonce(nonce),
    
    // HSTS (production only)
    ...(isDevelopment ? {} : {
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
    }),
    
    // Frame protection
    'X-Frame-Options': 'DENY',
    
    // Content type sniffing protection
    'X-Content-Type-Options': 'nosniff',
    
    // XSS protection (legacy support)
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Feature policy / Permissions policy
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'accelerometer=()',
      'gyroscope=()',
      'magnetometer=()',
      'payment=()',
      'usb=()',
      'autoplay=(self)',
      'encrypted-media=(self)',
      'fullscreen=(self)',
    ].join(', '),
    
    // Cross-Origin policies - secure with specific allowances
    'Cross-Origin-Embedder-Policy': 'credentialless', // Safer alternative to require-corp for general web apps
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups', // Essential for auth popups and redirects
    'Cross-Origin-Resource-Policy': 'cross-origin', // Allow cross-origin embedding of our resources
    
    // Cache control for security-sensitive responses
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
    
    // Custom nonce header for components
    'X-Nonce': nonce,
  };

  return headers;
}

/**
 * Validate and sanitize nonce value
 */
export function validateNonce(nonce: string): boolean {
  // Base64 format, 16 bytes = 24 characters when base64 encoded
  const noncePattern = /^[A-Za-z0-9+/]{21,24}={0,2}$/;
  return noncePattern.test(nonce);
}