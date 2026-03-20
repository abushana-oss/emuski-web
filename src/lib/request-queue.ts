// Request queue implementation with optional Redis support
// Falls back to immediate processing if Redis not available

export interface QueuedRequest {
  id: string;
  userId: string;
  message: string;
  geometryData: any;
  fileName: string;
  priority: 'high' | 'normal' | 'low';
  estimatedTokens: number;
  createdAt: number;
  retryCount: number;
}

export interface QueueStats {
  queueSize: number;
  averageWaitTime: number;
  requestsPerMinute: number;
  activeRequests: number;
}

export class RequestQueue {
  private static redis: any = null;
  private static readonly MAX_QUEUE_SIZE = 1000;
  private static readonly MAX_CONCURRENT_REQUESTS = 10;
  private static readonly REQUEST_TIMEOUT_MS = 60000; // 1 minute
  private static readonly MAX_RETRIES = 3;

  static {
    // Redis disabled - using fallback implementation
    this.redis = null;
  }

  /**
   * Add request to queue with priority
   */
  static async enqueue(request: Omit<QueuedRequest, 'id' | 'createdAt' | 'retryCount'>): Promise<string> {
    if (!this.redis) {
      // No Redis - process immediately
      throw new Error('Queue not available - process immediately');
    }

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const queuedRequest: QueuedRequest = {
      ...request,
      id: requestId,
      createdAt: Date.now(),
      retryCount: 0
    };

    // Check queue size
    const queueSize = await this.getQueueSize();
    if (queueSize >= this.MAX_QUEUE_SIZE) {
      throw new Error('Request queue is full. Please try again later.');
    }

    // Add to appropriate priority queue
    const queueKey = `queue:${request.priority}`;
    await this.redis.lpush(queueKey, JSON.stringify(queuedRequest));

    // Set request timeout
    await this.redis.setex(`request:${requestId}`, Math.ceil(this.REQUEST_TIMEOUT_MS / 1000), 'pending');

    return requestId;
  }

  /**
   * Dequeue next request based on priority
   */
  static async dequeue(): Promise<QueuedRequest | null> {
    if (!this.redis) return null;

    // Try high priority first, then normal, then low
    const queues = ['queue:high', 'queue:normal', 'queue:low'];
    
    for (const queueKey of queues) {
      const requestJson = await this.redis.rpop(queueKey);
      if (requestJson) {
        const request: QueuedRequest = JSON.parse(requestJson);
        
        // Check if request hasn't timed out
        const status = await this.redis.get(`request:${request.id}`);
        if (status === 'pending') {
          // Mark as processing
          await this.redis.setex(`request:${request.id}`, 300, 'processing'); // 5 min processing timeout
          return request;
        } else {
          // Request timed out, skip it
          await this.redis.del(`request:${request.id}`);
        }
      }
    }

    return null;
  }

  /**
   * Mark request as completed
   */
  static async markCompleted(requestId: string, result: any): Promise<void> {
    if (!this.redis) return;

    await this.redis.setex(`result:${requestId}`, 3600, JSON.stringify(result)); // Cache result for 1 hour
    await this.redis.del(`request:${requestId}`);
  }

  /**
   * Mark request as failed and potentially retry
   */
  static async markFailed(request: QueuedRequest, error: string): Promise<void> {
    if (!this.redis) return;

    if (request.retryCount < this.MAX_RETRIES) {
      // Retry with exponential backoff
      const retryDelay = Math.pow(2, request.retryCount) * 1000; // 1s, 2s, 4s
      const retryRequest = {
        ...request,
        retryCount: request.retryCount + 1,
        priority: 'low' as const // Lower priority for retries
      };

      setTimeout(async () => {
        await this.redis!.lpush('queue:low', JSON.stringify(retryRequest));
      }, retryDelay);
    } else {
      // Max retries exceeded
      await this.redis.setex(`result:${request.id}`, 3600, JSON.stringify({
        error: `Request failed after ${this.MAX_RETRIES} retries: ${error}`
      }));
    }

    await this.redis.del(`request:${request.id}`);
  }

  /**
   * Get request result (polling)
   */
  static async getResult(requestId: string): Promise<any | null> {
    if (!this.redis) return null;

    const resultJson = await this.redis.get(`result:${requestId}`) as string | null;
    if (resultJson) {
      const result = JSON.parse(resultJson);
      await this.redis.del(`result:${requestId}`); // Clean up after retrieval
      return result;
    }

    // Check if still processing
    const status = await this.redis.get(`request:${requestId}`);
    if (status === 'pending' || status === 'processing') {
      return { status: 'pending' };
    }

    return null; // Request not found or timed out
  }

  /**
   * Get queue statistics
   */
  static async getStats(): Promise<QueueStats> {
    if (!this.redis) {
      return { queueSize: 0, averageWaitTime: 0, requestsPerMinute: 0, activeRequests: 0 };
    }

    const [highCount, normalCount, lowCount] = await Promise.all([
      this.redis.llen('queue:high'),
      this.redis.llen('queue:normal'),
      this.redis.llen('queue:low')
    ]);

    const queueSize = highCount + normalCount + lowCount;

    // Count active requests
    const activeKeys = await this.redis.keys('request:*');
    const activeRequests = activeKeys.length;

    // Get requests per minute from last 60 seconds
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const recentCompletions = await this.redis.zcount('completions', oneMinuteAgo, now);

    return {
      queueSize,
      averageWaitTime: queueSize * 2000, // Estimate 2 seconds per request
      requestsPerMinute: recentCompletions,
      activeRequests
    };
  }

  /**
   * Get current queue size
   */
  static async getQueueSize(): Promise<number> {
    if (!this.redis) return 0;

    const [high, normal, low] = await Promise.all([
      this.redis.llen('queue:high'),
      this.redis.llen('queue:normal'),
      this.redis.llen('queue:low')
    ]);

    return high + normal + low;
  }

  /**
   * Clean up expired requests (run periodically)
   */
  static async cleanup(): Promise<void> {
    if (!this.redis) return;

    try {
      // Clean up old results and expired requests
      const resultKeys = await this.redis.keys('result:*');
      const requestKeys = await this.redis.keys('request:*');
      
      const expiredKeys = [...resultKeys, ...requestKeys].filter(async (key) => {
        const ttl = await this.redis!.ttl(key);
        return ttl <= 0;
      });

      if (expiredKeys.length > 0) {
        await this.redis.del(...expiredKeys);
      }
    } catch (error) {
      console.error('Queue cleanup error:', error);
    }
  }

  /**
   * Check if should process immediately (bypass queue)
   */
  static async shouldProcessImmediately(userId: string): Promise<boolean> {
    if (!this.redis) return true;

    const stats = await this.getStats();
    
    // Process immediately if:
    // - Queue is small (< 10 requests)
    // - User has high priority (premium user, etc.)
    // - Low system load
    return stats.queueSize < 10 && stats.activeRequests < this.MAX_CONCURRENT_REQUESTS;
  }
}

// Background queue processor (run as separate process or scheduled job)
export class QueueProcessor {
  private static isProcessing = false;
  private static processingInterval: NodeJS.Timeout | null = null;

  static start(): void {
    if (this.processingInterval) return;

    this.processingInterval = setInterval(async () => {
      if (!this.isProcessing) {
        await this.processQueue();
      }
    }, 1000); // Process every second

    console.log('Queue processor started');
  }

  static stop(): void {
    if (this.processingInterval) {
      clearInterval(this.processingInterval);
      this.processingInterval = null;
      console.log('Queue processor stopped');
    }
  }

  private static async processQueue(): Promise<void> {
    this.isProcessing = true;

    try {
      const request = await RequestQueue.dequeue();
      if (!request) {
        this.isProcessing = false;
        return;
      }

      // Process the request using Claude API
      // This would call your existing DFM analysis logic
      const result = await this.processRequest(request);
      await RequestQueue.markCompleted(request.id, result);

    } catch (error) {
      console.error('Queue processing error:', error);
      // Handle error appropriately
    } finally {
      this.isProcessing = false;
    }
  }

  private static async processRequest(request: QueuedRequest): Promise<any> {
    // This would integrate with your existing Claude API logic
    // For now, return a placeholder
    return {
      content: 'Processed request',
      metadata: {
        processedAt: new Date().toISOString(),
        requestId: request.id
      }
    };
  }
}