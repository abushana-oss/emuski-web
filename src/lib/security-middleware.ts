import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/jwt-auth';

/**
 * Security configurations following industry standards
 * Implements defense-in-depth security model
 */
export const SECURITY_CONFIGS = {
  DFM_ANALYSIS: {
    maxFileSize: 10 * 1024 * 1024, // 10MB - industry standard for CAD files
    allowedFileTypes: ['stl', 'obj', 'ply', 'step', 'stp'],
    requireAuth: true,
    rateLimitKey: '/api/dfm-analysis'
  },
  API_DEFAULT: {
    maxFileSize: 1 * 1024 * 1024, // 1MB
    allowedFileTypes: [],
    requireAuth: false,
    rateLimitKey: '/api/default'
  }
} as const;

export type SecurityConfig = typeof SECURITY_CONFIGS[keyof typeof SECURITY_CONFIGS];

/**
 * Industry standard security middleware
 * Implements OWASP security best practices
 */
export function withSecurity<T extends any[]>(
  handler: (req: NextRequest, ...args: T) => Promise<NextResponse>,
  config: SecurityConfig = SECURITY_CONFIGS.API_DEFAULT
) {
  return async (req: NextRequest, ...args: T): Promise<NextResponse> => {
    try {
      // 1. Authentication validation (if required)
      if (config.requireAuth) {
        const authHeader = req.headers.get('authorization');
        const authResult = await authenticateRequest(authHeader);
        
        if (!authResult.valid || !authResult.userId) {
          return NextResponse.json(
            { 
              error: 'Authentication required',
              code: 'UNAUTHORIZED'
            },
            { status: 401 }
          );
        }
        
        // Attach user info to request for downstream use
        (req as any).userId = authResult.userId;
        (req as any).userEmail = authResult.email;
      }

      // 2. Content-Length validation (prevent DoS)
      if (req.method === 'POST' && config.maxFileSize) {
        const contentLength = req.headers.get('content-length');
        if (contentLength && parseInt(contentLength) > config.maxFileSize) {
          return NextResponse.json(
            { 
              error: 'Payload too large',
              maxSize: `${Math.floor(config.maxFileSize / (1024 * 1024))}MB`,
              code: 'PAYLOAD_TOO_LARGE'
            },
            { status: 413 }
          );
        }
      }

      // 3. Security headers (industry standard)
      const response = await handler(req, ...args);
      
      // Add security headers to response
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      
      return response;

    } catch (error) {
      console.error('Security middleware error:', error);
      return NextResponse.json(
        { 
          error: 'Internal server error',
          code: 'INTERNAL_ERROR'
        },
        { status: 500 }
      );
    }
  };
}