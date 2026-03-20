'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Lock, Eye, EyeOff } from 'lucide-react'
import { authService } from '@/lib/auth-config'
import type { AuthError } from '@/types/auth'
import Link from 'next/link'
import Image from 'next/image'

// Password requirement component
interface PasswordRequirementProps {
  met: boolean
  text: string
}

const PasswordRequirement = ({ met, text }: PasswordRequirementProps) => (
  <div className={`flex items-center space-x-2 ${met ? 'text-green-600' : 'text-red-500'}`}>
    <span className="text-xs">
      {met ? '✓' : '✗'}
    </span>
    <span className="text-xs font-medium">
      {text}
    </span>
  </div>
)

function ResetPasswordPageComponent() {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handlePasswordResetSession = async () => {
      // Get tokens from URL hash fragment (Supabase auth redirects use hash)
      const hash = window.location.hash.substring(1)
      const params = new URLSearchParams(hash)
      
      // Check for error parameters first
      const error = params.get('error')
      const errorCode = params.get('error_code')
      const errorDescription = params.get('error_description')
      
      if (error) {
        let errorMessage = 'Password reset link is invalid or has expired. Please request a new password reset.'
        
        if (errorCode === 'otp_expired') {
          errorMessage = 'Password reset link has expired. Please request a new password reset link.'
        } else if (error === 'access_denied') {
          errorMessage = 'Password reset link is invalid. Please request a new password reset.'
        }
        
        setError({
          message: errorMessage,
          type: 'validation'
        })
        return
      }
      
      const accessToken = params.get('access_token')
      const refreshToken = params.get('refresh_token')
      const type = params.get('type')
      
      if (!accessToken || !refreshToken || type !== 'recovery') {
        setError({
          message: 'Invalid password reset link. Please request a new password reset.',
          type: 'validation'
        })
        return
      }

      // Set the session with the tokens from the URL
      try {
        const { error } = await authService.setSession(accessToken, refreshToken)
        if (error) {
          setError({
            message: 'Invalid or expired password reset link. Please request a new password reset.',
            type: 'validation'
          })
        } else {
          // Clear the error if session was set successfully
          setError(null)
        }
      } catch (err) {
        setError({
          message: 'Invalid password reset link. Please request a new password reset.',
          type: 'validation'
        })
      }
    }

    handlePasswordResetSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Only run once on component mount

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    if (error) {
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsLoading(true)
      setError(null)

      // Validation
      if (!formData.password.trim()) {
        setError({
          message: 'Please enter a new password',
          type: 'validation'
        })
        return
      }

      if (formData.password.length < 8) {
        setError({
          message: 'Password must be at least 8 characters long',
          type: 'validation'
        })
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError({
          message: 'Passwords do not match',
          type: 'validation'
        })
        return
      }

      const { error } = await authService.resetPassword(formData.password)

      if (error) {
        setError(error)
        setIsLoading(false)
        return
      }

      setSuccess(true)
      setIsLoading(false)
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login?message=password-reset-success')
      }, 3000)
    } catch (err) {
      setError({
        message: 'An unexpected error occurred. Please try again.',
        type: 'network'
      })
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
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Reset your password</h1>
          <p className="text-gray-600">Enter your new password below.</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-green-800 mb-2">Password reset successful!</h3>
              <p className="text-sm text-green-700">
                Your password has been updated. You'll be redirected to the login page in a few seconds.
              </p>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {/* Form */}
        {!success && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="New password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full h-12 pl-11 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emuski-teal focus:border-transparent outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full h-12 pl-11 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emuski-teal focus:border-transparent outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Real-time Password Requirements */}
            {formData.password && (
              <div className="text-sm space-y-1">
                <PasswordRequirement 
                  met={formData.password.length >= 8}
                  text="At least 8 characters"
                />
                <PasswordRequirement 
                  met={/[A-Z]/.test(formData.password)}
                  text="One uppercase letter"
                />
                <PasswordRequirement 
                  met={/[a-z]/.test(formData.password)}
                  text="One lowercase letter"
                />
                <PasswordRequirement 
                  met={/\d/.test(formData.password)}
                  text="One number"
                />
                <PasswordRequirement 
                  met={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(formData.password)}
                  text="One special character"
                />
              </div>
            )}
            
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-emuski-teal hover:bg-emuski-teal-dark text-white font-medium rounded-lg transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </form>
        )}

        {/* Back to Login */}
        <div className="mt-8 text-center">
          <Link 
            href="/auth/login"
            className="text-gray-600 hover:text-gray-800 text-sm transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    }>
      <ResetPasswordPageComponent />
    </Suspense>
  )
}