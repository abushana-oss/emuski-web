import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest } from '@/lib/jwt-auth';
import { getServerS3Config } from '@/lib/supabase';
import { validateRequest } from '@/lib/input-validation';
import { withRateLimit } from '@/lib/rate-limiter';
import { withSecurity } from '@/lib/security-middleware';

// Input validation schema
const SignedUrlSchema = z.object({
  fileName: z.string().min(1).max(255).regex(/^[a-zA-Z0-9._-]+$/),
  fileType: z.string().regex(/^[a-zA-Z0-9\/.-]+$/),
  fileSize: z.number().min(1).max(100 * 1024 * 1024), // 100MB max
});

async function handleSignedUrl(req: NextRequest) {
  try {
    // Verify authentication
    const authHeader = req.headers.get('authorization');
    const authResult = await authenticateRequest(authHeader);
    
    if (!authResult.valid || !authResult.userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate request
    const validation = await validateRequest(req, SignedUrlSchema);
    if (!validation.success) {
      const errorMsg = 'error' in validation ? validation.error : 'Invalid request';
      return NextResponse.json(
        { error: 'Invalid request data', details: errorMsg },
        { status: 400 }
      );
    }

    const { fileName, fileType, fileSize } = validation.data;

    // Get server-side S3 configuration
    const s3Config = getServerS3Config();

    // Generate secure file name with user ID and timestamp
    const timestamp = Date.now();
    const secureFileName = `${authResult.userId}/${timestamp}-${fileName}`;

    // Generate presigned URL (this would typically use AWS SDK)
    // For now, we'll return a placeholder structure
    const presignedUrl = generatePresignedUrl(s3Config, secureFileName, fileType);

    return NextResponse.json({
      success: true,
      presignedUrl,
      fileName: secureFileName,
      expiresIn: 3600, // 1 hour
    });

  } catch (error) {
    console.error('S3 signed URL error:', error);
    return NextResponse.json(
      { error: 'Failed to generate signed URL' },
      { status: 500 }
    );
  }
}

// Mock function for presigned URL generation
// In production, you would use the AWS SDK
function generatePresignedUrl(s3Config: any, fileName: string, fileType: string): string {
  // This is a placeholder - implement actual AWS SDK logic here
  return `${s3Config.UPLOAD_URL}${fileName}?signature=secure_signature&expires=3600`;
}

// Apply security middleware and rate limiting
export const POST = withSecurity(
  withRateLimit(handleSignedUrl, '/api/s3/signed-url')
);