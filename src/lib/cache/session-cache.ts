/**
 * User Session & Authentication Caching Layer
 * Handles user sessions, authentication tokens, and user-specific data caching
 * 
 * Features:
 * - Distributed session storage with Redis
 * - JWT token caching and blacklisting
 * - User preferences and settings caching
 * - Activity tracking and analytics caching
 */

import { redis, CACHE_KEYS, CACHE_TTL } from './redis-client'
import { createHash } from 'crypto'

interface UserSession {
  userId: string
  email: string
  name?: string
  isAdmin: boolean
  preferences: UserPreferences
  lastActivity: string
  loginTime: string
  ipAddress: string
  userAgent: string
  credits: {
    remaining: number
    total: number
    resetTime: string
  }
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  language: string
  defaultAnalysisType: string
  emailNotifications: boolean
  cadViewerSettings: {
    backgroundColor: string
    showGrid: boolean
    showAxes: boolean
    renderQuality: 'low' | 'medium' | 'high'
  }
}

interface AuthToken {
  tokenHash: string
  userId: string
  type: 'access' | 'refresh'
  expiresAt: string
  deviceInfo: {
    userAgent: string
    ipAddress: string
    location?: string
  }
}

interface ActivityEvent {
  userId: string
  event: string
  timestamp: string
  metadata: Record<string, any>
  sessionId: string
}

class SessionCacheManager {
  /**
   * Create session cache key for a user
   */
  private getSessionKey(userId: string): string {
    return `${CACHE_KEYS.USER_SESSIONS}:${userId}`
  }

  /**
   * Create token cache key
   */
  private getTokenKey(tokenHash: string): string {
    return `${CACHE_KEYS.AUTH_TOKENS}:${tokenHash}`
  }

  /**
   * Create blacklist key for revoked tokens
   */
  private getBlacklistKey(tokenHash: string): string {
    return `${CACHE_KEYS.AUTH_TOKENS}:blacklist:${tokenHash}`
  }

  /**
   * Create credits cache key for a user
   */
  private getCreditsKey(userId: string): string {
    return `${CACHE_KEYS.USER_CREDITS}:${userId}`
  }

  /**
   * Hash token for secure storage (never store raw tokens)
   */
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex')
  }

  /**
   * Store user session with automatic expiration
   */
  async storeSession(session: UserSession): Promise<void> {
    const sessionKey = this.getSessionKey(session.userId)
    
    try {
      // Store main session data
      await redis.set(sessionKey, session, {
        ttl: CACHE_TTL.DAILY, // Sessions expire in 24 hours
        tags: ['user-session', `user:${session.userId}`, 'auth']
      })

      // Store session mapping for quick lookups
      const sessionMappingKey = `${CACHE_KEYS.USER_SESSIONS}:active:${session.userId}`
      await redis.set(sessionMappingKey, {
        sessionKey,
        lastActivity: session.lastActivity
      }, { ttl: CACHE_TTL.DAILY })

    } catch (error) {
      throw error
    }
  }

  /**
   * Retrieve user session by ID
   */
  async getSession(userId: string): Promise<UserSession | null> {
    const sessionKey = this.getSessionKey(userId)
    
    try {
      const session = await redis.get<UserSession>(sessionKey)
      if (session) {
        // Update last activity
        await this.updateLastActivity(userId)
      }
      return session
    } catch (error) {
      return null
    }
  }

  /**
   * Update user session data (partial update)
   */
  async updateSession(
    userId: string, 
    updates: Partial<UserSession>
  ): Promise<void> {
    const sessionKey = this.getSessionKey(userId)
    
    try {
      const currentSession = await redis.get<UserSession>(sessionKey)
      if (!currentSession) {
        throw new Error('Session not found')
      }

      const updatedSession: UserSession = {
        ...currentSession,
        ...updates,
        lastActivity: new Date().toISOString()
      }

      await redis.set(sessionKey, updatedSession, {
        ttl: CACHE_TTL.DAILY,
        tags: ['user-session', `user:${userId}`, 'auth']
      })

    } catch (error) {
      throw error
    }
  }

  /**
   * Update last activity timestamp
   */
  async updateLastActivity(userId: string): Promise<void> {
    const sessionKey = this.getSessionKey(userId)
    
    try {
      const session = await redis.get<UserSession>(sessionKey)
      if (session) {
        session.lastActivity = new Date().toISOString()
        await redis.set(sessionKey, session, { ttl: CACHE_TTL.DAILY })
      }
    } catch (error) {
    }
  }

  /**
   * Store authentication token with metadata
   */
  async storeAuthToken(token: string, authData: Omit<AuthToken, 'tokenHash'>): Promise<void> {
    const tokenHash = this.hashToken(token)
    const tokenKey = this.getTokenKey(tokenHash)
    
    const tokenData: AuthToken = {
      ...authData,
      tokenHash
    }

    try {
      // Calculate TTL based on token expiration
      const expiresAt = new Date(authData.expiresAt)
      const ttl = Math.floor((expiresAt.getTime() - Date.now()) / 1000)
      
      if (ttl > 0) {
        await redis.set(tokenKey, tokenData, {
          ttl,
          tags: ['auth-token', `user:${authData.userId}`, `type:${authData.type}`]
        })

      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Validate authentication token
   */
  async validateAuthToken(token: string): Promise<AuthToken | null> {
    const tokenHash = this.hashToken(token)
    const tokenKey = this.getTokenKey(tokenHash)
    const blacklistKey = this.getBlacklistKey(tokenHash)
    
    try {
      // Check if token is blacklisted
      const isBlacklisted = await redis.exists(blacklistKey)
      if (isBlacklisted) {
        return null
      }

      // Retrieve token data
      const tokenData = await redis.get<AuthToken>(tokenKey)
      if (!tokenData) {
        return null
      }

      // Check expiration
      const expiresAt = new Date(tokenData.expiresAt)
      if (expiresAt.getTime() <= Date.now()) {
        // Clean up expired token
        await redis.del(tokenKey)
        return null
      }

      return tokenData
    } catch (error) {
      return null
    }
  }

  /**
   * Revoke authentication token (add to blacklist)
   */
  async revokeAuthToken(token: string): Promise<void> {
    const tokenHash = this.hashToken(token)
    const tokenKey = this.getTokenKey(tokenHash)
    const blacklistKey = this.getBlacklistKey(tokenHash)
    
    try {
      // Get token to determine TTL for blacklist
      const tokenData = await redis.get<AuthToken>(tokenKey)
      
      if (tokenData) {
        const expiresAt = new Date(tokenData.expiresAt)
        const ttl = Math.floor((expiresAt.getTime() - Date.now()) / 1000)
        
        if (ttl > 0) {
          // Add to blacklist with same TTL as original token
          await redis.set(blacklistKey, {
            revokedAt: new Date().toISOString(),
            userId: tokenData.userId,
            type: tokenData.type
          }, { ttl })
        }
      }

      // Remove from active tokens
      await redis.del(tokenKey)
      
    } catch (error) {
      throw error
    }
  }

  /**
   * Store user credits information
   */
  async storeUserCredits(
    userId: string, 
    credits: UserSession['credits']
  ): Promise<void> {
    const creditsKey = this.getCreditsKey(userId)
    
    try {
      await redis.set(creditsKey, credits, {
        ttl: CACHE_TTL.MEDIUM, // Credits cache for 30 minutes
        tags: ['user-credits', `user:${userId}`]
      })

      // Also update session if it exists
      const session = await this.getSession(userId)
      if (session) {
        session.credits = credits
        await this.updateSession(userId, { credits })
      }
    } catch (error) {
      throw error
    }
  }

  /**
   * Get user credits with cache fallback
   */
  async getUserCredits(userId: string): Promise<UserSession['credits'] | null> {
    const creditsKey = this.getCreditsKey(userId)
    
    try {
      // Try credits cache first
      let credits = await redis.get<UserSession['credits']>(creditsKey)
      
      if (!credits) {
        // Fallback to session data
        const session = await this.getSession(userId)
        credits = session?.credits || null
      }
      
      return credits
    } catch (error) {
      return null
    }
  }

  /**
   * Track user activity for analytics
   */
  async trackActivity(activity: ActivityEvent): Promise<void> {
    const activityKey = `${CACHE_KEYS.ANALYTICS_EVENTS}:${activity.userId}:${Date.now()}`
    
    try {
      await redis.set(activityKey, activity, {
        ttl: CACHE_TTL.WEEKLY, // Keep activity for 7 days
        tags: ['user-activity', `user:${activity.userId}`, `event:${activity.event}`]
      })

      // Increment activity counter
      const counterKey = `${CACHE_KEYS.ANALYTICS_EVENTS}:counters:${activity.event}`
      await redis.incr(counterKey)
      await redis.expire(counterKey, CACHE_TTL.DAILY)

    } catch (error) {
    }
  }

  /**
   * Get user activity history
   */
  async getUserActivity(
    userId: string, 
    limit: number = 100
  ): Promise<ActivityEvent[]> {
    try {
      // This would require a more sophisticated query mechanism
      // For now, return empty array - implement with time-series data structure
      return []
    } catch (error) {
      return []
    }
  }

  /**
   * Clean up expired sessions and tokens
   */
  async cleanupExpiredSessions(): Promise<number> {
    try {
      let cleaned = 0
      
      // Redis TTL handles automatic cleanup, but we can log cleanup events
      
      return cleaned
    } catch (error) {
      return 0
    }
  }

  /**
   * Get active sessions count for monitoring
   */
  async getActiveSessionsCount(): Promise<number> {
    try {
      // This would require scanning, which is expensive
      // Instead, maintain counters or use Redis streams for monitoring
      return 0
    } catch (error) {
      return 0
    }
  }

  /**
   * Invalidate all sessions for a user (force logout)
   */
  async invalidateUserSessions(userId: string): Promise<void> {
    try {
      await redis.invalidateByTags([`user:${userId}`])
    } catch (error) {
      throw error
    }
  }

  /**
   * Update user preferences
   */
  async updateUserPreferences(
    userId: string, 
    preferences: Partial<UserPreferences>
  ): Promise<void> {
    try {
      const session = await this.getSession(userId)
      if (session) {
        const updatedPreferences = {
          ...session.preferences,
          ...preferences
        }
        
        await this.updateSession(userId, {
          preferences: updatedPreferences
        })
      }
    } catch (error) {
      throw error
    }
  }
}

// Export singleton instance
export const sessionCache = new SessionCacheManager()

// Export types
export type {
  UserSession,
  UserPreferences,
  AuthToken,
  ActivityEvent
}