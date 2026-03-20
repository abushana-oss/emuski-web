'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { clearSupabaseStorage } from '@/lib/storage'
import { isAdminUser } from '@/lib/auth-config'
import type { AuthUser } from '@/types/auth'

interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  signOut: () => Promise<{ error: Error | null }>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    // 1. Get initial session — source of truth on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mountedRef.current) return
      const user = session?.user ? {
        ...session.user,
        name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0],
        isAdmin: isAdminUser(session.user.email || '')
      } : null
      setUser(user)
      setLoading(false)
    })

    // 2. Subscribe to ALL future auth state changes — this handles
    //    sign-in, sign-out, token refresh, and account switches
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mountedRef.current) return
        const user = session?.user ? {
          ...session.user,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || session.user.email?.split('@')[0],
          isAdmin: isAdminUser(session.user.email || '')
        } : null
        setUser(user)
        setLoading(false)
      }
    )

    return () => {
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async (): Promise<{ error: Error | null }> => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      // Fallback: clear local state even if server call failed
      setUser(null)
      // Clear storage as fallback when server signOut fails
      clearSupabaseStorage()
      return { error: error as Error }
    }
    // onAuthStateChange will fire with null session → setUser(null)
    return { error: null }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signOut, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}