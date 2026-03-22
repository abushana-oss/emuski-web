import { NextRequest } from 'next/server'
import { withRateLimit } from '@/lib/rate-limiter'

export const revalidate = 60 // cache at the edge

async function getHandler(_req: NextRequest) {
  const fileId = process.env.GOOGLE_DRIVE_ON_DEMAND_MANUFACTURING_FILE_ID
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY

  if (!fileId || !apiKey) {
    return new Response('Video not configured', { status: 500 })
  }

  const driveUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`

  const upstream = await fetch(driveUrl)

  if (!upstream.ok || !upstream.body) {
    return new Response('Failed to fetch video', { status: upstream.status })
  }

  const contentType = upstream.headers.get('content-type') ?? 'video/mp4'

  return new Response(upstream.body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=86400, immutable',
    },
  })
}

// Apply rate limiting
export const GET = withRateLimit(getHandler, '/api/videos/on-demand-manufacturing');
