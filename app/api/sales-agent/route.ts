import { NextRequest, NextResponse } from 'next/server'
import { SalesAgentRequestSchema } from './schema'
import { callAI } from './service'

// Smart rate limiter with EMUSKI call-to-action for lead conversion
const rateLimitMap = new Map<string, { count: number; resetTime: number; isHighUsage: boolean }>()
const REQUESTS_PER_MINUTE = 15 // Allow 15 requests per minute per IP
const HIGH_USAGE_THRESHOLD = 8 // After 8 requests, show call-to-action
const WINDOW_MS = 60 * 1000 // 1 minute window

// Security patterns for prompt injection and spam protection
const SECURITY_PATTERNS = [
  // Repeated characters (potential spam)
  /(.)\1{10,}/i,
  
  // Too many special characters
  /^[^a-zA-Z0-9\s]{20,}/,
  
  // XSS and injection attempts
  /<script|javascript:|data:|vbscript:/i,
  
  // Common spam keywords
  /\b(viagra|casino|loan|crypto|bitcoin)\b/i,
  
  // Prompt injection attempts
  /ignore\s+(previous|above|all|these|your)\s+(instructions?|prompts?|rules?)/i,
  /forget\s+(everything|all|previous|above)/i,
  /(you\s+are\s+now|act\s+as|pretend\s+to\s+be|role\s*play)/i,
  /(system\s*:|assistant\s*:|user\s*:)/i,
  /\[\s*(system|assistant|user)\s*\]/i,
  /(reveal|show|tell\s+me)\s+(your\s+)?(prompt|instructions?|system\s+message)/i,
  /\b(jailbreak|break\s+out|escape\s+from)\b/i,
  /\b(override|bypass|circumvent)\s+(security|safety|rules)/i
]

function isSecurityThreat(message: string): boolean {
  return SECURITY_PATTERNS.some(pattern => pattern.test(message))
}

function sanitizeInput(input: string): string {
  // Remove potentially dangerous characters and normalize input
  return input
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, '') // Remove control characters
    .replace(/[^\w\s\-.,!?@#$%&*()+={}[\]|\\:";'<>\/`~]/g, '') // Keep only safe characters
    .trim()
    .substring(0, 2000) // Enforce length limit
}

async function checkRateLimit(ip: string, message?: string): Promise<{ 
  allowed: boolean; 
  showCallToAction: boolean;
  isSecurityThreat: boolean;
  retryAfter?: number;
}> {
  const now = Date.now()
  const key = `sales-agent:${ip}`
  
  // Check for security threats (spam and prompt injection)
  if (message && isSecurityThreat(message)) {
    return { 
      allowed: false, 
      showCallToAction: true, 
      isSecurityThreat: true 
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
    return { allowed: true, showCallToAction: false, isSecurityThreat: false }
  }
  
  // Check if this is high usage - show call to action
  if (entry.count >= HIGH_USAGE_THRESHOLD && !entry.isHighUsage) {
    entry.isHighUsage = true
    return { 
      allowed: true, 
      showCallToAction: true, 
      isSecurityThreat: false 
    }
  }
  
  if (entry.count >= REQUESTS_PER_MINUTE) {
    // Rate limit exceeded - still show call to action to convert
    const retryAfter = Math.ceil((entry.resetTime - now) / 1000)
    return { 
      allowed: false, 
      showCallToAction: true, 
      isSecurityThreat: false,
      retryAfter 
    }
  }
  
  // Increment count
  entry.count++
  return { 
    allowed: true, 
    showCallToAction: entry.isHighUsage, 
    isSecurityThreat: false 
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

  // 3. Sanitize input and check for security threats
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  const userMessage = sanitizeInput(parsed.data.messages[0]?.content || '')
  const { allowed, showCallToAction, isSecurityThreat, retryAfter } = await checkRateLimit(ip, userMessage)
  
  // Handle security threats (spam/injection) with conversion opportunity
  if (isSecurityThreat) {
    return NextResponse.json({
      data: { 
        reply: "I focus exclusively on EMUSKI's precision manufacturing services. We specialize in CNC machining, rapid prototyping, and cost engineering with 15-35% typical cost savings. What type of manufacturing challenges are you facing? For detailed discussions, contact us directly at enquiries@emuski.com or call +91-86670-88060.",
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

  // 4. Call AI for pure sales conversation (sanitize input)
  const { messages, model, systemPromptExtra } = parsed.data
  
  // Sanitize all message content before sending to AI
  const sanitizedMessages = messages.map(msg => ({
    ...msg,
    content: sanitizeInput(msg.content)
  }))
  
  const startTime = Date.now()
  const result = await callAI(sanitizedMessages, model, systemPromptExtra)
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