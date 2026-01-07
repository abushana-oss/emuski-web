import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
