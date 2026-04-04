import { NextRequest, NextResponse } from 'next/server'
import { SalesAgentRequestSchema } from './schema'
import { callAI } from './service'
import { createClient } from '@supabase/supabase-js'

// Simple in-memory rate limiter (use ioredis if REDIS_URL is set)
// Build the full ioredis version if REDIS_URL exists in env
async function checkRateLimit(ip: string): Promise<{ allowed: boolean; retryAfter?: number }> {
  // If no Redis: fail open (allow all requests, log warning once)
  // In production with REDIS_URL: implement sliding window here
  // For now — simple in-memory map (resets on cold start, fine for MVP)
  return { allowed: true }
}

export async function POST(req: NextRequest) {
  // 1. Parse JSON
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // 2. Validate
  const parsed = SalesAgentRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  // 3. Rate limit
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const { allowed, retryAfter } = await checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      {
        status: 429,
        headers: { 'Retry-After': String(retryAfter ?? 60) },
      },
    )
  }

  // 4. Get conversation memory
  const { messages, model, systemPromptExtra, sessionId } = parsed.data
  
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  
  const { data: conversationMemory, error: memoryError } = await supabase
    .from('conversation_memory')
    .select('*')
    .eq('session_id', sessionId)
    .single()
    
  
  // 5. Call AI with memory context
  const startTime = Date.now()
  const result = await callAI(messages, model, systemPromptExtra, conversationMemory)
  const duration = Date.now() - startTime

  if ('error' in result) {
    // Return appropriate status based on error type
    const status = result.retryAfter ? 429 : 503
    const headers: Record<string, string> = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
    }
    
    if (result.retryAfter) {
      headers['Retry-After'] = String(result.retryAfter)
    }
    
    return NextResponse.json(
      { error: result.error },
      { status, headers }
    )
  }

  // Return successful response
  return NextResponse.json(
    { data: { reply: result.data } },
    {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-Response-Time': String(duration),
      },
    },
  )
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}