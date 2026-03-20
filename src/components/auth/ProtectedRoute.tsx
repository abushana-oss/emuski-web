'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthProvider'
import { Loader2, Lock, Shield } from 'lucide-react'
import Link from 'next/link'

interface ProtectedRouteProps {
  children: React.ReactNode
  fallbackPath?: string
  requireAuth?: boolean
}

export default function ProtectedRoute({ 
  children, 
  fallbackPath = '/auth/login',
  requireAuth = true 
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [shouldRedirect, setShouldRedirect] = useState(false)

  useEffect(() => {
    if (!loading && requireAuth && !isAuthenticated) {
      setShouldRedirect(true)
      const currentPath = window.location.pathname
      const redirectUrl = `${fallbackPath}?redirectTo=${encodeURIComponent(currentPath)}`
      router.push(redirectUrl)
    }
  }, [loading, isAuthenticated, requireAuth, fallbackPath, router])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Verifying access...</h3>
            <p className="text-sm text-gray-600 mt-1">Please wait while we check your credentials</p>
          </div>
        </div>
      </div>
    )
  }

  // Show access denied screen if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated && !shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center space-y-6 p-8 max-w-md">
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-red-600" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Authentication Required</h2>
            <p className="text-gray-600">
              You need to sign in to access this page. Please authenticate with your company account.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-amber-600" />
              <p className="text-sm text-amber-700">
                <strong>Secure Access:</strong> Only authorized company accounts can access this content.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <Link 
              href={`${fallbackPath}?redirectTo=${encodeURIComponent(window.location.pathname)}`}
              className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In to Continue
            </Link>
            
            <Link 
              href="/"
              className="inline-flex items-center justify-center w-full px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Return to Home
            </Link>
          </div>

          <p className="text-xs text-gray-500">
            Need help? Contact your system administrator or{' '}
            <Link href="/contact" className="text-blue-600 hover:underline">
              contact support
            </Link>
          </p>
        </div>
      </div>
    )
  }

  // User is authenticated or authentication is not required, render children
  return <>{children}</>
}