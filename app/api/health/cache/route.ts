import { NextRequest, NextResponse } from 'next/server'
import { getCacheSystemStatus } from '@/lib/cache'

export async function GET(req: NextRequest) {
  try {
    const status = await getCacheSystemStatus()
    
    return NextResponse.json({
      service: 'EMUSKI Cache System',
      ...status
    })
  } catch (error) {
    console.error('Cache health check failed:', error)
    
    return NextResponse.json(
      {
        service: 'EMUSKI Cache System',
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    )
  }
}