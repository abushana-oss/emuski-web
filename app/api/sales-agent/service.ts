import Groq from 'groq-sdk'
import { serverEnv } from '@/config/env'
import { AI_MODELS, MAX_TOKENS, REQUEST_SETTINGS, EMUSKI_SYSTEM_PROMPT } from '@/config/ai'
import type { Message } from './schema'

type ModelKey = 'voice' | 'chat'
type Result<T> = { data: T } | { error: string; retryAfter?: number }

/**
 * Production-grade Groq client with circuit breaker and rate limiting
 */
class GroqService {
  private client: Groq
  private circuitBreaker = {
    failures: 0,
    lastFailureTime: 0,
    state: 'CLOSED' as 'CLOSED' | 'OPEN' | 'HALF_OPEN'
  }
  private rateLimit = {
    requests: 0,
    resetTime: 0
  }

  // Production thresholds from configuration
  private readonly FAILURE_THRESHOLD = REQUEST_SETTINGS.circuitBreakerThreshold
  private readonly RECOVERY_TIMEOUT = 60000 // 1 minute
  private readonly REQUESTS_PER_HOUR = Math.floor(800 * REQUEST_SETTINGS.rateLimitBuffer) // 640/hour for safety
  private readonly MAX_RETRIES = REQUEST_SETTINGS.retryAttempts

  constructor() {
    this.client = new Groq({ 
      apiKey: serverEnv.GROQ_API_KEY,
      timeout: REQUEST_SETTINGS.timeout
    })
  }

  private canMakeRequest(): boolean {
    const now = Date.now()

    if (this.circuitBreaker.state === 'OPEN') {
      if (now - this.circuitBreaker.lastFailureTime > this.RECOVERY_TIMEOUT) {
        this.circuitBreaker.state = 'HALF_OPEN'
        this.circuitBreaker.failures = 0
        return true
      }
      return false
    }

    return true
  }

  private checkRateLimit(): { allowed: boolean; retryAfter?: number } {
    const now = Date.now()
    const hourInMs = 60 * 60 * 1000

    if (now > this.rateLimit.resetTime) {
      this.rateLimit.requests = 0
      this.rateLimit.resetTime = now + hourInMs
    }

    if (this.rateLimit.requests >= this.REQUESTS_PER_HOUR) {
      const retryAfter = Math.ceil((this.rateLimit.resetTime - now) / 1000)
      return { allowed: false, retryAfter }
    }

    this.rateLimit.requests++
    return { allowed: true }
  }

  private recordSuccess(): void {
    if (this.circuitBreaker.state === 'HALF_OPEN') {
      this.circuitBreaker.state = 'CLOSED'
    }
    this.circuitBreaker.failures = 0
  }

  private recordFailure(): void {
    this.circuitBreaker.failures++
    this.circuitBreaker.lastFailureTime = Date.now()

    if (this.circuitBreaker.failures >= this.FAILURE_THRESHOLD) {
      this.circuitBreaker.state = 'OPEN'
    }
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  private calculateBackoffDelay(attempt: number): number {
    const baseDelay = 1000 // 1 second
    const maxDelay = 30000 // 30 seconds
    const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay)
    
    // Add jitter (10-30% random variation)
    const jitter = Math.random() * 0.2 * delay + 0.1 * delay
    return Math.floor(delay + jitter)
  }

  async chatCompletion(
    messages: Message[],
    modelKey: ModelKey,
    systemPromptExtra?: string,
    signal?: AbortSignal
  ): Promise<Result<string>> {
    // Check circuit breaker
    if (!this.canMakeRequest()) {
      return {
        error: 'AI service temporarily unavailable due to repeated failures. Please try again in a few minutes.',
        retryAfter: Math.ceil(this.RECOVERY_TIMEOUT / 1000)
      }
    }

    // Check rate limits
    const rateLimitCheck = this.checkRateLimit()
    if (!rateLimitCheck.allowed) {
      return {
        error: 'Too many requests. Please wait a moment before trying again.',
        retryAfter: rateLimitCheck.retryAfter
      }
    }

    // Build system prompt for pure sales conversation
    let systemContent = EMUSKI_SYSTEM_PROMPT
    
    // Check if this is the very first message in conversation
    const isFirstMessage = messages.length === 1 && messages[0].role === 'user'
    
    if (isFirstMessage) {
      systemContent += `\n\nFIRST MESSAGE ONLY: Start your response with exactly "I'm Heena, EMUSKI's assistant - how can I help you today?" then continue with your response about EMUSKI's services.`
    } else {
      systemContent += `\n\nNEVER introduce yourself again. You are already known as Heena. Jump straight into helping with EMUSKI manufacturing services.`
    }
    
    systemContent += `\n\nFOCUS: This is a pure sales conversation. Focus 100% on selling EMUSKI's manufacturing services, capabilities, and competitive advantages. Ask about their manufacturing needs and explain how EMUSKI can help solve their challenges.`
    
    if (systemPromptExtra) {
      systemContent += `\n\nAdditional context: ${systemPromptExtra}`
    }

    // Retry logic with exponential backoff
    for (let attempt = 0; attempt < this.MAX_RETRIES; attempt++) {
      try {
        const completion = await this.client.chat.completions.create(
          {
            model: AI_MODELS[modelKey],
            max_tokens: MAX_TOKENS[modelKey],
            temperature: REQUEST_SETTINGS.temperature,
            messages: [
              { role: 'system', content: systemContent },
              ...messages.map(msg => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content
              }))
            ],
          },
          { signal }
        )

        const reply = completion.choices[0]?.message?.content
        if (!reply) {
          throw new Error('Empty response from AI')
        }

        this.recordSuccess()
        return { data: reply }

      } catch (err) {
        const error = err as Error
        const isRateLimit = error.message.includes('429') || 
                          error.message.toLowerCase().includes('rate limit') ||
                          error.message.toLowerCase().includes('quota')

        if (isRateLimit) {
          // Record failure for circuit breaker
          this.recordFailure()
          
          // If not last attempt, apply backoff
          if (attempt < this.MAX_RETRIES - 1) {
            const backoffDelay = this.calculateBackoffDelay(attempt)
            await this.sleep(backoffDelay)
            continue
          }
          
          // Last attempt failed
          return {
            error: 'AI service is currently overloaded. Please try again in a few minutes.',
            retryAfter: 300 // 5 minutes
          }
        }

        // Non-rate-limit errors - fail fast
        this.recordFailure()
        return {
          error: 'AI service temporarily unavailable. Please try again.',
        }
      }
    }

    return {
      error: 'Maximum retries exceeded. Please try again later.',
      retryAfter: 60
    }
  }

  getHealthStatus() {
    return {
      circuitBreaker: { ...this.circuitBreaker },
      rateLimit: { 
        requests: this.rateLimit.requests,
        resetTime: new Date(this.rateLimit.resetTime).toISOString(),
        remaining: Math.max(0, this.REQUESTS_PER_HOUR - this.rateLimit.requests)
      },
      isHealthy: this.circuitBreaker.state === 'CLOSED'
    }
  }
}

// Singleton instance
const groqService = new GroqService()

/**
 * Primary AI service function - Groq only with production resilience
 */
export async function callAI(
  messages: Message[],
  modelKey: ModelKey,
  systemPromptExtra?: string,
): Promise<Result<string>> {
  return groqService.chatCompletion(
    messages,
    modelKey,
    systemPromptExtra
  )
}

/**
 * Health check endpoint for monitoring
 */
export function getServiceHealth() {
  return groqService.getHealthStatus()
}