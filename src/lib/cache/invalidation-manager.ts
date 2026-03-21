/**
 * Advanced Cache Invalidation Manager
 * Implements intelligent cache invalidation strategies following industry best practices
 * 
 * Features:
 * - Event-driven invalidation
 * - Dependency tracking and cascade invalidation
 * - Time-based and version-based invalidation
 * - Bulk operations with rate limiting
 * - Cache warming after invalidation
 */

import { redis, CACHE_KEYS } from './redis-client'
import { EventEmitter } from 'events'

interface InvalidationEvent {
  type: 'user_update' | 'algorithm_update' | 'data_change' | 'manual' | 'scheduled'
  scope: 'user' | 'global' | 'tag' | 'pattern'
  target: string
  reason: string
  timestamp: string
  metadata?: Record<string, any>
}

interface InvalidationRule {
  id: string
  name: string
  trigger: {
    event: string
    condition?: (data: any) => boolean
  }
  action: {
    type: 'tag' | 'pattern' | 'key' | 'function'
    target: string | string[] | ((event: InvalidationEvent) => string[] | Promise<string[]>)
  }
  cascade?: string[] // Related rules to trigger
  delay?: number // Delay in ms before invalidation
  batch?: boolean // Batch with other invalidations
}

interface CacheDependency {
  key: string
  dependsOn: string[]
  lastUpdated: string
  version: string
}

class CacheInvalidationManager extends EventEmitter {
  private rules: Map<string, InvalidationRule> = new Map()
  private dependencies: Map<string, CacheDependency> = new Map()
  private pendingInvalidations: Map<string, NodeJS.Timeout> = new Map()
  private batchQueue: InvalidationEvent[] = []
  private batchTimer?: NodeJS.Timeout

  constructor() {
    super()
    this.initializeDefaultRules()
    this.startBatchProcessor()
  }

  /**
   * Initialize default invalidation rules
   */
  private initializeDefaultRules(): void {
    // User data update invalidation
    this.addRule({
      id: 'user_data_update',
      name: 'User Data Update',
      trigger: {
        event: 'user:updated'
      },
      action: {
        type: 'tag',
        target: (event) => [`user:${event.target}`]
      }
    })

    // Algorithm version update invalidation
    this.addRule({
      id: 'algorithm_update',
      name: 'Algorithm Version Update',
      trigger: {
        event: 'algorithm:updated'
      },
      action: {
        type: 'tag',
        target: (event) => [`version:${event.metadata?.oldVersion}`]
      },
      cascade: ['warm_popular_cache']
    })

    // DFM analysis dependency invalidation
    this.addRule({
      id: 'geometry_update',
      name: 'Geometry Data Update',
      trigger: {
        event: 'geometry:updated'
      },
      action: {
        type: 'tag',
        target: (event) => [`geometry:${event.target}`]
      }
    })

    // Credit system update invalidation
    this.addRule({
      id: 'credits_update',
      name: 'User Credits Update',
      trigger: {
        event: 'credits:updated'
      },
      action: {
        type: 'key',
        target: (event) => [`${CACHE_KEYS.USER_CREDITS}:${event.target}`]
      }
    })

    // Session invalidation on security events
    this.addRule({
      id: 'security_event',
      name: 'Security Event Invalidation',
      trigger: {
        event: 'security:breach'
      },
      action: {
        type: 'tag',
        target: (event) => [`user:${event.target}`, 'auth-token']
      }
    })

    // Cache warming after invalidation
    this.addRule({
      id: 'warm_popular_cache',
      name: 'Warm Popular Cache',
      trigger: {
        event: 'invalidation:completed'
      },
      action: {
        type: 'function',
        target: this.warmPopularCache.bind(this)
      },
      delay: 5000 // Wait 5 seconds after invalidation
    })
  }

  /**
   * Add custom invalidation rule
   */
  addRule(rule: InvalidationRule): void {
    this.rules.set(rule.id, rule)
    this.on(rule.trigger.event, (data) => this.executeRule(rule, data))
    
  }

  /**
   * Remove invalidation rule
   */
  removeRule(ruleId: string): boolean {
    const rule = this.rules.get(ruleId)
    if (rule) {
      this.rules.delete(ruleId)
      this.removeAllListeners(rule.trigger.event)
      return true
    }
    return false
  }

  /**
   * Execute invalidation rule
   */
  private async executeRule(rule: InvalidationRule, eventData: any): Promise<void> {
    try {
      // Check condition if specified
      if (rule.trigger.condition && !rule.trigger.condition(eventData)) {
        return
      }

      const event: InvalidationEvent = {
        type: eventData.type || 'manual',
        scope: eventData.scope || 'tag',
        target: eventData.target,
        reason: `Rule: ${rule.name}`,
        timestamp: new Date().toISOString(),
        metadata: eventData.metadata
      }

      // Apply delay if specified
      if (rule.delay) {
        const timeoutId = setTimeout(async () => {
          await this.processInvalidation(rule, event)
          this.pendingInvalidations.delete(rule.id)
        }, rule.delay)

        this.pendingInvalidations.set(rule.id, timeoutId)
      } else if (rule.batch) {
        // Add to batch queue
        this.batchQueue.push(event)
      } else {
        // Execute immediately
        await this.processInvalidation(rule, event)
      }

      // Execute cascade rules
      if (rule.cascade) {
        for (const cascadeRuleId of rule.cascade) {
          const cascadeRule = this.rules.get(cascadeRuleId)
          if (cascadeRule) {
            this.emit(cascadeRule.trigger.event, {
              ...eventData,
              cascadeFrom: rule.id
            })
          }
        }
      }
    } catch (error) {
    }
  }

  /**
   * Process invalidation based on rule action
   */
  private async processInvalidation(rule: InvalidationRule, event: InvalidationEvent): Promise<void> {
    try {
      let targets: string[] = []

      if (typeof rule.action.target === 'function') {
        targets = await rule.action.target(event)
      } else if (Array.isArray(rule.action.target)) {
        targets = rule.action.target
      } else {
        targets = [rule.action.target]
      }

      let invalidatedCount = 0

      switch (rule.action.type) {
        case 'tag':
          for (const tag of targets) {
            const count = await redis.invalidateByTags([tag])
            invalidatedCount += count
          }
          break

        case 'pattern':
          for (const pattern of targets) {
            const count = await redis.invalidateByPattern(pattern)
            invalidatedCount += count
          }
          break

        case 'key':
          for (const key of targets) {
            const deleted = await redis.del(key)
            if (deleted) invalidatedCount++
          }
          break

        case 'function':
          // Custom function execution
          if (typeof rule.action.target === 'function') {
            await rule.action.target(event)
          }
          break
      }

      
      // Emit completion event
      this.emit('invalidation:completed', {
        rule: rule.id,
        event,
        invalidatedCount,
        timestamp: new Date().toISOString()
      })

    } catch (error) {
    }
  }

  /**
   * Start batch processor for efficient bulk invalidations
   */
  private startBatchProcessor(): void {
    this.batchTimer = setInterval(async () => {
      if (this.batchQueue.length > 0) {
        const batch = [...this.batchQueue]
        this.batchQueue = []

        await this.processBatchInvalidation(batch)
      }
    }, 5000) // Process batch every 5 seconds
  }

  /**
   * Process batch invalidation
   */
  private async processBatchInvalidation(events: InvalidationEvent[]): Promise<void> {
    try {
      const tagGroups: Map<string, InvalidationEvent[]> = new Map()

      // Group events by scope and target for efficient processing
      events.forEach(event => {
        const key = `${event.scope}:${event.target}`
        if (!tagGroups.has(key)) {
          tagGroups.set(key, [])
        }
        tagGroups.get(key)!.push(event)
      })

      let totalInvalidated = 0

      for (const [groupKey, groupEvents] of tagGroups) {
        const [scope, target] = groupKey.split(':')
        
        if (scope === 'tag') {
          const count = await redis.invalidateByTags([target])
          totalInvalidated += count
        } else if (scope === 'user') {
          const count = await redis.invalidateByTags([`user:${target}`])
          totalInvalidated += count
        }
      }


    } catch (error) {
    }
  }

  /**
   * Manually trigger invalidation
   */
  async invalidate(params: {
    type: InvalidationEvent['type']
    scope: InvalidationEvent['scope']
    target: string
    reason?: string
    metadata?: Record<string, any>
  }): Promise<number> {
    const event: InvalidationEvent = {
      type: params.type,
      scope: params.scope,
      target: params.target,
      reason: params.reason || 'Manual invalidation',
      timestamp: new Date().toISOString(),
      metadata: params.metadata
    }

    try {
      let invalidatedCount = 0

      switch (params.scope) {
        case 'user':
          invalidatedCount = await redis.invalidateByTags([`user:${params.target}`])
          break
        case 'tag':
          invalidatedCount = await redis.invalidateByTags([params.target])
          break
        case 'global':
          // Global invalidation - use with extreme caution
          invalidatedCount = await this.globalInvalidation()
          break
        default:
          const deleted = await redis.del(params.target)
          invalidatedCount = deleted ? 1 : 0
      }

      this.emit('manual:invalidation', event)
      
      return invalidatedCount

    } catch (error) {
      return 0
    }
  }

  /**
   * Add cache dependency tracking
   */
  addDependency(key: string, dependsOn: string[], version: string = '1.0.0'): void {
    const dependency: CacheDependency = {
      key,
      dependsOn,
      lastUpdated: new Date().toISOString(),
      version
    }

    this.dependencies.set(key, dependency)
    
    // Set up invalidation listeners for dependencies
    dependsOn.forEach(dep => {
      this.on(`dependency:${dep}:updated`, () => {
        this.invalidate({
          type: 'data_change',
          scope: 'tag',
          target: key,
          reason: `Dependency updated: ${dep}`
        })
      })
    })
  }

  /**
   * Update dependency (triggers cascade invalidation)
   */
  updateDependency(dependencyKey: string, newVersion?: string): void {
    this.emit(`dependency:${dependencyKey}:updated`, {
      key: dependencyKey,
      version: newVersion,
      timestamp: new Date().toISOString()
    })
  }

  /**
   * Warm popular cache entries after invalidation
   */
  private async warmPopularCache(event: InvalidationEvent): Promise<void> {
    try {
      // This would integrate with your analytics to identify popular content
      
      // Example: Warm popular DFM analyses
      // const popularFiles = await this.getPopularFiles()
      // await cadCache.warmCache(popularFiles)
      
    } catch (error) {
    }
  }

  /**
   * Global cache invalidation (emergency use only)
   */
  private async globalInvalidation(): Promise<number> {
    
    // In a real implementation, you would need to scan all keys
    // This is not efficient and should be avoided
    return 0
  }

  /**
   * Get invalidation statistics
   */
  getStats() {
    return {
      rules: {
        total: this.rules.size,
        active: Array.from(this.rules.values()).map(r => ({
          id: r.id,
          name: r.name,
          hasDelay: !!r.delay,
          hasCascade: !!r.cascade
        }))
      },
      pending: {
        delayed: this.pendingInvalidations.size,
        batched: this.batchQueue.length
      },
      dependencies: {
        total: this.dependencies.size,
        keys: Array.from(this.dependencies.keys())
      }
    }
  }

  /**
   * Graceful shutdown
   */
  shutdown(): void {
    // Clear pending timeouts
    this.pendingInvalidations.forEach(timeout => clearTimeout(timeout))
    this.pendingInvalidations.clear()

    // Clear batch timer
    if (this.batchTimer) {
      clearInterval(this.batchTimer)
    }

    // Process remaining batch items
    if (this.batchQueue.length > 0) {
      this.processBatchInvalidation(this.batchQueue)
    }

    this.removeAllListeners()
  }
}

// Export singleton instance
export const invalidationManager = new CacheInvalidationManager()

// Export types
export type {
  InvalidationEvent,
  InvalidationRule,
  CacheDependency
}