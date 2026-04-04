import { NextResponse } from 'next/server'
import { getServiceHealth } from '../service'

/**
 * Health check endpoint for monitoring AI service status
 * Returns circuit breaker state, rate limiting info, and overall health
 */
export async function GET() {
  try {
    const health = getServiceHealth()
    
    const status = health.isHealthy ? 200 : 503
    
    return NextResponse.json({
      status: health.isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      circuitBreaker: {
        state: health.circuitBreaker.state,
        failures: health.circuitBreaker.failures,
        lastFailureTime: health.circuitBreaker.lastFailureTime
          ? new Date(health.circuitBreaker.lastFailureTime).toISOString()
          : null
      },
      rateLimit: health.rateLimit,
      version: '1.0.0'
    }, { 
      status,
      headers: {
        'Cache-Control': 'no-cache',
        'X-Content-Type-Options': 'nosniff'
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}