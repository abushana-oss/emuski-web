'use client'

import { useState, useEffect, Suspense, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { authService } from '@/lib/auth-config'
import type { AuthError } from '@/types/auth'
import Link from 'next/link'
import Image from 'next/image'
import Script from 'next/script'

// TypeScript declaration for reCAPTCHA (compatible with enterprise)
declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void
      render: (element: HTMLElement | string, options: {
        sitekey: string
        callback?: (token: string) => void
        'expired-callback'?: () => void
        'error-callback'?: () => void
      }) => void
      enterprise?: {
        ready: (callback: () => void) => void
        execute: (siteKey: string, options: { action: string }) => Promise<string>
        render: (container: string | HTMLElement, parameters: {
          sitekey: string
          callback?: (token: string) => void
          'expired-callback'?: () => void
          'error-callback'?: () => void
          theme?: 'light' | 'dark'
          size?: 'compact' | 'normal' | 'invisible'
        }) => number
        reset: (widgetId?: number) => void
      }
    }
  }
}

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

function RegisterPageComponent() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showServices, setShowServices] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [recaptchaReady, setRecaptchaReady] = useState(false)
  const recaptchaRef = useRef<any>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') || '/'

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % 3)
    }, 4000) // Change image every 4 seconds

    return () => clearInterval(interval)
  }, [])

  // Initialize reCAPTCHA
  useEffect(() => {
    const initRecaptcha = () => {
      if (typeof window !== 'undefined' && window.grecaptcha) {
        window.grecaptcha.ready(() => {
          setRecaptchaReady(true)
          if (recaptchaRef.current) {
            window.grecaptcha.render(recaptchaRef.current, {
              sitekey: process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI', // Test key
              callback: (token: string) => {
                setCaptchaToken(token)
              },
              'expired-callback': () => {
                setCaptchaToken(null)
              },
              'error-callback': () => {
                setCaptchaToken(null)
              }
            })
          }
        })
      } else {
        // Retry after a short delay if grecaptcha is not ready
        setTimeout(initRecaptcha, 100)
      }
    }

    initRecaptcha()
  }, [recaptchaReady])

  const handleGoogleSignUp = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const { error } = await authService.signInWithGoogle()
      
      if (error) {
        setError(error)
        return
      }
    } catch (err) {
      setError({
        message: 'An unexpected error occurred. Please try again.',
        type: 'network'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
    // Clear error when user starts typing
    if (error) {
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setIsLoading(true)
      setError(null)

      // Basic validation
      if (!formData.name.trim()) {
        setError({
          message: 'Please enter your name',
          type: 'validation'
        })
        return
      }

      if (!formData.email.trim()) {
        setError({
          message: 'Please enter your email',
          type: 'validation'
        })
        return
      }

      if (!formData.password.trim()) {
        setError({
          message: 'Please enter a password',
          type: 'validation'
        })
        return
      }

      if (!formData.confirmPassword.trim()) {
        setError({
          message: 'Please confirm your password',
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

      if (formData.password.length < 8) {
        setError({
          message: 'Password must be at least 8 characters long',
          type: 'validation'
        })
        return
      }

      // CAPTCHA validation
      if (!captchaToken) {
        setError({
          message: 'Please complete the CAPTCHA verification',
          type: 'validation'
        })
        return
      }

      const { data, error } = await authService.signUpWithEmail(
        formData.email,
        formData.password,
        formData.name,
        captchaToken
      )

      if (error) {
        setError(error)
        return
      }

      // Success - user will receive email verification
      router.push('/auth/verify-email?email=' + encodeURIComponent(formData.email))
    } catch (err) {
      setError({
        message: 'An unexpected error occurred. Please try again.',
        type: 'network'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-12 order-first">
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
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Create new account</h1>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                {error.message}
                {(error.message.includes('already exists') && !error.message.includes('not verified')) && (
                  <div className="mt-2">
                    <Link 
                      href={`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`}
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      Go to login page
                    </Link>
                  </div>
                )}
                {(error.message.includes('not verified') || error.message.includes('verification link')) && (
                  <div className="mt-2">
                    <Link 
                      href={`/auth/verify-email?email=${encodeURIComponent(formData.email)}`}
                      className="text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      Go to email verification page
                    </Link>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full h-12 pl-11 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emuski-teal focus:border-transparent outline-none"
                required
              />
            </div>
            
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Company email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full h-12 pl-11 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emuski-teal focus:border-transparent outline-none"
                required
              />
            </div>
            
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password (minimum 8 characters)"
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
                placeholder="Confirm Password (minimum 8 characters)"
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
            
            {/* CAPTCHA */}
            <div className="flex flex-col items-center space-y-4">
              {recaptchaReady ? (
                <div 
                  ref={recaptchaRef}
                  className="flex justify-center"
                />
              ) : (
                <div className="text-sm text-gray-500">Loading security verification...</div>
              )}
            </div>
            
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-emuski-teal hover:bg-emuski-teal-dark text-white font-medium rounded-lg transition-colors mt-6 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Sign up'
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="mb-6">
            <Button 
              onClick={handleGoogleSignUp}
              disabled={isLoading}
              className="w-full h-12 bg-white border-2 border-gray-300 text-gray-700 hover:text-black font-medium rounded-lg transition-colors"
              variant="outline"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 mr-3 animate-spin" />
              ) : (
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Google
            </Button>
          </div>

          {/* Login Link */}
          <div className="text-center mt-6">
            <span className="text-gray-600">Already member? </span>
            <Link href={`/auth/login?redirectTo=${encodeURIComponent(redirectTo)}`} className="text-emuski-teal hover:text-emuski-teal-dark font-medium">
              Log in
            </Link>
          </div>

          {/* Terms */}
          <div className="text-center mt-6 text-xs text-gray-500">
            By creating an account, you agree to EMUSKI{' '}
            <Link href="/terms-and-conditions" className="text-emuski-teal hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy-policy" className="text-emuski-teal hover:underline">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Info */}
      <div className="w-full lg:w-1/2 bg-gray-100 relative order-last min-h-[50vh] lg:min-h-screen">
        <div className="flex flex-col justify-end lg:justify-center items-center p-4 lg:p-12 text-center h-full pt-20 lg:pt-4">
          <div className="max-w-lg w-full mb-8 lg:mb-0">
            {/* Auto-rotating Image Carousel */}
            <div className="mb-6 lg:mb-8 relative">
              <div className="carousel-container overflow-hidden rounded-lg shadow-lg">
                <div 
                  className="carousel-track flex transition-transform duration-1000 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  <img 
                    src="/assets/manufacturingservices/production-scaling-capabilities.svg" 
                    alt="EMUSKI Production Scaling" 
                    className="w-full max-w-md lg:max-w-full h-auto flex-shrink-0 mx-auto"
                  />
                  <img 
                    src="/assets/engineeringservices/engineering-service-project-management.svg" 
                    alt="EMUSKI Project Management" 
                    className="w-full max-w-md lg:max-w-full h-auto flex-shrink-0 mx-auto"
                  />
                  <img 
                    src="/assets/engineeringservices/engineering-service-technical-support.svg" 
                    alt="EMUSKI Technical Support" 
                    className="w-full max-w-md lg:max-w-full h-auto flex-shrink-0 mx-auto"
                  />
                </div>
              </div>
              {/* Carousel dots */}
              <div className="flex justify-center mt-4 space-x-2">
                {[0, 1, 2].map((index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      currentSlide === index ? 'bg-emuski-teal' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            
            <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4">End-to-End Manufacturing & Engineering Solutions</h2>
            <p className="text-base lg:text-lg text-gray-600 mb-6 lg:mb-8">
              Through our NPD Innovation Center, EMUSKI delivers comprehensive manufacturing and engineering services from concept to production. Transform your ideas into market-ready products with precision and speed.
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 cursor-pointer hover:text-gray-700" onClick={() => setShowServices(!showServices)}>
              <span>See all services</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={showServices ? "M19 15l-7-7-7 7" : "M19 9l-7 7-7-7"} />
              </svg>
            </div>
            
            {/* Services Dropdown */}
            {showServices && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 mb-3">Manufacturing Excellence</h3>
                  <ul className="text-sm space-y-2">
                    <li><a href="/on-demand-manufacturing" className="text-black hover:text-gray-600 transition-colors">On-Demand Manufacturing</a></li>
                    <li><a href="/rapid-prototyping" className="text-black hover:text-gray-600 transition-colors">Rapid Prototyping</a></li>
                    <li><a href="/custom-manufacturing" className="text-black hover:text-gray-600 transition-colors">Custom Manufacturing</a></li>
                    <li><a href="/production-scaling" className="text-black hover:text-gray-600 transition-colors">Production Scaling</a></li>
                  </ul>
                </div>
                
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 mb-3">Engineering Innovation</h3>
                  <ul className="text-sm space-y-2">
                    <li><a href="/product-cost-estimation" className="text-black hover:text-gray-600 transition-colors">Product Cost Estimation</a></li>
                    <li><a href="/vave-teardown-benchmarking" className="text-black hover:text-gray-600 transition-colors">VAVE - Teardown & Benchmarking</a></li>
                    <li><a href="/strategic-sourcing-support" className="text-black hover:text-gray-600 transition-colors">Strategic Sourcing Support</a></li>
                    <li><a href="/expert-engineer-support" className="text-black hover:text-gray-600 transition-colors">Expert Engineer Support</a></li>
                    <li><a href="/mithran-ai-platform" className="text-black hover:text-gray-600 transition-colors">Mithran AI Platform</a></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          
          {/* Floating elements with EMUSKI brand colors */}
          <div className="absolute top-20 right-20 w-12 h-12 bg-emuski-teal rounded-full opacity-80"></div>
          <div className="absolute bottom-40 left-20 w-8 h-8 bg-emuski-teal-light rounded opacity-60"></div>
          <div className="absolute bottom-1/3 right-12 w-10 h-10 bg-emuski-dark rounded opacity-50"></div>
          <div className="absolute top-1/2 left-12 w-4 h-4 bg-emuski-teal rounded-full opacity-80"></div>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <>
      <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="lazyOnload"
      />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      }>
        <RegisterPageComponent />
      </Suspense>
    </>
  )
}