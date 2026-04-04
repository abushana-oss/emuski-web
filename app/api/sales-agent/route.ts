import { NextRequest, NextResponse } from 'next/server'
import { SalesAgentRequestSchema } from './schema'
import { callAI } from './service'

// Smart rate limiter with EMUSKI call-to-action for lead conversion
const rateLimitMap = new Map<string, { count: number; resetTime: number; isHighUsage: boolean }>()
const REQUESTS_PER_MINUTE = 15 // Allow 15 requests per minute per IP
const HIGH_USAGE_THRESHOLD = 8 // After 8 requests, show call-to-action
const WINDOW_MS = 60 * 1000 // 1 minute window

// Spam protection patterns
const SPAM_PATTERNS = [
  /(.)\1{10,}/i, // Repeated characters (aaaaaaaaaa)
  /^[^a-zA-Z0-9\s]{20,}/, // Too many special characters
  /<script|javascript:|data:|vbscript:/i, // XSS attempts
  /\b(viagra|casino|loan|crypto|bitcoin)\b/i // Common spam keywords
]

function isSpamMessage(message: string): boolean {
  return SPAM_PATTERNS.some(pattern => pattern.test(message))
}

async function checkRateLimit(ip: string, message?: string): Promise<{ 
  allowed: boolean; 
  showCallToAction: boolean;
  isSpam: boolean;
  retryAfter?: number;
}> {
  const now = Date.now()
  const key = `sales-agent:${ip}`
  
  // Check for spam
  if (message && isSpamMessage(message)) {
    return { 
      allowed: false, 
      showCallToAction: true, 
      isSpam: true 
    }
  }
  
  let entry = rateLimitMap.get(key)
  
  // Clean up expired entries
  if (entry && now > entry.resetTime) {
    entry = undefined
  }
  
  if (!entry) {
    // First request in window
    rateLimitMap.set(key, { count: 1, resetTime: now + WINDOW_MS, isHighUsage: false })
    return { allowed: true, showCallToAction: false, isSpam: false }
  }
  
  // Check if this is high usage - show call to action
  if (entry.count >= HIGH_USAGE_THRESHOLD && !entry.isHighUsage) {
    entry.isHighUsage = true
    return { 
      allowed: true, 
      showCallToAction: true, 
      isSpam: false 
    }
  }
  
  if (entry.count >= REQUESTS_PER_MINUTE) {
    // Rate limit exceeded - still show call to action to convert
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
    return { 
      allowed: false, 
      showCallToAction: true, 
      isSpam: false,
      retryAfter 
    }
  }
  
  // Increment count
  entry.count++
  return { 
    allowed: true, 
    showCallToAction: entry.isHighUsage, 
    isSpam: false 
  }
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

  // 3. Rate limit with smart call-to-action
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const userMessage = parsed.data.messages[0]?.content || ''
  const { allowed, showCallToAction, isSpam, retryAfter } = await checkRateLimit(ip, userMessage)
  
  // Handle spam with conversion opportunity
  if (isSpam) {
    return NextResponse.json({
      data: { 
        reply: "I'm here to help with EMUSKI's precision manufacturing services! We specialize in CNC machining, rapid prototyping, and cost engineering. For serious manufacturing inquiries, please contact us directly at enquiries@emuski.com or call +91-86670-88060. Our team is ready to help with your manufacturing needs.",
        callToAction: {
          email: "enquiries@emuski.com",
          phone: "+91-86670-88060",
          message: "Contact EMUSKI directly for manufacturing solutions"
        }
      }
    })
  }
  
  // Handle rate limit with conversion opportunity
  if (!allowed) {
    return NextResponse.json({
      data: { 
        reply: "You're really interested in EMUSKI's services! I'd love to connect you directly with our manufacturing experts. Please contact us at enquiries@emuski.com or call +91-86670-88060 for immediate assistance with your manufacturing needs. Our team can provide detailed quotes and technical support.",
        callToAction: {
          email: "enquiries@emuski.com", 
          phone: "+91-86670-88060",
          message: "Get immediate assistance from EMUSKI experts"
        }
      }
    }, {
      status: 200, // Don't use 429 - treat as successful conversion opportunity
      headers: { 'Retry-After': String(retryAfter ?? 60) }
    })
  }

  // 4. Call AI for pure sales conversation (no memory needed)
  const { messages, model, systemPromptExtra } = parsed.data
  
  const startTime = Date.now()
  const result = await callAI(messages, model, systemPromptExtra)
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

  // Return successful response with optional call-to-action
  const responseData: any = { reply: result.data }
  
  // Add call-to-action for high usage users to convert them
  if (showCallToAction) {
    responseData.callToAction = {
      email: "enquiries@emuski.com",
      phone: "+91-86670-88060", 
      message: "Ready to get started? Contact EMUSKI directly for quotes and technical support"
    }
  }
  
  return NextResponse.json(
    { data: responseData },
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