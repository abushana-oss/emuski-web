'use client'

import { useAuth } from './AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emuski-teal"></div>
    </div>
  )
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const redirectingRef = useRef(false)

  useEffect(() => {
    if (!loading && !user && !redirectingRef.current) {
      redirectingRef.current = true
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading || !user) {
    return <LoadingSpinner />
  }

  return <>{children}</>
}