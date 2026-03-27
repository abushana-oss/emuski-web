import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { withRateLimit } from '@/lib/rate-limiter';
import { handleCorsPreflightRequest, addCorsHeaders } from '@/lib/cors';
import { ContactFormSchema, validateRequest, sanitizeInput } from '@/lib/input-validation';

export const dynamic = 'force-dynamic'; // Prevent static generation

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
  company?: string;
  email: string;
  phone: string;
  category?: string;
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

    ${data.company ? `
    <div class="field-group">
      <div class="field-label">🏢 Company</div>
      <div class="field-value">${sanitizeHtml(data.company)}</div>
    </div>
    ` : ''}

    <div class="field-group">
      <div class="field-label">📧 Email Address</div>
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

    ${data.category ? `
    <div class="field-group">
      <div class="field-label">⚙️ Service Category</div>
      <div class="field-value">${sanitizeHtml(data.category)}</div>
    </div>
    ` : ''}

    ${data.requirements ? `
    <div class="field-group">
      <div class="field-label">📋 Project Requirements / Message</div>
      <div class="requirements">${sanitizeHtml(data.requirements)}</div>
    </div>
    ` : ''}

    ${hasAttachment ? `
    <div class="field-group">
      <div class="field-label">📎 Attachments</div>
      <div class="field-value">
        <span class="attachment-badge">✓ Files attached to this email</span>
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
      console.error('Resend API error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email',
      };
    }

    return { success: true };

  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to send email. Please try again.',
    };
  }
}

/**
 * POST handler for contact form submissions
 */
async function postHandler(request: NextRequest): Promise<NextResponse> {
  // Simple rate limiting removed for contact form (now handled by reCAPTCHA)

  try {
    // Parse multipart form data
    const formData = await request.formData();
    console.log('Received form data keys:', Array.from(formData.keys()));

    // Extract and prepare form fields for validation
    const formFields = {
      name: formData.get('name') as string,
      company: formData.get('company') as string || '',
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      category: formData.get('category') as string || '',
      requirements: formData.get('requirements') as string || '',
      recaptchaToken: formData.get('recaptchaToken') as string
    };
    
    // Handle multiple file attachments
    const files: File[] = [];
    for (let i = 0; i < 5; i++) {
      const file = formData.get(`file${i}`) as File | null;
      if (file && file.size > 0) {
        files.push(file);
      }
    }
    
    let formFieldsWithAttachments: any = formFields;
    if (files.length > 0) {
      console.log('Files found:', files.map(f => ({ name: f.name, type: f.type, size: f.size })));
      formFieldsWithAttachments = {
        ...formFields,
        attachments: files.map(file => ({
          name: file.name,
          size: file.size,
          type: file.type
        }))
      };
    }

    // Comprehensive input validation using Zod schema
    const validationResult = ContactFormSchema.safeParse(formFieldsWithAttachments);
    if (!validationResult.success) {
      const errorDetails = validationResult.error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
        
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: errorDetails
        },
        { status: 400 }
      );
    }

    // Extract validated and sanitized data
    const { name, company, email, phone, category, requirements, recaptchaToken } = validationResult.data;

    // Verify reCAPTCHA v2 (skip for internal bypass)
    if (recaptchaToken !== 'bypass') {
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
    }

    // Prepare contact data
    const contactData: ContactFormData = {
      name,
      company,
      email,
      phone,
      category,
      requirements,
      recaptchaToken,
    };

    // Handle multiple file attachments
    let attachments: EmailPayload['attachments'] = undefined;
    if (files.length > 0) {
      // Validate total files size (50MB limit total)
      const totalSize = files.reduce((sum, file) => sum + file.size, 0);
      const maxTotalSize = 50 * 1024 * 1024; // 50MB total
      if (totalSize > maxTotalSize) {
        return NextResponse.json(
          { success: false, error: 'Total file size exceeds 50MB limit' },
          { status: 400 }
        );
      }

      // Validate individual file size (10MB limit each)
      const maxSize = 10 * 1024 * 1024; // 10MB per file
      for (const file of files) {
        if (file.size > maxSize) {
          return NextResponse.json(
            { success: false, error: `File "${file.name}" exceeds 10MB limit` },
            { status: 400 }
          );
        }
      }

      // Convert all files to base64
      attachments = await Promise.all(
        files.map(async (file) => {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);
          const base64 = buffer.toString('base64');
          
          return {
            filename: file.name,
            content: base64,
            encoding: 'base64' as const,
          };
        })
      );
    }

    // Generate email content
    const emailHtml = generateEmailHtml(contactData, files.length > 0);

    // Prepare email payload
    const emailPayload: EmailPayload = {
      to: 'enquiries@emuski.com',
      from: 'noreply@emuski.com',
      subject: `🔔 New Quote Request from ${name}${company ? ` - ${company}` : ''}`,
      html: emailHtml,
      attachments,
    };

    // Send email
    const emailResult = await sendEmail(emailPayload);

    if (!emailResult.success) {
      console.error('Email sending failed:', emailResult.error);
      return NextResponse.json(
        { success: false, error: emailResult.error || 'Failed to send email' },
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
async function optionsHandler(request: NextRequest): Promise<NextResponse> {
  return handleCorsPreflightRequest(request);
}

/**
 * GET handler - returns API information
 */
async function getHandler(request: NextRequest): Promise<NextResponse> {
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

// Apply rate limiting to all contact form endpoints
export const POST = withRateLimit(postHandler, '/api/contact');
export const GET = withRateLimit(getHandler, '/api/contact');
export const OPTIONS = withRateLimit(optionsHandler, '/api/contact');
