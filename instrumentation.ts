/**
 * Next.js Instrumentation
 * Server-side initialization hooks for application startup
 * 
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */

/**
 * Server-side registration hook
 * Runs once when the server starts up
 */
export async function register() {
  // Only run in server environment
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    try {
      const { initializeCacheSystem } = await import('./src/lib/cache/index')
      await initializeCacheSystem()
    } catch (error) {
      console.error('Failed to initialize cache system:', error)
    }
  }
}