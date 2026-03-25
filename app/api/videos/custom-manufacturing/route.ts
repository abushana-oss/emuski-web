import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit } from '@/lib/rate-limiter'

export const dynamic = 'force-dynamic' // Prevent static generation
export const revalidate = 60 // cache for 1 minute at the edge/CDN

async function getHandler(_req: NextRequest): Promise<NextResponse> {
  const fileId = process.env.GOOGLE_DRIVE_CUSTOM_MANUFACTURING_FILE_ID
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY

  if (!fileId || !apiKey) {
    return new NextResponse('Video not configured', { status: 500 })
  }

  const driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`

  const upstream = await fetch(driveUrl)

  if (!upstream.ok || !upstream.body) {
    return new NextResponse('Failed to fetch video', { status: upstream.status })
  }

  const contentType = upstream.headers.get('content-type') ?? 'video/mp4'

  return new NextResponse(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      // basic caching for performance; tweak as needed
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  })
}

// Apply rate limiting
export const GET = withRateLimit(getHandler, '/api/videos/custom-manufacturing');
