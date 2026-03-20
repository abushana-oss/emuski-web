import type { User as SupabaseUser } from '@supabase/supabase-js'

export interface AuthUser extends SupabaseUser {
  name?: string     // extracted from user_metadata or email
  isAdmin: boolean  // not optional — always calculated, always present
}

export interface AuthError {
  message: string
  type: 'validation' | 'authentication' | 'authorization' | 'network'
}