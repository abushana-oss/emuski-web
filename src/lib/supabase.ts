import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY

// Create a safe client that handles missing environment variables
const createSafeSupabaseClient = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for builds without environment variables
    return {
      from: () => ({
        insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        select: () => Promise.resolve({ data: [], error: null }),
        update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } })
      }),
      auth: {
        signIn: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
        signOut: () => Promise.resolve({ error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null })
      }
    } as any;
  }

  return createClient(supabaseUrl, supabaseAnonKey);
};

export const supabase = createSafeSupabaseClient();

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// Type definitions for our tables
export interface EmailSubscription {
  id?: string
  email: string
  subscribed_at?: string
  status?: string
  source?: string
  ip_address?: string
  user_agent?: string
}

export interface ContactSubmission {
  id?: string
  name: string
  email: string
  phone?: string
  requirements?: string
  file_name?: string
  recaptcha_token?: string
  status?: string
  submitted_at?: string
  ip_address?: string
  user_agent?: string
}
