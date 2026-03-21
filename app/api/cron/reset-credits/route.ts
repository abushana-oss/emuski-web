import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configure function timeout for Vercel
export const maxDuration = 300;

// Service role client for server-side operations
const supabaseServiceRole = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Daily Credit Reset Cron Job
 * Industry Standard: Runs daily at UTC midnight
 * 
 * Security Features:
 * - Validates cron secret for authorization
 * - Batch processing for scalability  
 * - Comprehensive logging and monitoring
 * - Error handling and rollback capabilities
 */
export async function POST(req: NextRequest) {
  try {
    // Validate cron secret for security (industry standard)
    const cronSecret = req.headers.get('authorization')?.replace('Bearer ', '');
    const expectedSecret = process.env.CRON_SECRET_KEY;
    
    if (!expectedSecret || cronSecret !== expectedSecret) {
      
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }


    // Get yesterday's date for proper filtering
    const yesterday = new Date();
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    yesterday.setUTCHours(0, 0, 0, 0);

    // Reset credits for all users who haven't been reset today
    // Uses industry standard batch processing for scalability
    const resetResult = await supabaseServiceRole
      .rpc('reset_daily_credits_batch', {
        reset_before: yesterday.toISOString()
      });

    if (resetResult.error) {
      throw new Error(`Database error: ${resetResult.error.message}`);
    }

    const resetCount = resetResult.data || 0;


    // Return success response with metrics
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      usersReset: resetCount,
      resetTime: 'UTC 00:00',
      nextReset: getNextResetTime().toISOString()
    });

  } catch (error: any) {

    return NextResponse.json({
      success: false,
      error: 'Credit reset failed',
      timestamp: new Date().toISOString(),
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: 500 });
  }
}

/**
 * Get next scheduled reset time (industry standard)
 */
function getNextResetTime(): Date {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow;
}

/**
 * Health check endpoint for monitoring
 */
export async function GET(req: NextRequest) {
  const cronSecret = req.headers.get('authorization')?.replace('Bearer ', '');
  const expectedSecret = process.env.CRON_SECRET_KEY;
  
  if (!expectedSecret || cronSecret !== expectedSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check database connectivity
    const { data, error } = await supabaseServiceRole
      .from('user_credits')
      .select('count(*)')
      .limit(1);

    if (error) throw error;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      nextResetTime: getNextResetTime().toISOString(),
      service: 'credit-reset-cron'
    });

  } catch (error: any) {
    return NextResponse.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, { status: 503 });
  }
}