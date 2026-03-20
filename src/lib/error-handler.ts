// Production-ready error handling with user-friendly messages
// Industry standard error management

export interface AppError {
  code: string;
  message: string;
  userMessage: string;
  statusCode: number;
  details?: any;
}

export class ErrorHandler {
  private static readonly ERROR_CODES = {
    // Authentication errors
    AUTH_REQUIRED: {
      userMessage: "Please sign in to continue",
      statusCode: 401
    },
    AUTH_EXPIRED: {
      userMessage: "Your session has expired. Please sign in again",
      statusCode: 401
    },
    
    // Credit errors  
    INSUFFICIENT_CREDITS: {
      userMessage: "Not enough credits for this request",
      statusCode: 402
    },
    CREDIT_SYSTEM_DOWN: {
      userMessage: "Credit system temporarily unavailable. Please try again",
      statusCode: 503
    },
    
    // Rate limiting
    RATE_LIMITED: {
      userMessage: "Too many requests. Please wait a moment and try again",
      statusCode: 429
    },
    
    // API errors
    AI_SERVICE_DOWN: {
      userMessage: "AI service is temporarily unavailable. Please try again",
      statusCode: 503
    },
    INVALID_FILE: {
      userMessage: "Invalid file format. Please upload STL, STEP, or IGES files",
      statusCode: 400
    },
    FILE_TOO_LARGE: {
      userMessage: "File too large. Maximum size is 50MB",
      statusCode: 413
    },
    
    // Generic errors
    NETWORK_ERROR: {
      userMessage: "Network connection issue. Please check your internet",
      statusCode: 500
    },
    SERVER_ERROR: {
      userMessage: "Something went wrong. Our team has been notified",
      statusCode: 500
    }
  };

  static handleAPIError(error: any, context: string): AppError {
    console.error(`[${context}] Error:`, error);
    
    // Map common error patterns to user-friendly messages
    if (error?.status === 401 || error?.message?.includes('unauthorized')) {
      return {
        code: 'AUTH_REQUIRED',
        message: error.message || 'Unauthorized',
        ...this.ERROR_CODES.AUTH_REQUIRED
      };
    }
    
    if (error?.status === 429 || error?.message?.includes('rate limit')) {
      return {
        code: 'RATE_LIMITED', 
        message: error.message || 'Rate limited',
        ...this.ERROR_CODES.RATE_LIMITED
      };
    }
    
    if (error?.status === 402 || error?.message?.includes('credits')) {
      return {
        code: 'INSUFFICIENT_CREDITS',
        message: error.message || 'Insufficient credits',
        ...this.ERROR_CODES.INSUFFICIENT_CREDITS
      };
    }
    
    if (error?.message?.includes('network') || error?.name === 'TypeError') {
      return {
        code: 'NETWORK_ERROR',
        message: error.message || 'Network error',
        ...this.ERROR_CODES.NETWORK_ERROR
      };
    }
    
    // Default server error
    return {
      code: 'SERVER_ERROR',
      message: error.message || 'Unknown error',
      ...this.ERROR_CODES.SERVER_ERROR,
      details: process.env.NODE_ENV === 'development' ? error : undefined
    };
  }
  
  static getRetryDelay(attempt: number): number {
    // Exponential backoff: 1s, 2s, 4s, 8s, max 10s
    return Math.min(1000 * Math.pow(2, attempt), 10000);
  }
  
  static shouldRetry(error: AppError, attempt: number): boolean {
    // Retry on server errors, not client errors
    return attempt < 3 && error.statusCode >= 500 && error.statusCode < 600;
  }
}