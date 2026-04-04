import { z } from 'zod'

const serverSchema = z.object({
  // Groq — REQUIRED (free tier primary AI)
  GROQ_API_KEY: z.string().min(1, 'GROQ_API_KEY is required. Get one free at console.groq.com'),

  // Anthropic — OPTIONAL paid fallback
  ANTHROPIC_API_KEY: z.string().optional(),


  // Redis — OPTIONAL (rate limiting). Falls back to no rate limiting if absent.
  REDIS_URL: z.string().url().optional(),

  // Email — OPTIONAL (lead notifications)
  RESEND_API_KEY: z.string().optional(),
  SALES_NOTIFICATION_EMAIL: z.string().email().optional(),
})

const publicSchema = z.object({
  NEXT_PUBLIC_AI_AGENT_ENABLED: z
    .string()
    .transform((v) => v !== 'false')
    .default('true'),
})

// Validate at module load — fail fast, fail loudly
export const serverEnv = serverSchema.parse(process.env)
export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_AI_AGENT_ENABLED: process.env.NEXT_PUBLIC_AI_AGENT_ENABLED,
})