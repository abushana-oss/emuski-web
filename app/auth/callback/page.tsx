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
    const handleAuthCallback = async () => {
      try {
        // Check if we have auth data in the URL hash
        const hash = window.location.hash
        
        // Let Supabase handle the auth callback automatically
        const { data, error: authError } = await supabase.auth.getSession()
        
        if (authError) {
          console.error('Auth session error:', authError)
          setError(authError.message || 'Authentication failed')
          setIsProcessing(false)
          return
        }

        // If we have a session, validate and redirect
        if (data.session?.user) {
          const user = data.session.user
          
          // Validate email access
          if (!validateEmailAccess(user.email || '')) {
            await supabase.auth.signOut()
            setError('Access is restricted to authorized company email addresses only.')
            setIsProcessing(false)
            return
          }

          // Success - redirect immediately
          const redirectTo = searchParams.get('redirectTo') || '/'
          console.log('Redirecting to:', redirectTo)
          router.replace(redirectTo)
          return
        }

        // If no session yet, wait a bit for Supabase to process the callback
        if (hash.includes('access_token') || hash.includes('code')) {
          setTimeout(() => {
            // Try again after Supabase processes the callback
            handleAuthCallback()
          }, 1000)
          return
        }

        // No auth data found
        setError('No authentication data received')
        setIsProcessing(false)

      } catch (error) {
        console.error('Auth callback error:', error)
        setError('An unexpected error occurred during authentication')
        setIsProcessing(false)
      }
    }

    // Small delay to ensure the page is fully loaded
    const timeoutId = setTimeout(() => {
      handleAuthCallback()
    }, 100)

    return () => clearTimeout(timeoutId)
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