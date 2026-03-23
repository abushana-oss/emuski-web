import { supabase } from './supabase'
import { clearSupabaseStorage } from './storage'
import type { AuthUser, AuthError } from '@/types/auth'

export const AUTH_CONFIG = {
  // Admin email addresses
  ADMIN_EMAILS: (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'abushan.a@emuski.com').split(',').map(email => email.trim()),

  // Allowed company domains for regular access
  ALLOWED_DOMAINS: (process.env.NEXT_PUBLIC_ALLOWED_DOMAINS || 'emuski.com').split(',').map(domain => domain.trim()),

  // Google OAuth configuration
  GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,

  // Session configuration
  SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hour in milliseconds
  REFRESH_THRESHOLD: 5 * 60 * 1000, // 5 minutes before expiry
} as const

// User and AuthError types now imported from shared types

// Blocked personal email domains
const BLOCKED_PERSONAL_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'live.com',
  'aol.com',
  'icloud.com',
  'protonmail.com',
  'mail.com',
  'zoho.com'
]

// Email domain validation for company access - allows any company domain, blocks personal emails
export const validateEmailDomain = (email: string): boolean => {
  if (!email || !email.includes('@')) return false

  const domain = email.split('@')[1]?.toLowerCase()

  // Block personal email domains
  if (BLOCKED_PERSONAL_DOMAINS.includes(domain)) {
    return false
  }

  // Allow any other domain (company domains)
  return true
}

// Check if user is admin
export const isAdminUser = (email: string): boolean => {
  if (!email) return false
  return AUTH_CONFIG.ADMIN_EMAILS.includes(email.toLowerCase())
}

// Check if user has any access (admin or company domain)
export const validateEmailAccess = (email: string): boolean => {
  if (!email || !email.includes('@')) return false

  return isAdminUser(email) || validateEmailDomain(email)
}

// Validate email format
export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Password strength validation
export const validatePasswordStrength = (password: string): { isValid: boolean; message?: string } => {
  if (!password || password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' }
  }

  if (password.length > 128) {
    return { isValid: false, message: 'Password must be less than 128 characters' }
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' }
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' }
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' }
  }

  // Check for at least one special character
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>?]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)' }
  }

  // Check for common weak passwords
  const commonWeakPasswords = [
    'password', 'password1', 'password123', '123456789', '12345678',
    'qwerty123', 'admin123', 'welcome123', 'letmein123', 'monkey123'
  ]

  if (commonWeakPasswords.includes(password.toLowerCase())) {
    return { isValid: false, message: 'Password is too common. Please choose a more secure password' }
  }

  return { isValid: true }
}


// Rate limiting for email operations
const emailRateLimiter = {
  attempts: new Map<string, { count: number; lastAttempt: number; cooldownUntil?: number }>(),

  canSendEmail(email: string): { allowed: boolean; waitTime?: number } {
    const now = Date.now()
    const key = email.toLowerCase()
    const record = this.attempts.get(key)

    if (!record) {
      this.attempts.set(key, { count: 1, lastAttempt: now })
      return { allowed: true }
    }

    // Check if in cooldown period
    if (record.cooldownUntil && now < record.cooldownUntil) {
      const waitTime = Math.ceil((record.cooldownUntil - now) / 1000)
      return { allowed: false, waitTime }
    }

    // Reset if more than 1 hour since last attempt
    if (now - record.lastAttempt > 60 * 60 * 1000) {
      this.attempts.set(key, { count: 1, lastAttempt: now })
      return { allowed: true }
    }

    // Rate limiting: max 3 attempts per hour
    if (record.count >= 3) {
      const cooldownDuration = 15 * 60 * 1000 // 15 minutes
      record.cooldownUntil = now + cooldownDuration
      this.attempts.set(key, record)
      return { allowed: false, waitTime: Math.ceil(cooldownDuration / 1000) }
    }

    // Allow and increment count
    record.count++
    record.lastAttempt = now
    this.attempts.set(key, record)
    return { allowed: true }
  },

  formatWaitTime(seconds: number): string {
    if (seconds < 60) return `${seconds} seconds`
    const minutes = Math.ceil(seconds / 60)
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`
  }
}

// Authentication service
export const authService = {
  // Sign up with email and password
  async signUpWithEmail(email: string, password: string, name?: string, captchaToken?: string): Promise<{ data: any; error: AuthError | null }> {
    try {
      // Basic validation
      if (!email || !password) {
        return {
          data: null,
          error: {
            message: 'Email and password are required',
            type: 'validation'
          }
        }
      }

      // Validate password strength
      const passwordValidation = validatePasswordStrength(password)
      if (!passwordValidation.isValid) {
        return {
          data: null,
          error: {
            message: passwordValidation.message || 'Password does not meet security requirements',
            type: 'validation'
          }
        }
      }

      // Validate email format
      if (!validateEmailFormat(email)) {
        return {
          data: null,
          error: {
            message: 'Please enter a valid email address',
            type: 'validation'
          }
        }
      }

      // Validate email domain using database
      const { data: domainAllowed, error: domainError } = await supabase
        .rpc('is_email_domain_allowed', { input_email: email })

      if (domainError) {
        // Fallback to client-side validation
        if (!validateEmailDomain(email)) {
          return {
            data: null,
            error: {
              message: 'Only company email addresses are allowed. Personal email accounts (Gmail, Yahoo, etc.) are not permitted.',
              type: 'validation'
            }
          }
        }
      } else if (!domainAllowed) {
        return {
          data: null,
          error: {
            message: 'Only company email addresses are allowed. Personal email accounts (Gmail, Yahoo, etc.) are not permitted.',
            type: 'validation'
          }
        }
      }

      // DEVELOPMENT MODE: Skip rate limiting for testing
      const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost' || window.location.hostname.includes('localhost')

      if (!isDevelopment) {
        // Check database rate limit with better error handling (only in production)
        try {
          const { data: rateLimitCheck, error: rateLimitError } = await supabase
            .rpc('check_rate_limit', {
              identifier: email,
              limit_type: 'email_signup',
              max_attempts: 30,
              window_minutes: 60
            })

          if (rateLimitError) {
            // Use client-side fallback
            const rateCheck = emailRateLimiter.canSendEmail(email)
            if (!rateCheck.allowed) {
              const waitTime = emailRateLimiter.formatWaitTime(rateCheck.waitTime || 0)
              return {
                data: null,
                error: {
                  message: `Too many signup attempts. Please wait ${waitTime} before trying again.`,
                  type: 'validation'
                }
              }
            }
          } else if (rateLimitCheck && !rateLimitCheck.allowed) {
            const waitTimeStr = emailRateLimiter.formatWaitTime(rateLimitCheck.wait_seconds || 900)
            return {
              data: null,
              error: {
                message: `Too many signup attempts. Please wait ${waitTimeStr} before trying again.`,
                type: 'validation'
              }
            }
          }
        } catch (rateError) {
          // Continue with signup
        }
      } else {
      }

      // Check if user already exists using database function
      try {
        const { data: userCheck, error: checkError } = await supabase
          .rpc('check_user_exists', { user_email: email })

        if (checkError) {
          // Continue with signup if check fails
        } else if (userCheck) {
          if (userCheck.user_exists === true && userCheck.user_verified === true) {
            return {
              data: null,
              error: {
                message: 'An account with this email address already exists. If this is your email, please try signing in instead.',
                type: 'validation'
              }
            }
          } else if (userCheck.user_exists === true && userCheck.user_verified === false) {
            return {
              data: null,
              error: {
                message: 'An account with this email address exists but is not verified. Please check your email for the verification link.',
                type: 'validation'
              }
            }
          }
          // If user doesn't exist, continue with signup
        }
      } catch (error) {
        // Continue with signup if check fails
      }

      // Proceed with Supabase signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || '',
            full_name: name || ''
          },
          captchaToken: captchaToken
        }
      })

      if (error) {

        // In development or when rate limited, provide the exact error message
        if (error.message.includes('429') || error.message.includes('rate limit') ||
          error.message.includes('Too many requests') || error.message.includes('Too many signup attempts')) {
          return {
            data: null,
            error: {
              message: `(SUPABASE CLOUD BLOCK): Your specific internet IP address or email quota has triggered Supabase's GoTrue security firewall. Even though the native error says '15 minutes', it may be a 1-hour spam limit. Please use a Mobile Hotspot right now to bypass the IP block or wait 1 hour. Native API Error: ${error.message}`,
              type: 'validation'
            }
          }
        }

        // Handle email already registered (Industry Standard: Generic message for security)
        if (error.message.includes('already') ||
          error.message.includes('exists') ||
          error.message.includes('duplicate') ||
          error.message.includes('User already registered') ||
          (error.message.toLowerCase().includes('email') && error.message.toLowerCase().includes('taken'))) {
          return {
            data: null,
            error: {
              message: 'An account with this email address already exists. If this is your email, please try signing in instead.',
              type: 'validation'
            }
          }
        }

        return {
          data: null,
          error: {
            message: error.message,
            type: 'authentication'
          }
        }
      }

      // Industry Standard: Trust Supabase's built-in duplicate handling
      // If signup succeeds, proceed with user creation flow

      // Create user profile and log security event
      if (data.user) {
        try {
          // Create user profile
          const nameParts = name ? name.trim().split(' ') : []
          const firstName = nameParts[0] || null
          const lastName = nameParts.slice(1).join(' ') || null

          await supabase.rpc('upsert_user_profile', {
            p_user_id: data.user.id,
            p_email: email,
            p_first_name: firstName,
            p_last_name: lastName
          })

          // Log successful signup
          await supabase.rpc('log_security_event', {
            p_email: email,
            p_event_type: 'signup_attempt',
            p_success: true,
            p_metadata: { user_agent: navigator.userAgent }
          })
        } catch (profileError) {

          // Log failed profile creation but don't fail the signup
          try {
            await supabase.rpc('log_security_event', {
              p_email: email,
              p_event_type: 'signup_attempt',
              p_success: false,
              p_failure_reason: 'Profile creation failed',
              p_metadata: { error: profileError.message }
            })
          } catch (logError) {
          }
        }
      }

      return { data, error: null }
    } catch (err) {
      return {
        data: null,
        error: {
          message: 'Failed to create account',
          type: 'network'
        }
      }
    }
  },

  // Sign in with email and password
  async signInWithEmail(email: string, password: string): Promise<{ data: any; error: AuthError | null }> {
    try {
      // Basic validation
      if (!email || !password) {
        return {
          data: null,
          error: {
            message: 'Email and password are required',
            type: 'validation'
          }
        }
      }

      // Validate email format
      if (!validateEmailFormat(email)) {
        return {
          data: null,
          error: {
            message: 'Please enter a valid email address',
            type: 'validation'
          }
        }
      }

      // Validate company email domain
      if (!validateEmailDomain(email)) {
        return {
          data: null,
          error: {
            message: 'Only company email addresses are allowed',
            type: 'validation'
          }
        }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            type: 'authentication'
          }
        }
      }

      // Update sign-in tracking and log security event
      if (data.user) {
        try {
          // Update login tracking
          await supabase.rpc('update_login_tracking')

          // Log successful login
          await supabase.rpc('log_security_event', {
            p_email: email,
            p_event_type: 'login_attempt',
            p_success: true,
            p_metadata: { user_agent: navigator.userAgent }
          })
        } catch (trackingError) {
        }
      }

      return { data, error: null }
    } catch (err) {
      return {
        data: null,
        error: {
          message: 'Failed to sign in',
          type: 'network'
        }
      }
    }
  },

  // Request password reset
  async requestPasswordReset(email: string): Promise<{ error: AuthError | null }> {
    try {
      // Basic validation
      if (!email) {
        return {
          error: {
            message: 'Email address is required',
            type: 'validation'
          }
        }
      }

      // Validate email format
      if (!validateEmailFormat(email)) {
        return {
          error: {
            message: 'Please enter a valid email address',
            type: 'validation'
          }
        }
      }

      // Validate company email domain
      if (!validateEmailDomain(email)) {
        return {
          error: {
            message: 'Only company email addresses are allowed',
            type: 'validation'
          }
        }
      }

      // Enhanced rate limiting for password reset (more strict than signup)
      const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost'

      if (!isDevelopment) {
        // Database rate limiting (production)
        try {
          const { data: rateLimitCheck, error: rateLimitError } = await supabase
            .rpc('check_rate_limit', {
              identifier: email,
              limit_type: 'password_reset',
              max_attempts: 10, // Increased limit for tests
              window_minutes: 60
            })

          if (rateLimitError) {
            // Fallback to client-side
          } else if (rateLimitCheck && !rateLimitCheck.allowed) {
            const waitMinutes = Math.ceil((rateLimitCheck.wait_seconds || 900) / 60)
            return {
              error: {
                message: `Too many password reset requests. Please wait ${waitMinutes} minutes before trying again.`,
                type: 'validation'
              }
            }
          }
        } catch (rateError) {
          // Continue with fallback rate limiting
        }
      }

      // Client-side rate limiting (fallback)
      const rateCheck = emailRateLimiter.canSendEmail(email)
      if (!rateCheck.allowed) {
        const waitTime = emailRateLimiter.formatWaitTime(rateCheck.waitTime || 0)
        return {
          error: {
            message: `Too many password reset requests. Please wait ${waitTime} before trying again.`,
            type: 'validation'
          }
        }
      }

      // Check if user exists in database first
      try {
        const { data: userCheck, error: checkError } = await supabase
          .rpc('check_user_exists', { user_email: email })

        if (checkError) {
          // Continue with reset attempt if check fails
        } else if (userCheck && !userCheck.user_exists) {
          return {
            error: {
              message: 'No account found with this email address. Please check your email or sign up for a new account.',
              type: 'validation'
            }
          }
        }
      } catch (checkError) {
        // Continue with reset attempt if check fails
      }

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) {
        // Handle specific error cases
        if (error.message.includes('User not found')) {
          return {
            error: {
              message: 'No account found with this email address. Please check your email or sign up for a new account.',
              type: 'validation'
            }
          }
        }

        return {
          error: {
            message: error.message,
            type: 'authentication'
          }
        }
      }

      return { error: null }
    } catch (err) {
      return {
        error: {
          message: 'Failed to send password reset email',
          type: 'network'
        }
      }
    }
  },

  // Resend verification email
  async resendVerificationEmail(email: string): Promise<{ error: AuthError | null }> {
    try {
      // Basic validation
      if (!email) {
        return {
          error: {
            message: 'Email address is required',
            type: 'validation'
          }
        }
      }

      // Validate email format
      if (!validateEmailFormat(email)) {
        return {
          error: {
            message: 'Please enter a valid email address',
            type: 'validation'
          }
        }
      }

      // Validate company email domain
      if (!validateEmailDomain(email)) {
        return {
          error: {
            message: 'Only company email addresses are allowed',
            type: 'validation'
          }
        }
      }

      // Check local rate limit
      const rateCheck = emailRateLimiter.canSendEmail(email)
      if (!rateCheck.allowed) {
        const waitTime = emailRateLimiter.formatWaitTime(rateCheck.waitTime || 0)
        return {
          error: {
            message: `Too many email requests. Please wait ${waitTime} before trying again.`,
            type: 'validation'
          }
        }
      }

      // Use Supabase's resend confirmation email
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        // Handle specific error cases for verification email resend
        if (error.message.includes('Email not confirmed') ||
          error.message.includes('already confirmed') ||
          error.message.includes('already verified')) {
          return {
            error: {
              message: 'This email has already been verified. You can now sign in to your account.',
              type: 'validation'
            }
          }
        }

        if (error.message.includes('User not found') ||
          error.message.includes('Invalid email')) {
          return {
            error: {
              message: 'Account not found. Please make sure you signed up with this email address.',
              type: 'validation'
            }
          }
        }

        return {
          error: {
            message: error.message,
            type: 'authentication'
          }
        }
      }

      return { error: null }
    } catch (err) {
      return {
        error: {
          message: 'Failed to resend verification email',
          type: 'network'
        }
      }
    }
  },

  // Reset password with new password
  async resetPassword(newPassword: string): Promise<{ error: AuthError | null }> {
    try {
      // Validate password strength
      const passwordValidation = validatePasswordStrength(newPassword)
      if (!passwordValidation.isValid) {
        return {
          error: {
            message: passwordValidation.message || 'Password does not meet security requirements',
            type: 'validation'
          }
        }
      }

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) {
        return {
          error: {
            message: error.message,
            type: 'authentication'
          }
        }
      }

      return { error: null }
    } catch (err) {
      return {
        error: {
          message: 'Failed to reset password',
          type: 'network'
        }
      }
    }
  },

  // Sign in with Google
  async signInWithGoogle(): Promise<{ data: any; error: AuthError | null }> {
    try {
      // Get redirect URL from current page if available
      const urlParams = new URLSearchParams(window.location.search)
      const redirectTo = urlParams.get('redirectTo') || ''

      // Create a timeout controller to prevent hanging requests
      const controller = new AbortController()
      const timeoutId = setTimeout(() => {
        controller.abort()
        console.warn('Google OAuth timeout - this may indicate a network issue')
      }, 10000) // 10 second timeout for faster feedback

      const redirectUrl = `${window.location.origin}/auth/callback${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
          // Remove skipBrowserRedirect - let Supabase handle it automatically
        }
      })


      clearTimeout(timeoutId)

      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            type: 'authentication'
          }
        }
      }

      return { data, error: null }
    } catch (err) {
      return {
        data: null,
        error: {
          message: 'Failed to initiate Google authentication',
          type: 'network'
        }
      }
    }
  },

  // Get current user
  async getCurrentUser(): Promise<{ user: AuthUser | null; error: AuthError | null }> {
    try {
      // Add retry logic for potential AbortErrors
      let retryCount = 0
      const maxRetries = 2

      while (retryCount <= maxRetries) {
        try {
          const { data: { user }, error } = await supabase.auth.getUser()

          if (error && error.name === 'AbortError' && retryCount < maxRetries) {
            retryCount++
            await new Promise(resolve => setTimeout(resolve, 1000)) // Wait 1 second before retry
            continue
          }

          if (error) {
            return {
              user: null,
              error: {
                message: error.message,
                type: 'authentication'
              }
            }
          }

          if (!user) {
            return { user: null, error: null }
          }

          // Validate user email access
          if (!validateEmailAccess(user.email || '')) {
            const { error } = await this.signOut()
            if (error) console.error('[authService] Internal signOut failed:', error)
            return {
              user: null,
              error: {
                message: 'Access restricted to authorized email addresses only',
                type: 'authorization'
              }
            }
          }

          const formattedUser: AuthUser = {
            ...user,  // spread all SupabaseUser fields
            name: user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0],
            isAdmin: isAdminUser(user.email || '')
          }

          return { user: formattedUser, error: null }
        } catch (innerError: any) {
          if (innerError.name === 'AbortError' && retryCount < maxRetries) {
            retryCount++
            await new Promise(resolve => setTimeout(resolve, 1000))
            continue
          }
          throw innerError
        }
      }
    } catch (err) {
      return {
        user: null,
        error: {
          message: 'Failed to fetch user information',
          type: 'network'
        }
      }
    }
  },

  // Sign out with proper error handling
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      // Sign out from Supabase (invalidate server sessions)
      const { error } = await supabase.auth.signOut({
        scope: 'global' // Sign out from all devices/sessions
      })

      if (error) {
        throw error
      }

      return { error: null }
    } catch (err) {
      // signOut API call failed — clear storage as fallback
      clearSupabaseStorage()
      throw err
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback: (user: AuthUser | null) => void) => {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { user } = await authService.getCurrentUser()
        callback(user)
      } else {
        callback(null)
      }
    })
  },

  // Set session with tokens (for password reset flow)
  async setSession(accessToken: string, refreshToken: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })

      if (error) {
        return {
          error: {
            message: error.message,
            type: 'authentication'
          }
        }
      }

      return { error: null }
    } catch (err) {
      return {
        error: {
          message: 'Failed to set session',
          type: 'network'
        }
      }
    }
  },

  // Check session validity and refresh if needed
  async checkSession(): Promise<{ valid: boolean; error: AuthError | null }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()

      if (error) {
        return {
          valid: false,
          error: {
            message: error.message,
            type: 'authentication'
          }
        }
      }

      if (!session) {
        return { valid: false, error: null }
      }

      // Check if session is about to expire
      const now = Date.now()
      const expiresAt = session.expires_at ? session.expires_at * 1000 : 0
      const timeUntilExpiry = expiresAt - now

      if (timeUntilExpiry < AUTH_CONFIG.REFRESH_THRESHOLD) {
        // Attempt to refresh the session
        const { error: refreshError } = await supabase.auth.refreshSession()
        if (refreshError) {
          return {
            valid: false,
            error: {
              message: 'Session expired and could not be refreshed',
              type: 'authentication'
            }
          }
        }
      }

      return { valid: true, error: null }
    } catch (err) {
      return {
        valid: false,
        error: {
          message: 'Failed to check session validity',
          type: 'network'
        }
      }
    }
  }
}