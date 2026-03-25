'use client';

import { supabase } from '@/lib/supabase';
import type { AuthTokenProvider } from '@/lib/cad-engine-client';

export class SupabaseAuthProvider implements AuthTokenProvider {
  private tokenCache: {
    token: string | null;
    expires: number;
  } = {
    token: null,
    expires: 0
  };

  private readonly TOKEN_BUFFER_MS = 60 * 1000; // Refresh 1 minute before expiry
  private refreshPromise: Promise<string | null> | null = null;

  async getToken(): Promise<string | null> {
    if (process.env.NODE_ENV === 'development') {
      console.log('🎯 SupabaseAuthProvider.getToken() called');
      console.log('Cache token exists:', !!this.tokenCache.token);
      console.log('Cache expires:', new Date(this.tokenCache.expires));
      console.log('Current time:', new Date());
      console.log('Token still valid:', Date.now() < this.tokenCache.expires - this.TOKEN_BUFFER_MS);
    }

    // Return cached token if valid
    if (this.tokenCache.token && Date.now() < this.tokenCache.expires - this.TOKEN_BUFFER_MS) {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Returning cached token');
      }
      return this.tokenCache.token;
    }

    // If refresh is already in progress, wait for it
    if (this.refreshPromise) {
      if (process.env.NODE_ENV === 'development') {
        console.log('⏳ Token refresh already in progress, waiting...');
      }
      return await this.refreshPromise;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Need to refresh token');
    }
    return await this.refreshToken();
  }

  async refreshToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return await this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string | null> {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.group('🔄 Supabase Token Refresh');
        console.log('Starting token refresh...');
      }

      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (process.env.NODE_ENV === 'development') {
        console.log('Session obtained:', !!session);
        console.log('Session error:', error);
        console.log('Access token present:', !!session?.access_token);
        console.log('User ID:', session?.user?.id);
      }
      
      if (error) {
        console.error('Supabase auth error:', error);
        if (process.env.NODE_ENV === 'development') {
          console.groupEnd();
        }
        await this.onAuthFailure();
        return null;
      }

      if (!session?.access_token) {
        console.warn('No active Supabase session');
        if (process.env.NODE_ENV === 'development') {
          console.groupEnd();
        }
        await this.onAuthFailure();
        return null;
      }

      // Validate token structure
      if (!this.isValidSupabaseToken(session.access_token)) {
        console.error('Invalid Supabase token structure');
        await this.onAuthFailure();
        return null;
      }

      // Parse expiry from JWT
      const tokenExpiry = this.extractTokenExpiry(session.access_token);
      
      this.tokenCache = {
        token: session.access_token,
        expires: tokenExpiry
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Token refresh successful');
        console.log('Token expires at:', new Date(tokenExpiry));
        console.log('Token preview:', `${session.access_token.substring(0, 50)}...`);
        console.groupEnd();
      }

      return session.access_token;

    } catch (error) {
      console.error('Token refresh failed:', error);
      await this.onAuthFailure();
      return null;
    }
  }

  async onAuthFailure(): Promise<void> {
    // Clear cached token
    this.tokenCache = {
      token: null,
      expires: 0
    };

    // Check if we're on the client side
    if (typeof window === 'undefined') {
      return;
    }

    // Check current route to avoid redirect loops
    const currentPath = window.location.pathname;
    const authPaths = ['/login', '/signup', '/auth'];
    
    if (authPaths.some(path => currentPath.startsWith(path))) {
      return;
    }

    try {
      // Try to refresh the session first
      const { error } = await supabase.auth.refreshSession();
      
      if (error) {
        // If refresh fails, redirect to login
        console.warn('Session refresh failed, redirecting to login');
        window.location.href = '/login?redirect=' + encodeURIComponent(currentPath);
      }
    } catch (refreshError) {
      console.error('Session refresh attempt failed:', refreshError);
      window.location.href = '/login?redirect=' + encodeURIComponent(currentPath);
    }
  }

  private isValidSupabaseToken(token: string): boolean {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return false;
      }

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));

      // Validate required JWT fields
      return !!(
        header.alg && 
        header.typ === 'JWT' &&
        payload.sub &&
        payload.exp &&
        payload.iat
      );
    } catch {
      return false;
    }
  }

  private extractTokenExpiry(token: string): number {
    try {
      const parts = token.split('.');
      const payload = JSON.parse(atob(parts[1]));
      return payload.exp * 1000; // Convert to milliseconds
    } catch {
      return Date.now() + 3600000; // Default to 1 hour from now
    }
  }

  // Method to check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return token !== null;
  }

  // Method to get current user info
  async getCurrentUser(): Promise<any> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  // Method to sign out
  async signOut(): Promise<void> {
    // Clear token cache immediately
    this.tokenCache = {
      token: null,
      expires: 0
    };
    
    try {
      // Get current user before signing out to clean up session cache
      const { data: { user } } = await supabase.auth.getUser();
      
      // Clear session cache if we have user ID (server-side only)
      if (user?.id && typeof window === 'undefined') {
        try {
          const { sessionCache } = await import('@/lib/cache/session-cache');
          await sessionCache.invalidateUserSessions(user.id);
        } catch (cacheError) {
          console.warn('Failed to clear session cache during signout:', cacheError);
        }
      }
      
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }
}

// Export singleton instance
export const supabaseAuthProvider = new SupabaseAuthProvider();