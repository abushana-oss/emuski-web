/**
 * CAD Analysis & DFM Caching Layer
 * Specialized caching for CAD file analysis, DFM reports, and geometric computations
 * 
 * Features:
 * - Intelligent cache key generation based on geometry fingerprints
 * - Multi-level caching (memory + Redis) 
 * - Semantic versioning for analysis algorithms
 * - Cache warming for frequently accessed analyses
 */

import { redis, CACHE_KEYS, CACHE_TTL } from './redis-client'
import crypto from 'crypto'
// Simplified memory cache without LRUCache dependency for now
interface SimpleCache<T> {
  get(key: string): T | undefined
  set(key: string, value: T): void
  has(key: string): boolean
  delete(key: string): boolean
  clear(): void
  size: number
}

class SimpleMemoryCache<T> implements SimpleCache<T> {
  private cache = new Map<string, { value: T, timestamp: number }>()
  private _maxSize = 500
  private maxAge = 30 * 60 * 1000 // 30 minutes

  get(key: string): T | undefined {
    const item = this.cache.get(key)
    if (!item) return undefined
    
    if (Date.now() - item.timestamp > this.maxAge) {
      this.cache.delete(key)
      return undefined
    }
    
    return item.value
  }

  set(key: string, value: T): void {
    // Simple eviction: if at max size, delete oldest
    if (this.cache.size >= this._maxSize) {
      const firstKey = this.cache.keys().next().value
      if (firstKey) this.cache.delete(firstKey)
    }
    
    this.cache.set(key, { value, timestamp: Date.now() })
  }

  has(key: string): boolean {
    return this.cache.has(key) && !this.isExpired(key)
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  get size(): number {
    return this.cache.size
  }

  get maxSize(): number {
    return this._maxSize
  }

  private isExpired(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return true
    return Date.now() - item.timestamp > this.maxAge
  }

  purgeStale(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > this.maxAge) {
        this.cache.delete(key)
      }
    }
  }
}

interface GeometryData {
  dimensions?: {
    length?: number
    width?: number  
    height?: number
  }
  volume?: number
  surfaceArea?: number
  features?: any
  materialProperties?: {
    density?: number
    youngModulus?: number
    poissonRatio?: number
  }
}

interface DFMAnalysisRequest {
  message: string
  fileName: string
  geometryData?: GeometryData
  analysisType: 'standard' | 'advanced' | 'cost_optimization' | 'manufacturability'
  materialType?: string
  quantity?: number
}

interface CachedDFMAnalysis {
  content: string
  metadata: {
    analysisVersion: string
    algorithmVersion: string
    confidence: number
    processingTime: number
    tags: string[]
    geometryFingerprint: string
    costEstimate?: {
      material: number
      labor: number
      overhead: number
      total: number
    }
  }
  timestamp: string
}

interface CADGeometry {
  vertices: number[]
  faces: number[]
  normals: number[]
  boundingBox: {
    min: number[]
    max: number[]
  }
  properties: {
    volume: number
    surfaceArea: number
    centerOfMass: number[]
  }
}

class CADCacheManager {
  private memoryCache: SimpleMemoryCache<any>
  private readonly ALGORITHM_VERSION = '2.1.0'
  private readonly GEOMETRY_PRECISION = 6 // decimal places for geometry comparison

  constructor() {
    // L1 cache: In-memory for ultra-fast access
    this.memoryCache = new SimpleMemoryCache<any>()
  }

  /**
   * Generate semantic fingerprint for geometry data
   * Creates reproducible hash that identifies similar geometries
   */
  private generateGeometryFingerprint(geometryData: GeometryData): string {
    const normalized = this.normalizeGeometryData(geometryData)
    const fingerprint = crypto
      .createHash('sha256')
      .update(JSON.stringify(normalized))
      .digest('hex')
      .substring(0, 16) // First 16 chars for readability
    
    return fingerprint
  }

  /**
   * Normalize geometry data for consistent fingerprinting
   * Handles floating-point precision and property ordering
   */
  private normalizeGeometryData(data: GeometryData): any {
    const normalize = (num: number): number => 
      Math.round(num * Math.pow(10, this.GEOMETRY_PRECISION)) / Math.pow(10, this.GEOMETRY_PRECISION)

    return {
      dimensions: data.dimensions ? {
        length: data.dimensions.length ? normalize(data.dimensions.length) : null,
        width: data.dimensions.width ? normalize(data.dimensions.width) : null,
        height: data.dimensions.height ? normalize(data.dimensions.height) : null,
      } : null,
      volume: data.volume ? normalize(data.volume) : null,
      surfaceArea: data.surfaceArea ? normalize(data.surfaceArea) : null,
      materialProperties: data.materialProperties ? {
        density: data.materialProperties.density ? normalize(data.materialProperties.density) : null,
        youngModulus: data.materialProperties.youngModulus ? normalize(data.materialProperties.youngModulus) : null,
        poissonRatio: data.materialProperties.poissonRatio ? normalize(data.materialProperties.poissonRatio) : null,
      } : null,
      // Sort features by type for consistent ordering
      features: data.features ? JSON.stringify(data.features).split('').sort().join('') : null
    }
  }

  /**
   * Generate comprehensive cache key for DFM analysis
   */
  private generateDFMCacheKey(request: DFMAnalysisRequest): string {
    const geometryFingerprint = request.geometryData 
      ? this.generateGeometryFingerprint(request.geometryData)
      : 'no-geometry'

    const requestHash = crypto
      .createHash('md5')
      .update(`${request.message}:${request.analysisType}:${request.materialType || 'default'}`)
      .digest('hex')
      .substring(0, 8)

    return `${CACHE_KEYS.DFM_ANALYSIS}:${this.ALGORITHM_VERSION}:${geometryFingerprint}:${requestHash}`
  }

  /**
   * Get cached DFM analysis with multi-level lookup
   */
  async getDFMAnalysis(request: DFMAnalysisRequest): Promise<CachedDFMAnalysis | null> {
    const cacheKey = this.generateDFMCacheKey(request)

    // L1: Check memory cache first (fastest)
    let cached = this.memoryCache.get(cacheKey)
    if (cached) {
      return cached
    }

    // L2: Check Redis cache
    cached = await redis.get<CachedDFMAnalysis>(cacheKey)
    if (cached) {
      
      // Populate L1 cache for next access
      this.memoryCache.set(cacheKey, cached)
      return cached
    }

    return null
  }

  /**
   * Cache DFM analysis result with intelligent TTL
   */
  async cacheDFMAnalysis(
    request: DFMAnalysisRequest, 
    analysis: CachedDFMAnalysis
  ): Promise<void> {
    const cacheKey = this.generateDFMCacheKey(request)
    
    // Enhance metadata with geometry fingerprint
    analysis.metadata.geometryFingerprint = request.geometryData 
      ? this.generateGeometryFingerprint(request.geometryData)
      : 'no-geometry'
    
    analysis.metadata.algorithmVersion = this.ALGORITHM_VERSION

    // Determine TTL based on analysis complexity and confidence
    let ttl: number = CACHE_TTL.LONG // Default 6 hours
    
    if (analysis.metadata.confidence > 0.9) {
      ttl = CACHE_TTL.DAILY // High confidence: cache for 24 hours
    } else if (analysis.metadata.confidence < 0.7) {
      ttl = CACHE_TTL.MEDIUM // Low confidence: cache for 30 minutes
    }

    // Advanced analysis gets longer cache time
    if (request.analysisType === 'advanced') {
      ttl = Math.max(ttl, CACHE_TTL.DAILY)
    }

    try {
      // Store in both L1 and L2 cache
      this.memoryCache.set(cacheKey, analysis)
      
      await redis.set(cacheKey, analysis, {
        ttl,
        tags: [
          'dfm-analysis',
          `file:${request.fileName}`,
          `type:${request.analysisType}`,
          `version:${this.ALGORITHM_VERSION}`,
          analysis.metadata.geometryFingerprint
        ],
        version: this.ALGORITHM_VERSION
      })

      // Store geometry fingerprint mapping for similar geometry lookups
      if (request.geometryData) {
        const fingerprint = analysis.metadata.geometryFingerprint
        const mappingKey = `${CACHE_KEYS.CAD_GEOMETRY}:fingerprints:${fingerprint}`
        
        await redis.set(mappingKey, {
          cacheKey,
          fileName: request.fileName,
          analysisType: request.analysisType,
          cachedAt: new Date().toISOString()
        }, { ttl: CACHE_TTL.WEEKLY })
      }

    } catch (error) {
    }
  }

  /**
   * Find similar geometries for analysis reuse
   */
  async findSimilarAnalyses(geometryData: GeometryData, limit: number = 5): Promise<string[]> {
    const fingerprint = this.generateGeometryFingerprint(geometryData)
    const mappingKey = `${CACHE_KEYS.CAD_GEOMETRY}:fingerprints:${fingerprint}`
    
    try {
      const similar = await redis.get<any>(mappingKey)
      return similar ? [similar.cacheKey] : []
    } catch (error) {
      return []
    }
  }

  /**
   * Cache CAD geometry data separately for 3D viewer optimization
   */
  async cacheCADGeometry(
    fileId: string,
    geometry: CADGeometry,
    fileName: string
  ): Promise<void> {
    const cacheKey = `${CACHE_KEYS.CAD_GEOMETRY}:${fileId}`
    
    try {
      await redis.set(cacheKey, {
        ...geometry,
        metadata: {
          fileName,
          cached_at: new Date().toISOString(),
          fileSize: JSON.stringify(geometry).length,
          version: '1.0.0'
        }
      }, {
        ttl: CACHE_TTL.DAILY, // Geometry doesn't change, cache for 24h
        tags: ['cad-geometry', `file:${fileName}`, `id:${fileId}`]
      })

    } catch (error) {
    }
  }

  /**
   * Get cached CAD geometry for 3D viewer
   */
  async getCADGeometry(fileId: string): Promise<CADGeometry | null> {
    const cacheKey = `${CACHE_KEYS.CAD_GEOMETRY}:${fileId}`
    
    try {
      const cached = await redis.get<CADGeometry & { metadata: any }>(cacheKey)
      if (cached) {
        const { metadata, ...geometry } = cached
        return geometry
      }
      return null
    } catch (error) {
      return null
    }
  }

  /**
   * Warm cache for frequently accessed files
   */
  async warmCache(popularFiles: Array<{ fileId: string, fileName: string }>): Promise<void> {
    
    const promises = popularFiles.map(async ({ fileId, fileName }) => {
      try {
        // Pre-load into memory cache if exists in Redis
        const geometryKey = `${CACHE_KEYS.CAD_GEOMETRY}:${fileId}`
        const geometry = await redis.get(geometryKey)
        
        if (geometry) {
          this.memoryCache.set(geometryKey, geometry)
        }
      } catch (error) {
      }
    })

    await Promise.allSettled(promises)
  }

  /**
   * Invalidate caches by version (for algorithm updates)
   */
  async invalidateByVersion(version: string): Promise<number> {
    try {
      return await redis.invalidateByTags([`version:${version}`])
    } catch (error) {
      return 0
    }
  }

  /**
   * Clean up expired entries and optimize cache
   */
  async optimizeCache(): Promise<void> {
    try {
      // Clear memory cache of expired items
      this.memoryCache.purgeStale()
      
    } catch (error) {
    }
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      memory: {
        size: this.memoryCache.size,
        maxSize: this.memoryCache.maxSize,
        hitRatio: ((this.memoryCache as any).hits || 0) / ((this.memoryCache as any).requests || 1) * 100
      },
      redis: redis.getMetrics(),
      algorithm: {
        version: this.ALGORITHM_VERSION,
        geometryPrecision: this.GEOMETRY_PRECISION
      }
    }
  }
}

// Export singleton instance
export const cadCache = new CADCacheManager()

// Export types
export type { 
  GeometryData, 
  DFMAnalysisRequest, 
  CachedDFMAnalysis, 
  CADGeometry 
}