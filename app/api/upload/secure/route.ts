import { NextRequest, NextResponse } from 'next/server';
import { validateCADFile, generateSecureFileName, scanFileContent, checkUploadRateLimit } from '@/lib/file-security';
import { getUploadSecurityHeaders, logSecurityEvent } from '@/lib/security-headers';
import { supabase } from '@/lib/supabase';
import { authenticateRequest } from '@/lib/jwt-auth';

const SECURITY_HEADERS = getUploadSecurityHeaders();

export async function POST(req: NextRequest) {
  const headers = new Headers(SECURITY_HEADERS);
  const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = req.headers.get('user-agent') || 'unknown';

  let userId: string | undefined;
  try {
    // Verify authentication using JWT (standardized approach)
    const authHeader = req.headers.get('authorization');
    const authResult = await authenticateRequest(authHeader);
    
    if (!authResult.valid || !authResult.userId) {
      return NextResponse.json(
        { error: 'Valid authentication required for file uploads' },
        { status: 401, headers }
      );
    }
    
    userId = authResult.userId;

    // Rate limiting check
    if (!checkUploadRateLimit(userId, 10, 3600000)) { // 10 uploads per hour
      logSecurityEvent({
        type: 'rate_limit',
        severity: 'medium',
        userId,
        ip: clientIP,
        userAgent,
        details: { endpoint: '/api/upload/secure', limit: '10/hour' },
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { error: 'Upload rate limit exceeded. Please try again later.' },
        { status: 429, headers }
      );
    }

    // Parse multipart form data
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400, headers }
      );
    }

    // Comprehensive file validation
    const validationResult = await validateCADFile(file);
    
    if (!validationResult.isValid) {
      logSecurityEvent({
        type: 'malicious_file',
        severity: validationResult.securityScore < 30 ? 'high' : 'medium',
        userId,
        ip: clientIP,
        userAgent,
        details: {
          fileName: file.name,
          fileSize: file.size,
          error: validationResult.error,
          securityScore: validationResult.securityScore,
          warnings: validationResult.warnings,
        },
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { 
          error: validationResult.error,
          securityScore: validationResult.securityScore,
          warnings: validationResult.warnings 
        },
        { status: 400, headers }
      );
    }

    // Content scanning for additional security
    const contentScan = await scanFileContent(file);
    if (!contentScan.isSafe) {
      logSecurityEvent({
        type: 'malicious_file',
        severity: 'high',
        userId,
        ip: clientIP,
        userAgent,
        details: {
          fileName: file.name,
          threats: contentScan.threats,
          stage: 'content_scan',
        },
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { 
          error: 'File failed security scan',
          threats: contentScan.threats 
        },
        { status: 400, headers }
      );
    }

    // Generate secure file name
    const secureFileName = generateSecureFileName(file.name, userId);
    
    // Convert File to ArrayBuffer for Supabase upload
    const fileBuffer = await file.arrayBuffer();
    
    // Upload to Supabase Storage with security metadata
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('cad-files')
      .upload(secureFileName, fileBuffer, {
        contentType: file.type,
        metadata: {
          originalName: file.name,
          userId,
          uploadTime: new Date().toISOString(),
          securityScore: validationResult.securityScore.toString(),
          validated: 'true',
          clientIP,
        },
      });

    if (uploadError) {
      return NextResponse.json(
        { error: 'Upload failed. Please try again.' },
        { status: 500, headers }
      );
    }


    // Generate signed URL for private bucket access (valid for 1 hour)
    const { data: urlData, error: urlError } = await supabase.storage
      .from('cad-files')
      .createSignedUrl(secureFileName, 3600); // 1 hour expiry
      
    if (urlError) {
      return NextResponse.json(
        { error: 'Failed to generate file access URL. Please try again.' },
        { status: 500, headers }
      );
    }

    return NextResponse.json({
      success: true,
      fileName: secureFileName,
      originalName: file.name,
      fileUrl: urlData.signedUrl,
      securityScore: validationResult.securityScore,
      size: file.size,
      uploadedAt: new Date().toISOString(),
      warnings: validationResult.warnings,
    }, { headers });

  } catch (error: any) {
    
    logSecurityEvent({
      type: 'suspicious_activity',
      severity: 'medium',
      userId: userId,
      ip: clientIP,
      userAgent,
      details: {
        endpoint: '/api/upload/secure',
        error: error.message,
      },
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: 'Upload processing failed' },
      { status: 500, headers }
    );
  }
}

// Health check endpoint
export async function GET() {
  const headers = new Headers(SECURITY_HEADERS);
  
  return NextResponse.json({
    status: 'operational',
    service: 'Secure File Upload API',
    security: {
      fileValidation: 'enabled',
      contentScanning: 'enabled',
      rateLimiting: 'enabled',
      authentication: 'required',
    },
    limits: {
      maxFileSize: '100MB',
      allowedTypes: ['STEP', 'IGES', 'STL', 'OBJ'],
      uploadRate: '10 files per hour per user',
    },
    timestamp: new Date().toISOString(),
  }, { headers });
}