import Groq from 'groq-sdk'
import Anthropic from '@anthropic-ai/sdk'
import { serverEnv } from '@/config/env'
import { AI_MODELS, MAX_TOKENS, EMUSKI_SYSTEM_PROMPT } from '@/config/ai'
import type { Message } from './schema'

type ModelKey = 'voice' | 'chat'
type Result<T> = { data: T } | { error: string }

const groqClient = new Groq({ apiKey: serverEnv.GROQ_API_KEY })

// ── Groq (PRIMARY — always tried first) ────────────────────────────────────
export async function callGroq(
  messages: Message[],
  modelKey: ModelKey,
  systemPromptExtra?: string,
  signal?: AbortSignal,
): Promise<Result<string>> {
  try {
    const systemContent = systemPromptExtra
      ? `${EMUSKI_SYSTEM_PROMPT}\n\nAdditional context: ${systemPromptExtra}`
      : EMUSKI_SYSTEM_PROMPT

    const completion = await groqClient.chat.completions.create(
      {
        model: AI_MODELS[modelKey],
        max_tokens: MAX_TOKENS[modelKey],
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemContent },
          ...messages,
        ],
      },
      { signal },
    )

    const reply = completion.choices[0]?.message?.content
    if (!reply) return { error: 'Empty response from AI' }
    return { data: reply }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'

    // Surface 429 so the route can attempt Anthropic fallback
    if (message.includes('429') || message.toLowerCase().includes('rate limit')) {
      return { error: 'GROQ_RATE_LIMITED' }
    }

    console.error('[sales-agent] Groq error:', { message, timestamp: new Date().toISOString() })
    return { error: 'AI service temporarily unavailable. Please try again.' }
  }
}

// ── Anthropic (FALLBACK — only used when Groq 429s and key is present) ─────
export async function callAnthropicFallback(
  messages: Message[],
  systemPromptExtra?: string,
  signal?: AbortSignal,
): Promise<Result<string>> {
  if (!serverEnv.ANTHROPIC_API_KEY) {
    return { error: 'Fallback unavailable' }
  }

  try {
    const anthropic = new Anthropic({ apiKey: serverEnv.ANTHROPIC_API_KEY })
    const systemContent = systemPromptExtra
      ? `${EMUSKI_SYSTEM_PROMPT}\n\nAdditional context: ${systemPromptExtra}`
      : EMUSKI_SYSTEM_PROMPT

    const response = await anthropic.messages.create(
      {
        model: AI_MODELS.fallback,
        max_tokens: MAX_TOKENS.chat,
        system: systemContent,
        messages,
      },
      { signal },
    )

    const block = response.content[0]
    if (!block || block.type !== 'text') return { error: 'Empty fallback response' }
    return { data: block.text }
  } catch (err) {
    console.error('[sales-agent] Anthropic fallback error:', err)
    return { error: 'Service unavailable. Please try again or contact us directly.' }
  }
}

// ── callAI — orchestrator: Groq first, Anthropic if Groq rate-limits ───────
export async function callAI(
  messages: Message[],
  modelKey: ModelKey,
  systemPromptExtra?: string,
): Promise<Result<string>> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 28_000) // 28s hard timeout

  try {
    const groqResult = await callGroq(messages, modelKey, systemPromptExtra, controller.signal)

    if ('data' in groqResult) return groqResult

    // Groq rate-limited → try Anthropic fallback
    if (groqResult.error === 'GROQ_RATE_LIMITED') {
      console.warn('[sales-agent] Groq rate limited — attempting Anthropic fallback')
      return callAnthropicFallback(messages, systemPromptExtra, controller.signal)
    }

    return groqResult
  } finally {
    clearTimeout(timeout)
  }
}