import { NextRequest, NextResponse } from 'next/server';
import { RequestQueue } from '@/lib/request-queue';

// Security headers
const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const headers = new Headers(SECURITY_HEADERS);

  try {
    const { requestId } = await params;

    if (!requestId || typeof requestId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request ID' },
        { status: 400, headers }
      );
    }

    // Get request result/status
    const result = await RequestQueue.getResult(requestId);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Request not found or expired' },
        { status: 404, headers }
      );
    }

    // Check if still pending
    if (result.status === 'pending') {
      const stats = await RequestQueue.getStats();
      return NextResponse.json({
        status: 'pending',
        queuePosition: Math.ceil(stats.queueSize / 2), // Rough estimate
        estimatedWaitTime: stats.averageWaitTime,
        message: 'Request is still being processed'
      }, { headers });
    }

    // Return completed result
    return NextResponse.json(result, { headers });

  } catch (error: any) {
    console.error('Status check error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to check request status',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500, headers }
    );
  }
}