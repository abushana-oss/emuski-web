/**
 * Enterprise-grade security headers configuration
 * Implements comprehensive web security controls
 */

export interface SecurityConfig {
  environment: 'development' | 'production';
  domain: string;
  supabaseDomain: string;
  cdnDomains?: string[];
}

/**
 * Generate nonce for CSP
 */
export function generateNonce(): string {
  return btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))));
}

/**
 * Content Security Policy configuration
 */
export function generateCSP(config: SecurityConfig, nonce?: string): string {
  const { environment, domain, supabaseDomain, cdnDomains = [] } = config;
  
  const isDev = environment === 'development';
  const nonceDirective = nonce ? ` 'nonce-${nonce}'` : '';
  
  // Allow localhost and development domains in dev mode
  const devDomains = isDev ? ' localhost:* 127.0.0.1:* *.localhost' : '';
  
  // Additional CDN domains
  const cdnDirectives = cdnDomains.length > 0 ? ` ${cdnDomains.join(' ')}` : '';
  
  const policies = [
    // Default source - very restrictive
    `default-src 'self'${devDomains}`,
    
    // Scripts - controlled with nonces in production
    `script-src 'self'${nonceDirective}${isDev ? " 'unsafe-inline' 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com${devDomains}`,
    
    // Styles - allow inline for CSS-in-JS but prefer nonces
    `style-src 'self' 'unsafe-inline'${nonceDirective} https://fonts.googleapis.com${devDomains}`,
    
    // Images - allow data URIs for CAD textures and icons
    `img-src 'self' data: blob: https: ${supabaseDomain}${cdnDirectives}${devDomains}`,
    
    // Fonts
    `font-src 'self' data: https://fonts.gstatic.com${devDomains}`,
    
    // Connect sources - API endpoints
    `connect-src 'self' ${supabaseDomain} https://api.anthropic.com https://www.google-analytics.com${devDomains}`,
    
    // Media sources
    `media-src 'self' blob: ${supabaseDomain}${devDomains}`,
    
    // Object sources - restrict embedded content
    `object-src 'none'`,
    
    // Base URI - prevent injection attacks
    `base-uri 'self'`,
    
    // Form actions - restrict form submissions
    `form-action 'self'`,
    
    // Frame ancestors - prevent clickjacking
    `frame-ancestors 'none'`,
    
    // Worker sources - for web workers
    `worker-src 'self' blob:`,
    
    // Manifest source
    `manifest-src 'self'`,
    
    // Upgrade insecure requests in production
    ...(isDev ? [] : ['upgrade-insecure-requests']),
  ];
  
  return policies.join('; ');
}

/**
 * Comprehensive security headers
 */
export function getSecurityHeaders(config: SecurityConfig): Record<string, string> {
  const { environment, domain } = config;
  const isDev = environment === 'development';
  
  const headers: Record<string, string> = {
    // Content Security Policy
    'Content-Security-Policy': generateCSP(config),
    
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // XSS Protection (legacy but still useful)
    'X-XSS-Protection': '1; mode=block',
    
    // Frame Options - prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Referrer Policy - control referrer information
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions Policy - control browser features
    'Permissions-Policy': [
      'accelerometer=()',
      'camera=()',
      'geolocation=()',
      'gyroscope=()',
      'magnetometer=()',
      'microphone=()',
      'payment=()',
      'usb=()'
    ].join(', '),
    
    // Cross-Origin Embedder Policy
    'Cross-Origin-Embedder-Policy': 'require-corp',
    
    // Cross-Origin Opener Policy
    'Cross-Origin-Opener-Policy': 'same-origin',
    
    // Cross-Origin Resource Policy
    'Cross-Origin-Resource-Policy': 'same-origin',
    
    // Strict Transport Security (HTTPS only)
    ...(isDev ? {} : {
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
    }),
    
    // Server identification hiding
    'Server': 'Emuski-CAD',
    
    // Cache Control for security-sensitive pages
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    
    // Prevent DNS prefetching
    'X-DNS-Prefetch-Control': 'off',
    
    // Download options for IE
    'X-Download-Options': 'noopen',
    
    // Prevent Flash cross-domain requests
    'X-Permitted-Cross-Domain-Policies': 'none',
  };
  
  return headers;
}

/**
 * API-specific security headers
 */
export function getAPISecurityHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'no-referrer',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Cache-Control': 'no-store, max-age=0',
  };
}

/**
 * File upload specific security headers
 */
export function getUploadSecurityHeaders(): Record<string, string> {
  return {
    ...getAPISecurityHeaders(),
    'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
    'X-Upload-Security': 'validated',
  };
}

/**
 * Security middleware for Next.js
 */
export function securityMiddleware(config: SecurityConfig) {
  return (request: Request): Record<string, string> => {
    const url = new URL(request.url);
    
    // API routes get minimal headers
    if (url.pathname.startsWith('/api/')) {
      return getAPISecurityHeaders();
    }
    
    // Upload routes get special handling
    if (url.pathname.includes('/upload') || url.pathname.includes('/file')) {
      return getUploadSecurityHeaders();
    }
    
    // Default page headers
    return getSecurityHeaders(config);
  };
}

/**
 * Validate request origin and referrer
 */
export function validateRequestOrigin(request: Request, allowedOrigins: string[]): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  // Allow requests without origin/referer (direct navigation)
  if (!origin && !referer) return true;
  
  // Check origin
  if (origin && !allowedOrigins.some(allowed => origin.includes(allowed))) {
    return false;
  }
  
  // Check referer
  if (referer) {
    const refererUrl = new URL(referer);
    if (!allowedOrigins.some(allowed => refererUrl.hostname.includes(allowed))) {
      return false;
    }
  }
  
  return true;
}

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: Request) => string;
}

export const RATE_LIMIT_CONFIGS: Record<string, RateLimitConfig> = {
  // API endpoints
  'api-general': {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    skipSuccessfulRequests: false,
  },
  
  // Authentication endpoints
  'auth': {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    skipSuccessfulRequests: true,
  },
  
  // File upload endpoints
  'upload': {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    skipSuccessfulRequests: false,
  },
  
  // DFM analysis endpoints
  'analysis': {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20,
    skipSuccessfulRequests: false,
  },
  
  // Contact form
  'contact': {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    skipSuccessfulRequests: true,
  },
};

/**
 * Security event logging
 */
export interface SecurityEvent {
  type: 'rate_limit' | 'invalid_origin' | 'malicious_file' | 'auth_failure' | 'suspicious_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ip: string;
  userAgent: string;
  details: Record<string, any>;
  timestamp: string;
}

export function logSecurityEvent(event: SecurityEvent): void {
  // In production, this would send to a security monitoring system
  console.warn('Security Event:', {
    ...event,
    timestamp: new Date().toISOString(),
  });
  
  // Critical events should trigger immediate alerts
  if (event.severity === 'critical') {
    console.error('CRITICAL SECURITY EVENT:', event);
    // In production: send to monitoring system, trigger alerts, etc.
  }
}

/**
 * Request sanitization
 */
export function sanitizeHeaders(headers: Headers): Record<string, string> {
  const sanitized: Record<string, string> = {};
  const allowedHeaders = [
    'content-type',
    'authorization',
    'user-agent',
    'accept',
    'accept-language',
    'cache-control',
    'x-user-id',
    'x-request-id',
  ];
  
  allowedHeaders.forEach(header => {
    const value = headers.get(header);
    if (value) {
      // Basic sanitization
      sanitized[header] = value.replace(/[<>'"]/g, '').substring(0, 1000);
    }
  });
  
  return sanitized;
}