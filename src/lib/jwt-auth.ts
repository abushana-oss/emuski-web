import { createClient } from '@supabase/supabase-js';

/**
 * JWT Token Verification for Supabase
 * Industry standard token validation with proper security
 */

const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;

// JWT Auth initialized for production use
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Service role client for user verification
const supabaseService = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!);

export interface JWTPayload {
  sub: string; // User ID
  email?: string;
  role?: string;
  iat: number;
  exp: number;
  aud?: string;
}

export interface AuthResult {
  valid: boolean;
  userId?: string;
  email?: string;
  error?: string;
}

/**
 * Verify Supabase JWT token using Supabase client (Industry Standard)
 * This is more reliable than manual JWT verification
 */
export async function verifySupabaseJWT(token: string): Promise<AuthResult> {
  try {
    // Use Supabase client for proper JWT verification
    const { data, error } = await supabaseService.auth.getUser(token);
    
    if (error) {
      return { valid: false, error: error.message };
    }

    if (!data.user) {
      return { valid: false, error: 'User not found' };
    }

    return {
      valid: true,
      userId: data.user.id,
      email: data.user.email
    };

  } catch (error: any) {
    return { valid: false, error: `Authentication failed: ${error.message}` };
  }
}

/**
 * Extract and verify token from Authorization header (Industry Standard)
 */
export async function extractAndVerifyToken(authHeader: string | null): Promise<AuthResult> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false, error: 'Missing or invalid authorization header' };
  }

  const token = authHeader.substring(7); // Remove "Bearer "
  return await verifySupabaseJWT(token);
}

/**
 * Industry standard JWT authentication for API routes
 */
export async function authenticateRequest(authHeader: string | null): Promise<AuthResult> {
  return await extractAndVerifyToken(authHeader);
}