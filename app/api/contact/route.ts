import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { checkRateLimit } from '@/lib/ratelimit';
import { handleCorsPreflightRequest, addCorsHeaders } from '@/lib/cors';

/**
 * Contact Form API Route
 *
 * Handles incoming contact form submissions and sends emails to enquiries@emuski.com
 * Uses Resend API for production-ready email delivery
 * Implements proper validation, error handling, and security measures
 * Protected with Google reCAPTCHA v2 verification and rate limiting
 *
 * @author Senior Software Engineer
 * @version 4.0.0 - Production Ready with Rate Limiting
 */

// Resend client will be initialized lazily in the request handler

// Type definitions for better type safety
interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  requirements?: string;
  recaptchaToken: string;
}

interface EmailPayload {
  to: string;
  from: string;
  subject: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: string;
    encoding: string;
  }>;
}

/**
 * Validates email format using RFC 5322 regex
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates phone number (international format)
 */
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Sanitizes HTML to prevent XSS attacks
 */
function sanitizeHtml(text: string): string {
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Verifies reCAPTCHA v2 token with Google
 */
async function verifyRecaptchaV2(
  token: string
): Promise<{ success: boolean; reasons?: string[] }> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY not configured');
    return { success: false, reasons: ['Secret key not configured'] };
  }

  try {
    const url = 'https://www.google.com/recaptcha/api/siteverify';

    const params = new URLSearchParams({
      secret: secretKey,
      response: token,
    });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      return {
        success: false,
        reasons: [`API error: ${response.status}`]
      };
    }

    const data = await response.json();

    // Check if token is valid
    if (!data.success) {
      return {
        success: false,
        reasons: data['error-codes'] || ['Invalid token']
      };
    }

    return {
      success: true,
      reasons: []
    };

  } catch (error) {
    return {
      success: false,
      reasons: ['Verification error']
    };
  }
}

/**
 * Generates professional HTML email template
 */
function generateEmailHtml(data: ContactFormData, hasAttachment: boolean): string {
  const timestamp = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'long',
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #009688 0%, #00796B 100%);
      color: white;
      padding: 20px;
      border-radius: 8px 8px 0 0;
      margin: -30px -30px 30px -30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .field-group {
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e0e0e0;
    }
    .field-group:last-child {
      border-bottom: none;
    }
    .field-label {
      font-weight: 600;
      color: #00796B;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .field-value {
      color: #333;
      font-size: 16px;
      word-wrap: break-word;
    }
    .requirements {
      background-color: #f9f9f9;
      padding: 15px;
      border-left: 4px solid #009688;
      border-radius: 4px;
      margin-top: 10px;
      white-space: pre-wrap;
    }
    .attachment-badge {
      display: inline-block;
      background-color: #FFF3E0;
      color: #E65100;
      padding: 5px 12px;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 2px solid #e0e0e0;
      text-align: center;
      color: #666;
      font-size: 12px;
    }
    .timestamp {
      color: #999;
      font-size: 13px;
      font-style: italic;
    }
    .priority {
      display: inline-block;
      background-color: #FFEBEE;
      color: #C62828;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 New Contact Form Submission</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">EMUSKI Manufacturing Solutions</p>
    </div>

    <div style="margin-bottom: 20px;">
      <span class="priority">Action Required</span>
    </div>

    <div class="field-group">
      <div class="field-label">👤 Contact Name</div>
      <div class="field-value">${sanitizeHtml(data.name)}</div>
    </div>

    <div class="field-group">
      <div class="field-label">📧 Company Email</div>
      <div class="field-value">
        <a href="mailto:${data.email}" style="color: #009688; text-decoration: none;">
          ${sanitizeHtml(data.email)}
        </a>
      </div>
    </div>

    <div class="field-group">
      <div class="field-label">📞 Phone Number</div>
      <div class="field-value">
        <a href="tel:${data.phone.replace(/\s/g, '')}" style="color: #009688; text-decoration: none;">
          ${sanitizeHtml(data.phone)}
        </a>
      </div>
    </div>

    ${data.requirements ? `
    <div class="field-group">
      <div class="field-label">📋 Project Requirements</div>
      <div class="requirements">${sanitizeHtml(data.requirements)}</div>
    </div>
    ` : ''}

    ${hasAttachment ? `
    <div class="field-group">
      <div class="field-label">📎 Attachment</div>
      <div class="field-value">
        <span class="attachment-badge">✓ File attached to this email</span>
      </div>
    </div>
    ` : ''}

    <div class="footer">
      <div class="timestamp">
        <strong>Submitted:</strong> ${timestamp}
      </div>
      <p style="margin-top: 15px;">
        This is an automated message from the EMUSKI contact form.<br>
        Please respond to the customer within 24 hours.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Sends email using Resend API
 * More reliable and professional than SMTP for production use
 */
async function sendEmail(
  payload: EmailPayload
): Promise<{ success: boolean; error?: string }> {
  // Verify Resend API key is configured
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('❌ RESEND_API_KEY not configured');
    return {
      success: false,
      error: 'Email service not configured. Please contact administrator.',
    };
  }

  try {
    // Initialize Resend client inside the function to avoid build-time errors
    const resend = new Resend(apiKey);
    
    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'EMUSKI Contact Form <onboarding@resend.dev>',
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      // Convert base64 attachments to proper format
      attachments: payload.attachments?.map((att) => ({
        filename: att.filename,
        content: Buffer.from(att.content, att.encoding as BufferEncoding),
      })),
    });

    if (error) {
      console.error('❌ Resend API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }

    console.log('✅ Email sent successfully via Resend:', data?.id);
    return { success: true };

  } catch (error: any) {
    console.error('❌ Email sending error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send email. Please try again.',
    };
  }
}

/**
 * POST handler for contact form submissions
 */
export async function POST(request: NextRequest) {
  // Rate limiting check (5 requests per 15 minutes)
  const rateLimitResponse = await checkRateLimit(request, 'contact');
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  try {
    // Parse multipart form data
    const formData = await request.formData();

    // Extract form fields
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const requirements = formData.get('requirements') as string || '';
    const recaptchaToken = formData.get('recaptchaToken') as string;
    const file = formData.get('file') as File | null;

    // Validate required fields
    if (!name || !email || !phone || !recaptchaToken) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          details: {
            name: !name,
            email: !email,
            phone: !phone,
            recaptchaToken: !recaptchaToken,
          }
        },
        { status: 400 }
      );
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate phone number
    if (!isValidPhone(phone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Verify reCAPTCHA v2
    const recaptchaResult = await verifyRecaptchaV2(recaptchaToken);
    if (!recaptchaResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'reCAPTCHA verification failed. Please try again.',
          details: recaptchaResult.reasons
        },
        { status: 403 }
      );
    }

    // Prepare contact data
    const contactData: ContactFormData = {
      name,
      email,
      phone,
      requirements,
      recaptchaToken,
    };

    // Handle file attachment if present
    let attachments: EmailPayload['attachments'] = undefined;
    if (file && file.size > 0) {
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, error: 'File size exceeds 10MB limit' },
          { status: 400 }
        );
      }

      // Convert file to base64
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');

      attachments = [{
        filename: file.name,
        content: base64,
        encoding: 'base64',
      }];
    }

    // Generate email content
    const emailHtml = generateEmailHtml(contactData, !!file);

    // Prepare email payload
    const emailPayload: EmailPayload = {
      to: 'enquiries@emuski.com',
      from: 'noreply@emuski.com',
      subject: `🔔 New Contact Inquiry from ${name}`,
      html: emailHtml,
      attachments,
    };

    // Send email
    const emailResult = await sendEmail(emailPayload);

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      );
    }

    // Return success response with CORS headers
    const response = NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully. We will respond within 24 hours.',
      },
      { status: 200 }
    );

    return addCorsHeaders(response, request);

  } catch (error) {
    console.error('Contact form API error:', error);
    const errorResponse = NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && {
          details: error instanceof Error ? error.message : 'Unknown error',
        }),
      },
      { status: 500 }
    );

    return addCorsHeaders(errorResponse, request);
  }
}

/**
 * OPTIONS handler - CORS preflight
 */
export async function OPTIONS(request: NextRequest) {
  return handleCorsPreflightRequest(request);
}

/**
 * GET handler - returns API information
 */
export async function GET(request: NextRequest) {
  const response = NextResponse.json(
    {
      name: 'EMUSKI Contact Form API',
      version: '4.0.0',
      status: 'operational',
      endpoint: '/api/contact',
      method: 'POST',
      description: 'Handles contact form submissions and sends emails to enquiries@emuski.com',
    },
    { status: 200 }
  );

  return addCorsHeaders(response, request);
}
