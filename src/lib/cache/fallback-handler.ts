/**
 * Cache Fallback & Resilience Handler
 * Implements advanced fallback strategies for cache failures
 * 
 * Features:
 * - Multi-tier fallback strategies
 * - Circuit breaker pattern
 * - Graceful degradation
 * - Background cache recovery
 * - Request hedging for critical operations
 */

import { redis, CACHE_KEYS, CACHE_TTL } from './redis-client'
import { cacheMonitor } from './monitoring'
import { redisHealthCoordinator } from './health-coordinator'
import { LRUCache } from 'lru-cache'

interface FallbackConfig {
  enableLocalBackup: boolean
  enablePersistence: boolean
  maxRetries: number
  retryDelay: number
  hedgingThreshold: number // ms before hedging
  degradedModeThreshold: number // error rate % to enter degraded mode
}

interface CacheOperation<T = any> {
  key: string
  operation: 'get' | 'set' | 'del' | 'mget' | 'mset'
  value?: T
  ttl?: number
  fallbackFn?: () => Promise<T>
  priority: 'low' | 'medium' | 'high' | 'critical'
}

interface BackupEntry<T = any> {
  value: T
  timestamp: number
  ttl: number
  key: string
}

enum ServiceState {
  NORMAL = 'normal',
  DEGRADED = 'degraded', 
  CRITICAL = 'critical',
  RECOVERY = 'recovery'
}

class CacheFallbackHandler {
  private config: FallbackConfig
  private localBackup: LRUCache<string, BackupEntry>
  private persistence: Map<string, BackupEntry> = new Map()
  private serviceState: ServiceState = ServiceState.NORMAL
  private retryQueue: Map<string, CacheOperation> = new Map()
  private hedgingOperations: Set<string> = new Set()
  private errorCount = 0
  private lastErrorTime?: Date
  private recoveryTimer?: NodeJS.Timeout

  constructor(config: Partial<FallbackConfig> = {}) {
    this.config = {
      enableLocalBackup: true,
      enablePersistence: true,
      maxRetries: 3,
      retryDelay: 1000,
      hedgingThreshold: 100, // 100ms
      degradedModeThreshold: 20, // 20% error rate
      ...config
    }

    // Initialize local backup cache
    this.localBackup = new LRUCache({
      max: 1000,
      maxSize: 10 * 1024 * 1024, // 10MB
      sizeCalculation: (entry: BackupEntry) => JSON.stringify(entry).length,
      ttl: 1000 * 60 * 30, // 30 minutes
      allowStale: true,
      updateAgeOnGet: true
    })

    this.startHealthMonitoring()
    this.loadPersistedCache()

  }

  /**
   * Execute cache operation with fallback strategies
   */
  async execute<T>(operation: CacheOperation<T>): Promise<T | null> {
    const startTime = Date.now()
    
    try {
      // Record operation start
      cacheMonitor.recordMetric({
        timestamp: new Date().toISOString(),
        operation: operation.operation,
        latency: 0,
        success: false
      })

      // Check if we should hedge this operation
      const shouldHedge = operation.priority === 'critical' && 
                         this.serviceState !== ServiceState.NORMAL

      if (shouldHedge) {
        return await this.executeWithHedging(operation, startTime)
      }

      // Normal execution with fallback
      return await this.executeWithFallback(operation, startTime)

    } catch (error) {
      
      // Record failure
      this.recordError()
      
      cacheMonitor.recordMetric({
        timestamp: new Date().toISOString(),
        operation: operation.operation,
        latency: Date.now() - startTime,
        success: false,
        errorType: error instanceof Error ? error.message : 'unknown'
      })

      // Return fallback value if available
      return await this.getFallbackValue(operation)
    }
  }

  /**
   * Execute operation with hedging for critical requests
   */
  private async executeWithHedging<T>(
    operation: CacheOperation<T>, 
    startTime: number
  ): Promise<T | null> {
    const hedgingId = `${operation.key}:${Date.now()}`
    this.hedgingOperations.add(hedgingId)

    try {
      // Start primary operation
      const primaryPromise = this.executeOperation(operation)
      
      // Start hedged operation after threshold
      const hedgedPromise = new Promise<T | null>((resolve) => {
        setTimeout(async () => {
          if (this.hedgingOperations.has(hedgingId)) {
            try {
              const hedgedResult = await this.getFallbackValue(operation)
              resolve(hedgedResult)
            } catch (error) {
              resolve(null)
            }
          }
        }, this.config.hedgingThreshold)
      })

      // Race primary and hedged operations
      const result = await Promise.race([primaryPromise, hedgedPromise])
      
      // Clean up hedging tracking
      this.hedgingOperations.delete(hedgingId)
      
      // Record successful operation
      cacheMonitor.recordMetric({
        timestamp: new Date().toISOString(),
        operation: operation.operation,
        latency: Date.now() - startTime,
        success: true,
        cacheHit: result !== null
      })

      return result

    } catch (error) {
      this.hedgingOperations.delete(hedgingId)
      throw error
    }
  }

  /**
   * Execute operation with standard fallback
   */
  private async executeWithFallback<T>(
    operation: CacheOperation<T>,
    startTime: number
  ): Promise<T | null> {
    let lastError: Error | null = null
    
    // Try operation with retries
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        const result = await this.executeOperation(operation)
        
        // Success - record metric and backup if needed
        if (result !== null && this.config.enableLocalBackup) {
          await this.backupToLocal(operation.key, result, operation.ttl)
        }

        cacheMonitor.recordMetric({
          timestamp: new Date().toISOString(),
          operation: operation.operation,
          latency: Date.now() - startTime,
          success: true,
          cacheHit: result !== null
        })

        // Reset error tracking on success
        this.resetErrorTracking()

        return result

      } catch (error) {
        lastError = error as Error
        
        if (attempt < this.config.maxRetries) {
          // Exponential backoff
          const delay = this.config.retryDelay * Math.pow(2, attempt - 1)
          await this.sleep(delay)
        }
      }
    }

    // All retries failed
    this.recordError()
    throw lastError || new Error('Cache operation failed after retries')
  }

  /**
   * Execute the actual cache operation
   */
  private async executeOperation<T>(operation: CacheOperation<T>): Promise<T | null> {
    switch (operation.operation) {
      case 'get':
        return await redis.get<T>(operation.key)
      
      case 'set':
        if (operation.value !== undefined) {
          const success = await redis.set(operation.key, operation.value, { 
            ttl: operation.ttl 
          })
          return success ? operation.value : null
        }
        return null
      
      case 'del':
        const deleted = await redis.del(operation.key)
        return deleted ? true as any : null
      
      default:
        throw new Error(`Unsupported operation: ${operation.operation}`)
    }
  }

  /**
   * Get fallback value from local cache or function
   */
  private async getFallbackValue<T>(operation: CacheOperation<T>): Promise<T | null> {
    // Try local backup first
    if (this.config.enableLocalBackup) {
      const backup = this.localBackup.get(operation.key)
      if (backup && this.isBackupValid(backup)) {
        return backup.value as T
      }
    }

    // Try persistence
    if (this.config.enablePersistence) {
      const persisted = this.persistence.get(operation.key)
      if (persisted && this.isBackupValid(persisted)) {
        return persisted.value as T
      }
    }

    // Try fallback function
    if (operation.fallbackFn) {
      try {
        const fallbackResult = await operation.fallbackFn()
        
        // Cache fallback result for future use
        if (fallbackResult !== null) {
          await this.backupToLocal(operation.key, fallbackResult, operation.ttl)
        }
        
        return fallbackResult
      } catch (error) {
      }
    }

    return null
  }

  /**
   * Backup value to local cache
   */
  private async backupToLocal<T>(key: string, value: T, ttl?: number): Promise<void> {
    try {
      const entry: BackupEntry<T> = {
        value,
        timestamp: Date.now(),
        ttl: ttl || CACHE_TTL.MEDIUM,
        key
      }

      this.localBackup.set(key, entry)

      // Also persist critical entries
      if (this.config.enablePersistence) {
        this.persistence.set(key, entry)
      }

    } catch (error) {
    }
  }

  /**
   * Check if backup entry is still valid
   */
  private isBackupValid(entry: BackupEntry): boolean {
    if (entry.ttl === -1) return true // No expiration
    
    const ageMs = Date.now() - entry.timestamp
    const ttlMs = entry.ttl * 1000
    
    return ageMs < ttlMs
  }

  /**
   * Record error and potentially change service state
   */
  private recordError(): void {
    this.errorCount++
    this.lastErrorTime = new Date()

    // Calculate error rate over last 5 minutes
    const recentErrors = this.calculateRecentErrorRate()
    
    if (recentErrors > this.config.degradedModeThreshold) {
      if (this.serviceState === ServiceState.NORMAL) {
        this.enterDegradedMode()
      } else if (recentErrors > this.config.degradedModeThreshold * 2) {
        this.enterCriticalMode()
      }
    }
  }

  /**
   * Reset error tracking after successful operations
   */
  private resetErrorTracking(): void {
    if (this.serviceState !== ServiceState.NORMAL) {
      this.enterRecoveryMode()
    }
  }

  /**
   * Calculate recent error rate
   */
  private calculateRecentErrorRate(): number {
    // This would integrate with actual metrics collection
    // For now, use simple heuristic
    if (!this.lastErrorTime) return 0
    
    const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)
    const isRecent = this.lastErrorTime.getTime() > fiveMinutesAgo
    
    return isRecent ? Math.min(this.errorCount * 5, 100) : 0
  }

  /**
   * Enter degraded mode - prioritize critical operations
   */
  private enterDegradedMode(): void {
    this.serviceState = ServiceState.DEGRADED
    
    // Could implement additional logic like:
    // - Reduce cache TTLs
    // - Prioritize critical operations
    // - Increase local backup usage
  }

  /**
   * Enter critical mode - maximum fallback strategies
   */
  private enterCriticalMode(): void {
    this.serviceState = ServiceState.CRITICAL
    
    // Implement critical mode logic:
    // - Force local cache usage
    // - Disable non-critical operations
    // - Alert operations team
  }

  /**
   * Enter recovery mode - gradually restore normal operation
   */
  private enterRecoveryMode(): void {
    if (this.serviceState === ServiceState.NORMAL) return
    
    this.serviceState = ServiceState.RECOVERY
    
    // Start recovery timer
    this.recoveryTimer = setTimeout(() => {
      this.serviceState = ServiceState.NORMAL
      this.errorCount = 0
    }, 60000) // 1 minute recovery period
  }

  /**
   * Start health monitoring using shared coordinator
   */
  private startHealthMonitoring(): void {
    // Subscribe to shared health coordinator instead of independent polling
    redisHealthCoordinator.subscribe((isHealthy: boolean) => {
      try {
        if (!isHealthy && this.serviceState === ServiceState.NORMAL) {
          this.enterDegradedMode()
        } else if (isHealthy && this.serviceState === ServiceState.DEGRADED) {
          this.enterRecoveryMode()
        }
      } catch (error) {
      }
    })
    
  }

  /**
   * Load persisted cache from storage
   */
  private loadPersistedCache(): void {
    try {
      // In production, load from file system or database
      // For now, just initialize empty
    } catch (error) {
    }
  }

  /**
   * Save cache to persistence
   */
  async saveToPersistence(): Promise<void> {
    try {
      // In production, save to file system or database
      const data = Array.from(this.persistence.entries())
    } catch (error) {
    }
  }

  /**
   * Utility sleep function
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Get fallback handler status
   */
  getStatus() {
    return {
      serviceState: this.serviceState,
      errorCount: this.errorCount,
      lastErrorTime: this.lastErrorTime,
      localBackup: {
        size: this.localBackup.size,
        maxSize: this.localBackup.maxSize
      },
      persistence: {
        size: this.persistence.size
      },
      hedging: {
        activeOperations: this.hedgingOperations.size
      },
      config: this.config
    }
  }

  /**
   * Graceful shutdown
   */
  async shutdown(): Promise<void> {
    if (this.recoveryTimer) {
      clearTimeout(this.recoveryTimer)
    }

    // Save current cache to persistence
    await this.saveToPersistence()
    
  }
}

// Export singleton instance
export const fallbackHandler = new CacheFallbackHandler()

// Export types and enums
export { ServiceState }
export type { FallbackConfig, CacheOperation, BackupEntry }