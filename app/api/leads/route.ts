import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import { serverEnv } from '@/config/env'

const LeadSchema = z.object({
  email: z.string().email(),
  sessionId: z.string().uuid(),
  messageCount: z.number().int().min(1),
  pageUrl: z.string().url().optional(),
})

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = LeadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid lead data' }, { status: 422 })
  }

  const { email, sessionId, messageCount, pageUrl } = parsed.data

  // Save to Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  const { error: dbError } = await supabase.from('leads').insert({
    email,
    session_id: sessionId,
    message_count: messageCount,
    source: 'ai-widget',
    page_url: pageUrl ?? null,
  })

  if (dbError) {
    console.error('[leads] Supabase insert error:', dbError.message)
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 })
  }

  // Send notification email (optional)
  if (serverEnv.RESEND_API_KEY && serverEnv.SALES_NOTIFICATION_EMAIL) {
    const resend = new Resend(serverEnv.RESEND_API_KEY)
    await resend.emails.send({
      from: 'EMUSKI AI Widget <noreply@emuski.com>',
      to: serverEnv.SALES_NOTIFICATION_EMAIL,
      subject: `New AI widget lead`,
      text: [
        `Email: ${email}`,
        `Messages exchanged: ${messageCount}`,
        `Page: ${pageUrl ?? 'unknown'}`,
        `Time: ${new Date().toISOString()}`,
        '',
        'View all leads in your Supabase dashboard.',
      ].join('\n'),
    })
  }

  return NextResponse.json({ data: { success: true } }, { status: 201 })
}