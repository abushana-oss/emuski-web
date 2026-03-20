/**
 * Cache Performance Monitoring & Metrics
 * Enterprise-grade monitoring following observability best practices
 * 
 * Features:
 * - Real-time performance metrics
 * - SLA monitoring and alerting
 * - Cache hit/miss ratio tracking
 * - Latency distribution analysis
 * - Memory usage optimization
 * - Automated health checks
 */

import { redis } from './redis-client'
import { cadCache } from './cad-cache'
import { sessionCache } from './session-cache'
import { invalidationManager } from './invalidation-manager'
import { redisHealthCoordinator } from './health-coordinator'
import { EventEmitter } from 'events'

interface PerformanceMetric {
  timestamp: string
  operation: string
  latency: number
  success: boolean
  cacheHit?: boolean
  dataSize?: number
  errorType?: string
}

interface CacheHealth {
  overall: 'healthy' | 'degraded' | 'critical'
  redis: {
    connected: boolean
    latency: number
    hitRatio: number
    errorRate: number
  }
  memory: {
    usage: number
    hitRatio: number
    size: number
  }
  invalidation: {
    rulesActive: number
    pendingOperations: number
    lastError?: string
  }
}

interface SLAMetrics {
  availability: number // percentage
  averageLatency: number // ms
  p95Latency: number // ms
  p99Latency: number // ms
  errorRate: number // percentage
  throughput: number // ops/second
}

interface AlertRule {
  id: string
  name: string
  condition: (metrics: CacheHealth) => boolean
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  cooldown: number // seconds between alerts
  lastTriggered?: Date
}

class CacheMonitor extends EventEmitter {
  private metrics: PerformanceMetric[] = []
  private latencyHistory: number[] = []
  private alertRules: Map<string, AlertRule> = new Map()
  private monitoringInterval?: NodeJS.Timeout
  private metricsInterval?: NodeJS.Timeout
  private readonly METRICS_RETENTION = 1000 // Keep last 1000 metrics
  private readonly LATENCY_RETENTION = 500 // Keep last 500 latency measurements

  constructor() {
    super()
    this.initializeDefaultAlerts()
    this.startMonitoring()
  }

  /**
   * Initialize default alert rules
   */
  private initializeDefaultAlerts(): void {
    this.addAlertRule({
      id: 'redis_disconnect',
      name: 'Redis Connection Lost',
      condition: (health) => !health.redis.connected,
      severity: 'critical',
      message: 'Redis connection lost - caching disabled',
      cooldown: 300 // 5 minutes
    })

    this.addAlertRule({
      id: 'high_latency',
      name: 'High Cache Latency',
      condition: (health) => health.redis.latency > 1000, // > 1 second
      severity: 'high',
      message: 'Cache latency is unusually high',
      cooldown: 600 // 10 minutes
    })

    this.addAlertRule({
      id: 'low_hit_ratio',
      name: 'Low Cache Hit Ratio',
      condition: (health) => health.redis.hitRatio < 70, // < 70%
      severity: 'medium',
      message: 'Cache hit ratio is below optimal threshold',
      cooldown: 1800 // 30 minutes
    })

    this.addAlertRule({
      id: 'high_error_rate',
      name: 'High Error Rate',
      condition: (health) => health.redis.errorRate > 5, // > 5%
      severity: 'high',
      message: 'Cache error rate is elevated',
      cooldown: 300 // 5 minutes
    })

    this.addAlertRule({
      id: 'memory_pressure',
      name: 'Memory Pressure',
      condition: (health) => health.memory.usage > 0.9, // > 90%
      severity: 'medium',
      message: 'Memory cache usage is high',
      cooldown: 900 // 15 minutes
    })
  }

  /**
   * Add custom alert rule
   */
  addAlertRule(rule: AlertRule): void {
    this.alertRules.set(rule.id, rule)
    console.log(`✅ Alert rule added: ${rule.name}`)
  }

  /**
   * Start monitoring processes
   */
  private startMonitoring(): void {
    // Use shared health coordinator instead of independent timer
    redisHealthCoordinator.startMonitoring(
      () => redis.healthCheck(),
      30000 // 30 seconds
    )

    // Subscribe to health updates
    redisHealthCoordinator.subscribe((healthy: boolean) => {
      if (!healthy) {
        console.warn('🔴 Redis health degraded')
        this.emit('health-change', { redis: { connected: false } })
      } else {
        console.log('🟢 Redis health recovered')
        this.emit('health-change', { redis: { connected: true } })
      }
    })

    // Metrics collection every 5 seconds
    this.metricsInterval = setInterval(() => {
      this.collectMetrics()
    }, 5000)

    // Still perform full health check but less frequently (every 2 minutes)
    this.monitoringInterval = setInterval(async () => {
      await this.performHealthCheck()
    }, 120000)

    console.log('✅ Cache monitoring started with shared health coordinator')
  }

  /**
   * Record performance metric
   */
  recordMetric(metric: PerformanceMetric): void {
    this.metrics.push(metric)
    
    // Keep only recent metrics
    if (this.metrics.length > this.METRICS_RETENTION) {
      this.metrics = this.metrics.slice(-this.METRICS_RETENTION)
    }

    // Track latency for analysis
    this.latencyHistory.push(metric.latency)
    if (this.latencyHistory.length > this.LATENCY_RETENTION) {
      this.latencyHistory = this.latencyHistory.slice(-this.LATENCY_RETENTION)
    }

    // Emit metric event for real-time processing
    this.emit('metric', metric)
  }

  /**
   * Perform comprehensive health check
   */
  private async performHealthCheck(): Promise<CacheHealth> {
    try {
      const startTime = Date.now()
      
      // Get Redis health from coordinator (cached, no extra ping)
      const redisHealthy = redisHealthCoordinator.getCurrentHealth()
      // If we need latency, force a single health check
      const redisLatency = redisHealthy ? Date.now() - startTime : 0
      
      // Get Redis metrics
      const redisMetrics = redis.getMetrics()
      const hitRatio = redis.getHitRatio()
      
      // Get memory cache stats
      const cadStats = cadCache.getCacheStats()
      
      // Get invalidation stats
      const invalidationStats = invalidationManager.getStats()

      const health: CacheHealth = {
        overall: this.determineOverallHealth(redisHealthy, hitRatio, redisMetrics.errors),
        redis: {
          connected: redisHealthy,
          latency: redisLatency,
          hitRatio: hitRatio,
          errorRate: this.calculateErrorRate(redisMetrics)
        },
        memory: {
          usage: cadStats.memory.size / cadStats.memory.maxSize,
          hitRatio: cadStats.memory.hitRatio,
          size: cadStats.memory.size
        },
        invalidation: {
          rulesActive: invalidationStats.rules.total,
          pendingOperations: invalidationStats.pending.delayed + invalidationStats.pending.batched,
          lastError: redisMetrics.lastError
        }
      }

      // Check alert rules
      await this.checkAlerts(health)

      // Emit health update
      this.emit('health', health)

      return health

    } catch (error) {
      console.error('Health check failed:', error)
      
      const criticalHealth: CacheHealth = {
        overall: 'critical',
        redis: {
          connected: false,
          latency: -1,
          hitRatio: 0,
          errorRate: 100
        },
        memory: {
          usage: 0,
          hitRatio: 0,
          size: 0
        },
        invalidation: {
          rulesActive: 0,
          pendingOperations: 0,
          lastError: error instanceof Error ? error.message : 'Unknown error'
        }
      }

      return criticalHealth
    }
  }

  /**
   * Determine overall health status
   */
  private determineOverallHealth(
    redisHealthy: boolean, 
    hitRatio: number, 
    errorCount: number
  ): CacheHealth['overall'] {
    if (!redisHealthy) return 'critical'
    if (errorCount > 10 || hitRatio < 50) return 'degraded'
    return 'healthy'
  }

  /**
   * Calculate error rate from metrics
   */
  private calculateErrorRate(metrics: any): number {
    const total = metrics.totalRequests
    return total > 0 ? (metrics.errors / total) * 100 : 0
  }

  /**
   * Check alert rules and trigger notifications
   */
  private async checkAlerts(health: CacheHealth): Promise<void> {
    const now = new Date()

    for (const [ruleId, rule] of this.alertRules) {
      try {
        // Check cooldown period
        if (rule.lastTriggered) {
          const timeSinceLastAlert = (now.getTime() - rule.lastTriggered.getTime()) / 1000
          if (timeSinceLastAlert < rule.cooldown) {
            continue
          }
        }

        // Evaluate condition
        if (rule.condition(health)) {
          await this.triggerAlert(rule, health)
          rule.lastTriggered = now
        }

      } catch (error) {
        console.error(`Alert rule ${ruleId} evaluation failed:`, error)
      }
    }
  }

  /**
   * Trigger alert notification
   */
  private async triggerAlert(rule: AlertRule, health: CacheHealth): Promise<void> {
    const alert = {
      id: rule.id,
      name: rule.name,
      severity: rule.severity,
      message: rule.message,
      timestamp: new Date().toISOString(),
      health: health,
      metadata: {
        redisLatency: health.redis.latency,
        hitRatio: health.redis.hitRatio,
        errorRate: health.redis.errorRate
      }
    }

    console.warn(`🚨 CACHE ALERT [${rule.severity.toUpperCase()}]: ${rule.message}`)

    // Emit alert event
    this.emit('alert', alert)

    // In production, integrate with alerting systems:
    // - PagerDuty
    // - Slack notifications  
    // - Email alerts
    // - Metrics dashboards (Grafana, DataDog, etc.)
    
    await this.sendAlert(alert)
  }

  /**
   * Send alert to external systems
   */
  private async sendAlert(alert: any): Promise<void> {
    try {
      // Example integration points:
      
      // 1. Log structured alert for external log aggregation
      console.log(JSON.stringify({
        type: 'cache_alert',
        ...alert
      }))

      // 2. Send to monitoring webhook (if configured)
      if (process.env.MONITORING_WEBHOOK_URL) {
        // await fetch(process.env.MONITORING_WEBHOOK_URL, {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(alert)
        // })
      }

      // 3. Store in metrics database for dashboard display
      // await this.storeAlertMetric(alert)

    } catch (error) {
      console.error('Failed to send alert:', error)
    }
  }

  /**
   * Collect and aggregate metrics
   */
  private collectMetrics(): void {
    try {
      const now = new Date().toISOString()
      
      // Calculate recent metrics
      const recentMetrics = this.metrics.filter(
        m => new Date(m.timestamp).getTime() > Date.now() - 60000 // Last minute
      )

      if (recentMetrics.length === 0) return

      const avgLatency = recentMetrics.reduce((sum, m) => sum + m.latency, 0) / recentMetrics.length
      const successRate = (recentMetrics.filter(m => m.success).length / recentMetrics.length) * 100
      const throughput = recentMetrics.length / 60 // ops per second over last minute

      // Store aggregated metrics
      this.emit('metrics:aggregated', {
        timestamp: now,
        avgLatency,
        successRate,
        throughput,
        totalOperations: recentMetrics.length
      })

    } catch (error) {
      console.error('Metrics collection failed:', error)
    }
  }

  /**
   * Calculate SLA metrics
   */
  getSLAMetrics(timeframeHours: number = 24): SLAMetrics {
    const cutoffTime = Date.now() - (timeframeHours * 60 * 60 * 1000)
    const relevantMetrics = this.metrics.filter(
      m => new Date(m.timestamp).getTime() > cutoffTime
    )

    if (relevantMetrics.length === 0) {
      return {
        availability: 100,
        averageLatency: 0,
        p95Latency: 0,
        p99Latency: 0,
        errorRate: 0,
        throughput: 0
      }
    }

    const successfulOps = relevantMetrics.filter(m => m.success)
    const latencies = relevantMetrics.map(m => m.latency).sort((a, b) => a - b)
    
    return {
      availability: (successfulOps.length / relevantMetrics.length) * 100,
      averageLatency: relevantMetrics.reduce((sum, m) => sum + m.latency, 0) / relevantMetrics.length,
      p95Latency: this.calculatePercentile(latencies, 95),
      p99Latency: this.calculatePercentile(latencies, 99),
      errorRate: ((relevantMetrics.length - successfulOps.length) / relevantMetrics.length) * 100,
      throughput: relevantMetrics.length / (timeframeHours * 3600)
    }
  }

  /**
   * Calculate percentile from sorted array
   */
  private calculatePercentile(sortedArray: number[], percentile: number): number {
    if (sortedArray.length === 0) return 0
    
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1
    return sortedArray[Math.max(0, Math.min(index, sortedArray.length - 1))]
  }

  /**
   * Get current health status
   */
  async getCurrentHealth(): Promise<CacheHealth> {
    return await this.performHealthCheck()
  }

  /**
   * Get performance dashboard data
   */
  getDashboardData() {
    const slaMetrics = this.getSLAMetrics(24)
    const recentMetrics = this.metrics.slice(-100) // Last 100 operations

    return {
      sla: slaMetrics,
      recentOperations: recentMetrics,
      alerts: {
        total: this.alertRules.size,
        recentAlerts: [] // Would contain recent alert history
      },
      cache: {
        redis: redis.getMetrics(),
        memory: cadCache.getCacheStats().memory,
        invalidation: invalidationManager.getStats()
      },
      latencyDistribution: {
        recent: this.latencyHistory.slice(-50),
        percentiles: {
          p50: this.calculatePercentile([...this.latencyHistory].sort(), 50),
          p95: this.calculatePercentile([...this.latencyHistory].sort(), 95),
          p99: this.calculatePercentile([...this.latencyHistory].sort(), 99)
        }
      }
    }
  }

  /**
   * Export metrics in Prometheus format
   */
  getPrometheusMetrics(): string {
    const redisMetrics = redis.getMetrics()
    const sla = this.getSLAMetrics(1) // Last hour
    
    return `
# HELP cache_hits_total Total cache hits
# TYPE cache_hits_total counter
cache_hits_total ${redisMetrics.hits}

# HELP cache_misses_total Total cache misses
# TYPE cache_misses_total counter
cache_misses_total ${redisMetrics.misses}

# HELP cache_errors_total Total cache errors
# TYPE cache_errors_total counter
cache_errors_total ${redisMetrics.errors}

# HELP cache_hit_ratio Cache hit ratio percentage
# TYPE cache_hit_ratio gauge
cache_hit_ratio ${redis.getHitRatio()}

# HELP cache_average_latency_ms Average cache operation latency
# TYPE cache_average_latency_ms gauge
cache_average_latency_ms ${sla.averageLatency}

# HELP cache_availability_percent Cache availability percentage
# TYPE cache_availability_percent gauge
cache_availability_percent ${sla.availability}
`.trim()
  }

  /**
   * Graceful shutdown
   */
  shutdown(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval)
    }
    
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval)
    }

    this.removeAllListeners()
    console.log('✅ Cache monitoring shutdown complete')
  }
}

// Export singleton instance
export const cacheMonitor = new CacheMonitor()

// Export types
export type {
  PerformanceMetric,
  CacheHealth,
  SLAMetrics,
  AlertRule
}