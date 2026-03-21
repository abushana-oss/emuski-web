'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Mail, ArrowLeft } from 'lucide-react'
import { authService } from '@/lib/auth-config'
import type { AuthError } from '@/types/auth'
import Link from 'next/link'
import Image from 'next/image'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsLoading(true)
      setError(null)
      setSuccess(false)

      if (!email.trim()) {
        setError({
          message: 'Please enter your email address',
          type: 'validation'
        })
        return
      }

      const { error } = await authService.requestPasswordReset(email)

      if (error) {
        setError(error)
        return
      }

      setSuccess(true)
    } catch (err) {
      setError({
        message: 'An unexpected error occurred. Please try again.',
        type: 'network'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (error) {
      setError(null)
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Forgot your password?</h1>
          <p className="text-gray-600">Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start">
              <Mail className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-green-800 mb-1">Check your email</h3>
                <p className="text-sm text-green-700">
                  We've sent a password reset link to <strong>{email}</strong>. 
                  Click the link in the email to reset your password.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              {error.message}
              {error.message.includes('No account found') && (
                <div className="mt-2">
                  <Link 
                    href="/auth/register" 
                    className="text-blue-600 hover:text-blue-800 font-medium underline"
                  >
                    Create a new account instead
                  </Link>
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                placeholder="Company email"
                value={email}
                onChange={handleEmailChange}
                className="w-full h-12 pl-11 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emuski-teal focus:border-transparent outline-none"
                required
              />
            </div>
            
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-emuski-teal hover:bg-emuski-teal-dark text-white font-medium rounded-lg transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <Link 
            href="/auth/login"
            className="inline-flex items-center text-emuski-teal hover:text-emuski-teal-dark font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>

        {/* Try Again Button (shown after success) */}
        {success && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setSuccess(false)
                setEmail('')
                setError(null)
              }}
              className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
            >
              Didn't receive the email? Try again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}