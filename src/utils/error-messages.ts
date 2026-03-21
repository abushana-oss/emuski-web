/**
 * User-friendly error messages and handling utilities
 * Industry standard error communication patterns
 */

export interface UserError {
  title: string
  message: string
  action?: string
  type: 'error' | 'warning' | 'info'
  retry?: boolean
  contactSupport?: boolean
}

// Map of technical errors to user-friendly messages
export const errorMappings: Record<string, UserError> = {
  // Network and connectivity errors
  'NetworkError': {
    title: 'Connection Problem',
    message: 'Unable to connect to our servers. Please check your internet connection and try again.',
    action: 'Check your connection and retry',
    type: 'error',
    retry: true,
  },
  
  'TypeError: Failed to fetch': {
    title: 'Connection Issue',
    message: 'Network request failed. This could be due to poor connectivity or our servers being temporarily unavailable.',
    action: 'Try again in a moment',
    type: 'error',
    retry: true,
  },

  // Authentication errors
  'Authentication failed': {
    title: 'Login Required',
    message: 'Your session has expired. Please log in again to continue.',
    action: 'Sign in to your account',
    type: 'warning',
    retry: false,
  },

  'Invalid JWT token': {
    title: 'Session Expired',
    message: 'Your login session has expired for security reasons. Please sign in again.',
    action: 'Sign in again',
    type: 'warning',
    retry: false,
  },

  // File upload errors
  'File too large': {
    title: 'File Too Large',
    message: 'The selected file exceeds our 50MB limit. Please choose a smaller file or compress your model.',
    action: 'Select a smaller file',
    type: 'error',
    retry: false,
  },

  'Unsupported file type': {
    title: 'File Type Not Supported',
    message: 'We currently support STEP, STL, and OBJ files. Please convert your file to one of these formats.',
    action: 'Convert file to STEP, STL, or OBJ',
    type: 'error',
    retry: false,
  },

  'Upload failed': {
    title: 'Upload Failed',
    message: 'Unable to upload your file. This could be due to a temporary server issue or file corruption.',
    action: 'Try uploading again',
    type: 'error',
    retry: true,
  },

  // Service availability
  'Service temporarily unavailable': {
    title: 'Service Unavailable',
    message: 'Our analysis service is temporarily unavailable. We\'re working to restore it quickly.',
    action: 'Try again in a few minutes',
    type: 'warning',
    retry: true,
  },

  'Database connection error': {
    title: 'Service Issue',
    message: 'We\'re experiencing technical difficulties. Our team has been notified and is working on a fix.',
    action: 'Please try again later',
    type: 'error',
    retry: true,
    contactSupport: true,
  },

  // Rate limiting
  'Too many requests': {
    title: 'Slow Down',
    message: 'You\'re making requests too quickly. Please wait a moment before trying again.',
    action: 'Wait 30 seconds and retry',
    type: 'warning',
    retry: true,
  },

  'Rate limit exceeded': {
    title: 'Request Limit Reached',
    message: 'You\'ve reached your request limit. Please wait before making more requests.',
    action: 'Try again in an hour',
    type: 'warning',
    retry: false,
  },

  // Credit system
  'Insufficient credits': {
    title: 'Out of Credits',
    message: 'You\'ve used all your daily analysis credits. They\'ll reset at midnight UTC, or you can upgrade for more.',
    action: 'Wait for reset or upgrade',
    type: 'info',
    retry: false,
  },

  // General server errors
  'Internal server error': {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred on our servers. Our team has been automatically notified.',
    action: 'Try again in a few minutes',
    type: 'error',
    retry: true,
    contactSupport: true,
  },

  'Request timeout': {
    title: 'Request Timed Out',
    message: 'The operation took longer than expected. This often happens with large files or during high traffic.',
    action: 'Try with a smaller file or retry',
    type: 'error',
    retry: true,
  },

  // CAD analysis specific
  'Analysis failed': {
    title: 'Analysis Failed',
    message: 'Unable to analyze your CAD file. The file might be corrupted or contain unsupported geometry.',
    action: 'Try a different file or export format',
    type: 'error',
    retry: false,
  },

  'Invalid CAD file': {
    title: 'Invalid CAD File',
    message: 'The uploaded file doesn\'t appear to be a valid CAD model or is corrupted.',
    action: 'Check your file and re-export',
    type: 'error',
    retry: false,
  },

  // Browser/client errors
  'Script error': {
    title: 'Browser Issue',
    message: 'A browser error occurred. This is often caused by extensions or outdated browsers.',
    action: 'Try refreshing or use a different browser',
    type: 'warning',
    retry: true,
  },

  'Memory allocation failed': {
    title: 'Browser Memory Issue',
    message: 'Your browser ran out of memory. Try closing other tabs or use a smaller file.',
    action: 'Close tabs and retry',
    type: 'error',
    retry: true,
  },
}

/**
 * Convert technical error to user-friendly message
 */
export function getUserFriendlyError(error: unknown): UserError {
  // Handle different error types
  let errorMessage = ''
  let errorName = ''

  if (error instanceof Error) {
    errorMessage = error.message
    errorName = error.name
  } else if (typeof error === 'string') {
    errorMessage = error
  } else if (error && typeof error === 'object' && 'message' in error) {
    errorMessage = String((error as any).message)
  } else {
    errorMessage = 'Unknown error occurred'
  }

  // Check for HTTP status code errors
  if (errorMessage.includes('401')) {
    return errorMappings['Authentication failed']
  }
  if (errorMessage.includes('403')) {
    return {
      title: 'Access Denied',
      message: 'You don\'t have permission to perform this action.',
      action: 'Contact support if you believe this is wrong',
      type: 'error',
      retry: false,
      contactSupport: true,
    }
  }
  if (errorMessage.includes('404')) {
    return {
      title: 'Not Found',
      message: 'The requested resource could not be found.',
      action: 'Check the URL or go back',
      type: 'error',
      retry: false,
    }
  }
  if (errorMessage.includes('500') || errorMessage.includes('502') || errorMessage.includes('503')) {
    return errorMappings['Service temporarily unavailable']
  }

  // Look for exact matches first
  for (const [key, userError] of Object.entries(errorMappings)) {
    if (errorMessage.includes(key) || errorName === key) {
      return userError
    }
  }

  // Check for partial matches
  if (errorMessage.toLowerCase().includes('network')) {
    return errorMappings['NetworkError']
  }
  if (errorMessage.toLowerCase().includes('timeout')) {
    return errorMappings['Request timeout']
  }
  if (errorMessage.toLowerCase().includes('file') && errorMessage.toLowerCase().includes('large')) {
    return errorMappings['File too large']
  }
  if (errorMessage.toLowerCase().includes('authentication') || errorMessage.toLowerCase().includes('unauthorized')) {
    return errorMappings['Authentication failed']
  }
  if (errorMessage.toLowerCase().includes('rate limit') || errorMessage.toLowerCase().includes('too many')) {
    return errorMappings['Too many requests']
  }

  // Fallback to generic error
  return {
    title: 'Unexpected Error',
    message: 'Something unexpected happened. Our team has been notified and is looking into it.',
    action: 'Try again or contact support',
    type: 'error',
    retry: true,
    contactSupport: true,
  }
}

/**
 * Get contextual help message based on the current page/action
 */
export function getContextualHelp(context: string): string {
  const helpMessages: Record<string, string> = {
    upload: 'Supported formats: STEP (.step, .stp), STL (.stl), OBJ (.obj). Maximum file size: 50MB.',
    analysis: 'DFM analysis typically takes 30-60 seconds depending on model complexity.',
    login: 'Use your company email address. Only authorized domains are allowed.',
    credits: 'Daily credits reset at midnight UTC. Upgrade for unlimited analysis.',
    contact: 'Include details about what you were trying to do when the error occurred.',
  }

  return helpMessages[context] || 'If this problem persists, please contact our support team.'
}

/**
 * Check if error should trigger automatic retry
 */
export function shouldAutoRetry(error: unknown): boolean {
  const userError = getUserFriendlyError(error)
  return userError.retry === true && userError.type !== 'error'
}

/**
 * Get retry delay based on error type
 */
export function getRetryDelay(error: unknown): number {
  const errorMessage = error instanceof Error ? error.message : String(error)
  
  if (errorMessage.toLowerCase().includes('rate limit')) {
    return 30000 // 30 seconds
  }
  if (errorMessage.toLowerCase().includes('timeout')) {
    return 5000 // 5 seconds
  }
  if (errorMessage.toLowerCase().includes('network')) {
    return 2000 // 2 seconds
  }
  
  return 1000 // 1 second default
}