'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { validateEmailAccess } from '@/lib/auth-config'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'

function AuthCallbackComponent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(true)

  useEffect(() => {
    let isCanceled = false

    const handleAuthCallback = async () => {
      if (isCanceled) return

      try {
        // Check for OAuth callback parameters in URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const searchParamsFromURL = new URLSearchParams(window.location.search)
        
        // Handle PKCE flow (authorization code)
        if (searchParamsFromURL.has('code')) {
          const { data: sessionData, error: callbackError } = await supabase.auth.exchangeCodeForSession(
            searchParamsFromURL.get('code') || ''
          )
          
          if (isCanceled) return
          
          if (callbackError) {
            setError(callbackError.message || 'Authentication callback failed')
            setIsProcessing(false)
            return
          }

          // If we have a session after exchange, validate and redirect
          if (sessionData?.session?.user) {
            const user = sessionData.session.user
            
            // Validate email access
            if (!(await validateEmailAccess(user.email || ''))) {
              await supabase.auth.signOut()
              setError('Access is restricted to authorized company email addresses only.')
              setIsProcessing(false)
              return
            }

            // Success - redirect immediately
            const redirectTo = searchParams.get('redirectTo') || '/'
            router.replace(redirectTo)
            return
          }
        }
        
        // Handle implicit flow (access token in hash)
        else if (hashParams.has('access_token')) {
          // For implicit flow, the session should be automatically set by Supabase
          // Wait a moment for the auth state to update
          await new Promise(resolve => setTimeout(resolve, 500))
          
          const { data, error: sessionError } = await supabase.auth.getSession()
          
          if (isCanceled) return

          if (sessionError) {
            setError(sessionError.message || 'Authentication failed')
            setIsProcessing(false)
            return
          }

          // If we have a session, validate and redirect
          if (data.session?.user) {
            const user = data.session.user
            
            // Validate email access
            if (!(await validateEmailAccess(user.email || ''))) {
              await supabase.auth.signOut()
              setError('Access is restricted to authorized company email addresses only.')
              setIsProcessing(false)
              return
            }

            // Success - redirect immediately
            const redirectTo = searchParams.get('redirectTo') || '/'
            router.replace(redirectTo)
            return
          }
        }
        
        // Check if we already have a session (direct navigation to callback)
        else {
          const { data, error: sessionError } = await supabase.auth.getSession()
          
          if (isCanceled) return

          if (sessionError) {
            setError(sessionError.message || 'Authentication failed')
            setIsProcessing(false)
            return
          }

          // If we have a session, validate and redirect
          if (data.session?.user) {
            const user = data.session.user
            
            // Validate email access
            if (!(await validateEmailAccess(user.email || ''))) {
              await supabase.auth.signOut()
              setError('Access is restricted to authorized company email addresses only.')
              setIsProcessing(false)
              return
            }

            // Success - redirect immediately
            const redirectTo = searchParams.get('redirectTo') || '/'
            router.replace(redirectTo)
            return
          }
        }

        // No auth data found
        setError('No authentication data received')
        setIsProcessing(false)

      } catch (error) {
        if (!isCanceled) {
          setError('An unexpected error occurred during authentication')
          setIsProcessing(false)
        }
      }
    }

    const timeoutId = setTimeout(() => {
      if (!isCanceled) {
        handleAuthCallback()
      }
    }, 100)

    return () => {
      isCanceled = true
      clearTimeout(timeoutId)
    }
  }, [router, searchParams])

  const handleRetry = () => {
    router.push('/')
  }

  // Only show UI if there's an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-6 p-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Authentication Error
            </h1>
          </div>

          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          
          <div className="text-center">
            <Button onClick={handleRetry} variant="outline" className="w-full">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Show minimal processing indicator if still processing
  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Show nothing if no error (should have redirected already)
  return null
}

export default function AuthCallback() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <AuthCallbackComponent />
    </Suspense>
  )
}