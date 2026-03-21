import { NextRequest, NextResponse } from 'next/server';
import { callClaudeWithRetry, DFM_SYSTEM_PROMPT, buildDFMPrompt } from '@/lib/claude-client';
import { CreditsManager } from '@/lib/credits-manager';
import { RequestQueue } from '@/lib/request-queue';
import { withSecurity, SECURITY_CONFIGS } from '@/lib/security-middleware';
import { ErrorHandler } from '@/lib/error-handler';
import crypto from 'crypto';
import { z } from 'zod';
import { CacheAPI, withCacheMetrics } from '@/lib/cache';

// DFM Analysis endpoint security configuration

// Input validation schema
const DFMRequestSchema = z.object({
  message: z.string().min(1).max(500).trim(),
  fileName: z.string().min(1).max(100).trim(),
  userId: z.string().uuid().optional(),
  geometryData: z.object({
    dimensions: z.object({
      length: z.number().positive().optional(),
      width: z.number().positive().optional(),
      height: z.number().positive().optional(),
    }).optional(),
    volume: z.number().positive().optional(),
    surfaceArea: z.number().positive().optional(),
    features: z.any().optional()
  }).optional(),
  priority: z.enum(['high', 'normal', 'low']).default('normal')
});

// DFM Analysis handler with enterprise security
async function dfmAnalysisHandler(req: NextRequest): Promise<NextResponse> {

  try {
    // Parse and validate request body
    let body;
    try {
      body = await req.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON format in request body' },
        { status: 400 }
      );
    }

    // Validate input using Zod schema
    const validationResult = DFMRequestSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Invalid request data', 
          details: validationResult.error.errors.map(e => `${e.path.join('.')}: ${e.message}`) 
        },
        { status: 400 }
      );
    }

    const { message, geometryData, fileName, userId, priority } = validationResult.data;

    // Get user ID from authenticated request (set by security middleware)
    const userIdentifier = (req as any).userId || userId || req.headers.get('x-user-id');
    
    if (!userIdentifier || userIdentifier === 'anonymous') {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to use DFM analysis.' },
        { status: 401 }
      );
    }

    // Check API key configuration
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'AI service not configured. Please contact support.' },
        { status: 500 }
      );
    }

    // Rate limiting handled by security middleware

    // Estimate tokens for credit check
    const estimatedTokens = CreditsManager.estimateTokens(message, geometryData);

    // Check user credits (authentication is required)
    let creditInfo = null;
      try {
        // Add timeout to credit check to prevent hanging
        const creditTimeout = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Credit check timeout')), 5000)
        );
        
        creditInfo = await Promise.race([
          CreditsManager.checkCredits(userIdentifier, estimatedTokens),
          creditTimeout
        ]);
        
        if (!creditInfo.hasCredits) {
          return NextResponse.json(
            {
              error: 'Insufficient credits',
              creditsRequired: creditInfo.creditsRequired,
              creditsRemaining: creditInfo.creditsRemaining,
              timeUntilReset: Math.ceil(creditInfo.timeUntilReset),
              message: `You need ${creditInfo.creditsRequired} credits but only have ${creditInfo.creditsRemaining} remaining. Credits reset in ${Math.ceil(creditInfo.timeUntilReset)} hours.`
            },
            { status: 402 }
          );
        }
      } catch (error) {
        // Don't block the request - proceed with analysis but warn about credit system
        creditInfo = null; // Will proceed without credit tracking
      }

    // Check cache using new enterprise caching system
    const dfmRequest = {
      message,
      fileName,
      geometryData,
      analysisType: 'standard' as const,
      materialType: undefined,
      quantity: undefined
    };

    // Create cache key from request data
    const cacheKey = `dfm_analysis:${userIdentifier}:${fileName}:${crypto
      .createHash('md5')
      .update(JSON.stringify({ message, geometryData }))
      .digest('hex')}`;

    const cachedResponse = await CacheAPI.getDFMAnalysis(cacheKey);
    if (cachedResponse) {
      return NextResponse.json({
        content: cachedResponse,
        metadata: {
          model: 'claude-sonnet-4-20250514',
          timestamp: new Date().toISOString(),
          cached: true,
          estimatedTokens,
          creditsUsed: 0 // Cached responses are free
        }
      });
    }

    // Check if should process immediately or queue
    const shouldProcessImmediately = await RequestQueue.shouldProcessImmediately(userIdentifier);
    
    if (!shouldProcessImmediately) {
      // Queue the request for processing
      try {
        const requestId = await RequestQueue.enqueue({
          userId: userIdentifier,
          message,
          geometryData,
          fileName,
          priority: priority || 'normal',
          estimatedTokens
        });

        return NextResponse.json({
          queued: true,
          requestId,
          estimatedWaitTime: Math.ceil(estimatedTokens / 1000 * 2), // Rough estimate
          message: 'Request queued for processing. Use the request ID to check status.',
          checkStatusUrl: `/api/dfm-analysis/status/${requestId}`
        });
      } catch (queueError: any) {
        if (queueError.message === 'Queue not available - process immediately') {
          // Fall through to immediate processing
        } else {
          return NextResponse.json(
            { error: queueError.message },
            { status: 503 }
          );
        }
      }
    }

    // Build DFM analysis prompt
    const analysisPrompt = buildDFMPrompt(message, geometryData, fileName);

    // Wrap Claude API call with metrics tracking
    const processAnalysis = withCacheMetrics(async () => {
      return await callClaudeWithRetry(DFM_SYSTEM_PROMPT, analysisPrompt);
    }, 'dfm_analysis');

    
    const startTime = Date.now();
    const response = await processAnalysis();
    const processingTime = Date.now() - startTime;

    // Validate response content
    if (!response || response.length < 50) {
      throw new Error('AI response too short or empty');
    }

    // Deduct credits (user is authenticated)
    if (creditInfo) {
      try {
        await CreditsManager.deductCredits(
          userIdentifier, // Use userIdentifier instead of userId
          estimatedTokens,
          'dfm_analysis',
          fileName
        );
      } catch (error) {
        // Continue - don't block successful response for credit issues
      }
    }


    // Cache response using enterprise caching system
    try {
      await CacheAPI.cacheDFMAnalysis(cacheKey, response, 3600); // 1 hour TTL
    } catch (error) {
    }

    return NextResponse.json({
      content: response,
      metadata: {
        model: 'claude-sonnet-4-20250514',
        timestamp: new Date().toISOString(),
        cached: false,
        processingTime,
        estimatedTokens,
        creditsUsed: creditInfo ? creditInfo.creditsRequired : 0,
        creditsRemaining: creditInfo ? (creditInfo.creditsRemaining - creditInfo.creditsRequired) : null
      }
    });
  } catch (error: any) {

    // Handle specific API errors
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'AI service authentication failed. Please contact support.' },
        { status: 503 }
      );
    }

    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'AI service is currently busy. Please try again in a moment.' },
        { status: 503 }
      );
    }

    if (error?.status === 400) {
      return NextResponse.json(
        { error: 'Invalid request format. Please check your input and try again.' },
        { status: 400 }
      );
    }

    // Generic error response
    return NextResponse.json(
      { 
        error: 'Unable to complete analysis. Please try again or contact support if the problem persists.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Export secured endpoint with DFM analysis security configuration
export const POST = withSecurity(dfmAnalysisHandler, SECURITY_CONFIGS.DFM_ANALYSIS)

// Health check endpoint
export async function GET() {
  try {
    // Simple health check - verify API key is configured
    const isConfigured = !!process.env.ANTHROPIC_API_KEY;
    
    return NextResponse.json({
      status: 'ok',
      service: 'DFM Analysis API',
      configured: isConfigured,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: 'Service unavailable' },
      { status: 500 }
    );
  }
}