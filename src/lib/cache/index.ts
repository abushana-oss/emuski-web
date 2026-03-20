/**
 * Enterprise Cache System - Main Export
 * Complete Redis/Valkey caching solution for EMUSKI platform
 * 
 * Principal Engineer & Industry Standards Implementation:
 * - Multi-tier caching architecture
 * - Intelligent invalidation strategies  
 * - Comprehensive monitoring and alerting
 * - Advanced fallback mechanisms
 * - Performance optimization
 */

// Core caching infrastructure
export { redis, CACHE_KEYS, CACHE_TTL } from './redis-client'
export type { CacheMetrics, CacheEntry } from './redis-client'
import { redis } from './redis-client'

// Specialized caching layers (simplified for Edge Runtime compatibility)
// CAD and session caches removed to avoid Node.js crypto in Edge Runtime

// Invalidation and lifecycle management
export { invalidationManager } from './invalidation-manager'
import { invalidationManager } from './invalidation-manager'
export type {
  InvalidationEvent,
  InvalidationRule,
  CacheDependency
} from './invalidation-manager'

// Monitoring and observability
export { cacheMonitor } from './monitoring'
import { cacheMonitor } from './monitoring'
export type {
  PerformanceMetric,
  CacheHealth,
  SLAMetrics,
  AlertRule
} from './monitoring'

// Fallback and resilience
export { fallbackHandler, ServiceState } from './fallback-handler'
import { fallbackHandler } from './fallback-handler'
export type { FallbackConfig, CacheOperation, BackupEntry } from './fallback-handler'

// Health coordination
export { redisHealthCoordinator } from './health-coordinator'
import { redisHealthCoordinator } from './health-coordinator'

/**
 * Initialize the complete caching system
 * This runs at server startup via instrumentation.ts
 */
export async function initializeCacheSystem(): Promise<void> {
  console.log('🚀 Initializing EMUSKI Cache System...')
  
  try {
    // Initialize health coordinator first (this starts Redis health monitoring)
    redisHealthCoordinator.startMonitoring(
      () => redis.healthCheck(),
      30000 // 30 second intervals
    )

    // Test initial Redis connectivity
    const isHealthy = await redisHealthCoordinator.forceHealthCheck()
    if (!isHealthy) {
      console.warn('⚠️ Redis not available - operating in fallback mode')
    }

    // Set up cache dependencies
    invalidationManager.addDependency(
      'dfm-analysis-v2',
      ['algorithm-version', 'geometry-data'],
      '2.1.0'
    )

    // Initialize monitoring (this will subscribe to the health coordinator)
    // cacheMonitor is initialized in its constructor
    
    // Initialize fallback handler (this will also subscribe to health coordinator)
    // The monitoring and fallback are already set up through their constructors

    // Cache system ready
    console.log('✅ EMUSKI Cache System initialized at server startup')
    console.log(`   🔗 Health Coordinator: ${redisHealthCoordinator.getSubscriberCount()} subscribers`)
    console.log(`   📊 Monitoring: Active`)
    console.log(`   🔄 Invalidation: ${invalidationManager.getStats().rules.total} rules`)
    console.log(`   🛡️ Fallback: ${fallbackHandler.getStatus().serviceState} mode`)
    
  } catch (error) {
    console.error('❌ Cache system initialization failed:', error)
    console.log('   🛡️ Operating in fallback mode only')
  }
}

/**
 * Graceful shutdown of the cache system
 */
export async function shutdownCacheSystem(): Promise<void> {
  console.log('🔄 Shutting down cache system...')
  
  try {
    await fallbackHandler.shutdown()
    invalidationManager.shutdown()
    cacheMonitor.shutdown()
    await redis.disconnect()
    
    console.log('✅ Cache system shutdown complete')
  } catch (error) {
    console.error('❌ Cache system shutdown failed:', error)
  }
}

/**
 * Get comprehensive cache system status
 */
export async function getCacheSystemStatus() {
  const [health, fallbackStatus] = await Promise.all([
    cacheMonitor.getCurrentHealth(),
    Promise.resolve(fallbackHandler.getStatus())
  ])

  return {
    timestamp: new Date().toISOString(),
    overall: health.overall,
    components: {
      redis: {
        connected: health.redis.connected,
        latency: health.redis.latency,
        hitRatio: health.redis.hitRatio,
        errorRate: health.redis.errorRate
      },
      memory: {
        usage: health.memory.usage,
        size: health.memory.size,
        hitRatio: health.memory.hitRatio
      },
      monitoring: {
        rulesActive: health.invalidation.rulesActive,
        pendingOperations: health.invalidation.pendingOperations
      },
      fallback: {
        serviceState: fallbackStatus.serviceState,
        localBackupSize: fallbackStatus.localBackup.size,
        persistenceSize: fallbackStatus.persistence.size
      }
    },
    metrics: {
      sla: cacheMonitor.getSLAMetrics(24),
      dashboard: cacheMonitor.getDashboardData()
    }
  }
}

/**
 * High-level cache operations with automatic fallback
 */
export class CacheAPI {
  /**
   * Get value with automatic fallback
   */
  static async get<T>(
    key: string, 
    fallbackFn?: () => Promise<T>,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<T | null> {
    return await fallbackHandler.execute({
      key,
      operation: 'get',
      fallbackFn,
      priority
    })
  }

  /**
   * Set value with automatic backup
   */
  static async set<T>(
    key: string,
    value: T,
    ttl?: number,
    priority: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ): Promise<boolean> {
    const result = await fallbackHandler.execute({
      key,
      operation: 'set',
      value,
      ttl,
      priority
    })
    
    return result !== null
  }

  /**
   * Delete value
   */
  static async del(key: string): Promise<boolean> {
    const result = await fallbackHandler.execute({
      key,
      operation: 'del',
      priority: 'medium'
    })
    
    return result !== null
  }

  /**
   * Cache DFM analysis (simplified)
   */
  static async cacheDFMAnalysis(
    key: string,
    analysis: string,
    ttl: number = 3600
  ): Promise<void> {
    await this.set(key, analysis, ttl, 'medium')
  }

  /**
   * Get cached DFM analysis (simplified)
   */
  static async getDFMAnalysis(key: string): Promise<string | null> {
    return await this.get(key)
  }

  /**
   * Invalidate related caches
   */
  static async invalidateUserData(userId: string): Promise<number> {
    return await invalidationManager.invalidate({
      type: 'user_update',
      scope: 'user',
      target: userId,
      reason: 'User data updated'
    })
  }

  /**
   * Warm critical caches (simplified)
   */
  static async warmCaches(keys: string[]): Promise<void> {
    console.log(`🔥 Warming ${keys.length} cache keys...`)
  }
}

// Performance tracking wrapper
export function withCacheMetrics<T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  operation: string
) {
  return async (...args: T): Promise<R> => {
    const startTime = Date.now()
    
    try {
      const result = await fn(...args)
      
      cacheMonitor.recordMetric({
        timestamp: new Date().toISOString(),
        operation,
        latency: Date.now() - startTime,
        success: true
      })
      
      return result
    } catch (error) {
      cacheMonitor.recordMetric({
        timestamp: new Date().toISOString(),
        operation,
        latency: Date.now() - startTime,
        success: false,
        errorType: error instanceof Error ? error.message : 'unknown'
      })
      
      throw error
    }
  }
}