import { z } from 'zod'

export const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().min(1).max(2000),
})

export const SalesAgentRequestSchema = z.object({
  messages: z.array(MessageSchema).min(1).max(20),
  model: z.enum(['voice', 'chat']).default('chat'),
  // Optional — page-specific system prompt override (max 500 chars)
  systemPromptExtra: z.string().max(500).optional(),
  // Session ID for conversation memory
  sessionId: z.string().uuid(),
})

export const SalesAgentResponseSchema = z.object({
  reply: z.string(),
})

export type SalesAgentRequest = z.infer<typeof SalesAgentRequestSchema>
export type SalesAgentResponse = z.infer<typeof SalesAgentResponseSchema>
export type Message = z.infer<typeof MessageSchema>