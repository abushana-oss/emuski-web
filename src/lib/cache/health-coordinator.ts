/**
 * Redis Health Coordinator
 * Single source of truth for Redis health monitoring.
 * Both CacheMonitor and FallbackHandler subscribe here
 * instead of running independent health check timers.
 */

type HealthCallback = (healthy: boolean) => void

export class RedisHealthCoordinator {
  private static instance: RedisHealthCoordinator
  private isHealthy = false
  private checkInterval: NodeJS.Timeout | null = null
  private subscribers: HealthCallback[] = []
  private pingFunction: (() => Promise<boolean>) | null = null

  static getInstance(): RedisHealthCoordinator {
    if (!this.instance) {
      this.instance = new RedisHealthCoordinator()
    }
    return this.instance
  }

  subscribe(callback: HealthCallback): () => void {
    this.subscribers.push(callback)
    // Immediately emit current state to new subscriber
    callback(this.isHealthy)

    // Return unsubscribe function
    return () => {
      const index = this.subscribers.indexOf(callback)
      if (index > -1) {
        this.subscribers.splice(index, 1)
      }
    }
  }

  startMonitoring(pingFn: () => Promise<boolean>, intervalMs = 30_000): void {
    if (this.checkInterval) {
      console.warn('[RedisHealthCoordinator] Already monitoring, stopping previous timer')
      this.stop()
    }

    this.pingFunction = pingFn
    
    // Perform initial health check
    this.performHealthCheck()

    // Start periodic health checks
    this.checkInterval = setInterval(() => {
      this.performHealthCheck()
    }, intervalMs)

    console.log(`[RedisHealthCoordinator] Started monitoring with ${intervalMs}ms interval`)
  }

  private async performHealthCheck(): Promise<void> {
    if (!this.pingFunction) return

    try {
      const wasHealthy = this.isHealthy
      this.isHealthy = await this.pingFunction()
      
      // Log state changes
      if (wasHealthy !== this.isHealthy) {
        console.log(`[RedisHealthCoordinator] Health changed: ${wasHealthy ? 'healthy' : 'unhealthy'} -> ${this.isHealthy ? 'healthy' : 'unhealthy'}`)
      }

      // Notify all subscribers
      this.subscribers.forEach((callback) => {
        try {
          callback(this.isHealthy)
        } catch (error) {
          console.error('[RedisHealthCoordinator] Subscriber callback error:', error)
        }
      })
    } catch (error) {
      const wasHealthy = this.isHealthy
      this.isHealthy = false
      
      if (wasHealthy) {
        console.error('[RedisHealthCoordinator] Health check failed:', error)
      }

      // Notify subscribers of failure
      this.subscribers.forEach((callback) => {
        try {
          callback(false)
        } catch (cbError) {
          console.error('[RedisHealthCoordinator] Subscriber callback error:', cbError)
        }
      })
    }
  }

  stop(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval)
      this.checkInterval = null
      console.log('[RedisHealthCoordinator] Stopped monitoring')
    }
  }

  getCurrentHealth(): boolean {
    return this.isHealthy
  }

  getSubscriberCount(): number {
    return this.subscribers.length
  }

  // Force a health check outside of the normal interval
  async forceHealthCheck(): Promise<boolean> {
    await this.performHealthCheck()
    return this.isHealthy
  }
}

// Export singleton instance
export const redisHealthCoordinator = RedisHealthCoordinator.getInstance()