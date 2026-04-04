import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const ConversationMemorySchema = z.object({
  sessionId: z.string().uuid(),
  name: z.string().optional(),
  company: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  lastStep: z.string().optional(),
})

const GetMemorySchema = z.object({
  sessionId: z.string().uuid(),
})

// GET - Retrieve conversation memory
export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const sessionId = url.searchParams.get('sessionId')
  
  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 })
  }

  const parsed = GetMemorySchema.safeParse({ sessionId })
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid session ID' }, { status: 422 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { data, error } = await supabase
    .from('conversation_memory')
    .select('*')
    .eq('session_id', sessionId)
    .single()

  if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
    return NextResponse.json({ error: 'Failed to get memory' }, { status: 500 })
  }

  return NextResponse.json({ 
    data: data || { 
      session_id: sessionId, 
      name: null, 
      company: null, 
      email: null, 
      phone: null, 
      last_step: 'name' 
    } 
  })
}

// POST - Update conversation memory
export async function POST(req: NextRequest) {
  let body: unknown
  try { 
    body = await req.json() 
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = ConversationMemorySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid memory data', details: parsed.error }, { status: 422 })
  }

  const { sessionId, name, company, email, phone, lastStep } = parsed.data

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  // First, get existing data to merge with new data
  const { data: existing } = await supabase
    .from('conversation_memory')
    .select('*')
    .eq('session_id', sessionId)
    .single()

  // Merge existing data with new data (preserve existing values, only update if new value provided)
  const mergedData = {
    session_id: sessionId,
    name: name !== undefined && name !== null ? name : (existing?.name || null),
    company: company !== undefined && company !== null ? company : (existing?.company || null),
    email: email !== undefined && email !== null ? email : (existing?.email || null),
    phone: phone !== undefined && phone !== null ? phone : (existing?.phone || null),
    last_step: lastStep || existing?.last_step || 'name',
    updated_at: new Date().toISOString()
  }


  // Upsert with merged data
  const { error } = await supabase
    .from('conversation_memory')
    .upsert(mergedData, {
      onConflict: 'session_id'
    })

  if (error) {
    return NextResponse.json({ error: 'Failed to save memory' }, { status: 500 })
  }

  return NextResponse.json({ data: { success: true } })
}