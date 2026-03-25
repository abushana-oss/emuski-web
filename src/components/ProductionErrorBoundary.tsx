/**
 * Production-specific Error Boundary
 * Handles connection errors and module loading failures
 */

'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ProductionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('Production Error Boundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo,
    })
    
    // Check if it's a connection/chunk loading error
    const isConnectionError = 
      error.message?.includes('Connection closed') ||
      error.message?.includes('Loading chunk') ||
      error.message?.includes('Loading CSS chunk') ||
      error.message?.includes('Loading module')
    
    if (isConnectionError && typeof window !== 'undefined') {
      // Try to recover from chunk loading errors
      console.warn('Attempting to recover from connection/chunk error...')
      
      // Delay reload to avoid infinite loops
      setTimeout(() => {
        if (window.location) {
          window.location.reload()
        }
      }, 1000)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  render() {
    if (this.state.hasError) {
      // Check if it's a connection error
      const isConnectionError = 
        this.state.error?.message?.includes('Connection closed') ||
        this.state.error?.message?.includes('Loading chunk') ||
        this.state.error?.message?.includes('Loading CSS chunk')
      
      if (this.props.fallback) {
        return this.props.fallback
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {isConnectionError ? 'Connection Issue' : 'Something went wrong'}
              </h2>
              <p className="text-gray-600 text-sm mb-6">
                {isConnectionError 
                  ? 'We\'re experiencing a temporary connection issue. The page will reload automatically.'
                  : 'An unexpected error occurred. Please try refreshing the page.'}
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-emuski-teal-darker text-white px-4 py-2 rounded-md hover:bg-emuski-teal-darker/90 transition-colors"
              >
                Reload Page
              </button>
              
              <button
                onClick={this.handleRetry}
                className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Try Again
              </button>
              
              <a
                href="/"
                className="block w-full bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Go to Homepage
              </a>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Hook to handle runtime errors in functional components
 */
export function useErrorHandler() {
  return (error: Error, errorInfo?: ErrorInfo) => {
    console.error('Runtime error:', error, errorInfo)
    
    // Check for connection/chunk loading errors
    const isConnectionError = 
      error.message?.includes('Connection closed') ||
      error.message?.includes('Loading chunk') ||
      error.message?.includes('Loading CSS chunk') ||
      error.message?.includes('Loading module')
    
    if (isConnectionError && typeof window !== 'undefined') {
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }
}