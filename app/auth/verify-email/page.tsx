'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, CheckCircle2, RefreshCw } from 'lucide-react'
import { authService } from '@/lib/auth-config'
import type { AuthError } from '@/types/auth'
import Link from 'next/link'
import Image from 'next/image'

function VerifyEmailPageComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [success, setSuccess] = useState(false)
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const handleResendEmail = async () => {
    if (!email) {
      setError({
        message: 'Email address is required',
        type: 'validation'
      })
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      // Use the proper resend verification email function
      const { error } = await authService.resendVerificationEmail(email)

      if (error) {
        setError(error)
        return
      }

      setSuccess(true)
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err) {
      setError({
        message: 'Failed to resend verification email',
        type: 'network'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-8 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <div className="flex items-center space-x-3">
              <Image
                src="/assets/emuski-logo-optimized.webp"
                alt="EMUSKI"
                width={96}
                height={48}
                className="h-12 w-auto"
              />
              <span className="text-3xl font-bold text-gray-900">EMUSKI</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">Check your email</h1>
          
          <div className="text-gray-600 mb-8 space-y-2">
            <p>We've sent a verification link to:</p>
            <p className="font-semibold text-gray-900">{email}</p>
            <p className="text-sm">Click the link in the email to verify your account and complete the signup process.</p>
          </div>

          {/* Success Message for Resent Email */}
          {success && (
            <div className="mb-6 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-center text-green-700">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">Verification email sent!</span>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {error.message}
                {error.message.includes('already been verified') && (
                  <div className="mt-2">
                    <Link 
                      href="/auth/login" 
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      Go to login page
                    </Link>
                  </div>
                )}
                {error.message.includes('Account not found') && (
                  <div className="mt-2">
                    <Link 
                      href="/auth/register" 
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      Sign up for a new account
                    </Link>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Resend Email Button */}
          <Button 
            onClick={handleResendEmail}
            disabled={isLoading || success}
            variant="outline"
            className="w-full h-12 mb-6 border-emuski-teal text-emuski-teal hover:bg-emuski-teal hover:text-white font-medium rounded-lg transition-colors"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Sending...
              </>
            ) : success ? (
              <>
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Email Sent
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5 mr-2" />
                Resend verification email
              </>
            )}
          </Button>

          {/* Instructions */}
          <div className="text-sm text-gray-500 space-y-2">
            <p><strong>Didn't receive the email?</strong></p>
            <ul className="text-left space-y-1">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure {email} is correct</li>
              <li>• Wait a few minutes and check again</li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div className="mt-8 pt-6 border-t border-gray-200 space-y-4">
            <div>
              <Link 
                href="/auth/login"
                className="text-emuski-teal hover:text-emuski-teal-dark font-medium transition-colors"
              >
                Back to Login
              </Link>
            </div>
            
            <div className="text-sm text-gray-500">
              Wrong email address?{' '}
              <Link 
                href="/auth/register"
                className="text-emuski-teal hover:text-emuski-teal-dark font-medium transition-colors"
              >
                Sign up again
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <VerifyEmailPageComponent />
    </Suspense>
  )
}