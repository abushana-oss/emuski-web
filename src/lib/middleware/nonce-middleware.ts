import { NextRequest, NextResponse } from 'next/server';
import { generateCSPNonce, getEnhancedSecurityHeaders } from '@/lib/csp-nonce';

/**
 * Middleware to generate CSP nonces and apply enhanced security headers
 */
export function withCSPNonce(
  handler: (req: NextRequest) => Promise<NextResponse> | NextResponse
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    try {
      // Generate a unique nonce for this request
      const nonce = generateCSPNonce();
      
      // Store nonce in request headers for components to access
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set('x-nonce', nonce);
      
      // Create new request with nonce header
      const modifiedRequest = new NextRequest(req.url, {
        method: req.method,
        headers: requestHeaders,
        body: req.body,
      });
      
      // Call the handler
      const response = await handler(modifiedRequest);
      
      // Apply enhanced security headers with nonce
      const securityHeaders = getEnhancedSecurityHeaders(nonce);
      
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    } catch (error) {
      console.error('CSP nonce middleware error:', error);
      // Fallback - call handler without nonce
      return handler(req);
    }
  };
}

/**
 * Apply CSP nonce to API routes
 */
export function withAPICSPNonce<T extends any[]>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse> | NextResponse
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    const nonce = generateCSPNonce();
    
    try {
      const response = await handler(req, ...args);
      
      // Apply enhanced API security headers
      const apiSecurityHeaders = {
        'Content-Security-Policy': `default-src 'self'; script-src 'self' 'nonce-${nonce}'; object-src 'none'; base-uri 'self';`,
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'no-referrer',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Opener-Policy': 'same-origin',
        'X-Nonce': nonce,
      };

      Object.entries(apiSecurityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value);
      });
      
      return response;
    } catch (error) {
      console.error('API CSP nonce error:', error);
      throw error;
    }
  };
}