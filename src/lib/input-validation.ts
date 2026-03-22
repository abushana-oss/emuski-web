import { z } from 'zod';
import { NextRequest } from 'next/server';

/**
 * OWASP-compliant Input Validation & Sanitization Library
 * 
 * This module provides comprehensive input validation schemas and sanitization
 * functions following OWASP guidelines for secure web applications.
 * 
 * Security Features:
 * - Schema-based validation with Zod
 * - XSS prevention through sanitization
 * - SQL injection prevention
 * - File upload validation
 * - Length limits to prevent buffer overflow attacks
 * - Type checking and format validation
 */

// Base security-focused validation schemas
export const SecuritySchemas = {
  // Safe string with XSS protection
  safeString: z.string()
    .min(1, 'Required')
    .max(1000, 'Too long')
    .trim()
    .refine(val => !/<script|javascript:|data:|vbscript:/i.test(val), 'Potentially unsafe content'),

  // Email with strict validation
  email: z.string()
    .email('Invalid email format')
    .max(254, 'Email too long')
    .toLowerCase()
    .refine(val => !/[<>"'&]/.test(val), 'Invalid characters in email'),

  // Phone number (international format)
  phone: z.string()
    .min(7, 'Phone too short')
    .max(20, 'Phone too long')
    .refine(val => /^[\+]?[(]?[0-9\s\-\.\(\)]{7,20}$/.test(val), 'Invalid phone format'),

  // UUID validation
  uuid: z.string()
    .uuid('Invalid UUID format'),

  // File name validation (prevent path traversal)
  fileName: z.string()
    .min(1, 'File name required')
    .max(255, 'File name too long')
    .refine(val => !/[\/\\:*?"<>|]/.test(val), 'Invalid characters in filename')
    .refine(val => !val.includes('..'), 'Path traversal not allowed')
    .refine(val => !/^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i.test(val), 'Reserved filename'),

  // URL validation
  url: z.string()
    .url('Invalid URL format')
    .max(2048, 'URL too long')
    .refine(val => /^https?:\/\//.test(val), 'Only HTTP/HTTPS URLs allowed'),

  // Numeric validations
  positiveInteger: z.number().int().positive(),
  nonNegativeInteger: z.number().int().min(0),
  
  // Content validation for rich text
  richText: z.string()
    .max(10000, 'Content too long')
    .refine(val => {
      // Allow basic HTML tags but prevent dangerous ones
      const dangerousTags = /<(script|object|embed|link|style|meta|iframe|frame|frameset|base|form)/i;
      return !dangerousTags.test(val);
    }, 'Potentially unsafe HTML content'),
};

// Contact form validation schema
export const ContactFormSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name too long')
    .trim()
    .refine(val => !/<script|javascript:|data:|vbscript:/i.test(val), 'Potentially unsafe content'),
  
  email: SecuritySchemas.email,
  
  phone: SecuritySchemas.phone,
  
  requirements: z.string()
    .max(2000, 'Requirements too long')
    .refine(val => {
      const dangerousTags = /<(script|object|embed|link|style|meta|iframe|frame|frameset|base|form)/i;
      return !dangerousTags.test(val);
    }, 'Potentially unsafe HTML content')
    .optional(),
  
  recaptchaToken: z.string()
    .min(1, 'reCAPTCHA verification required')
    .max(1000, 'Invalid reCAPTCHA token'),
    
  // Optional file attachments validation
  attachments: z.array(z.object({
    name: SecuritySchemas.fileName,
    size: z.number().max(10 * 1024 * 1024, 'File too large (max 10MB)'),
    type: z.string().refine(
      val => /^(application\/pdf|image\/(jpeg|jpg|png|webp)|text\/plain)$/.test(val),
      'Invalid file type'
    )
  })).optional()
});

// Blog API validation schemas
export const BlogQuerySchema = z.object({
  blogId: z.string()
    .min(1, 'Required')
    .max(50, 'Blog ID too long')
    .trim()
    .refine(val => !/<script|javascript:|data:|vbscript:/i.test(val), 'Potentially unsafe content'),
  
  maxResults: z.string()
    .optional()
    .default('10')
    .refine(val => /^\d+$/.test(val), 'Must be a number')
    .transform(val => parseInt(val))
    .refine(val => val >= 1 && val <= 50, 'Results count must be 1-50'),
  
  label: z.string()
    .min(1, 'Required')
    .max(100, 'Label too long')
    .trim()
    .refine(val => !/<script|javascript:|data:|vbscript:/i.test(val), 'Potentially unsafe content')
    .optional(),
    
  pageToken: z.string()
    .min(1, 'Required')
    .max(200, 'Page token too long')
    .trim()
    .refine(val => !/<script|javascript:|data:|vbscript:/i.test(val), 'Potentially unsafe content')
    .optional()
});

// Analytics tracking validation
export const AnalyticsEventSchema = z.object({
  eventName: z.string()
    .min(1, 'Event name required')
    .max(40, 'Event name too long')
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, 'Invalid event name format'),
  
  eventParams: z.record(z.union([z.string(), z.number(), z.boolean()]))
    .refine(
      val => Object.keys(val).length <= 25,
      'Too many event parameters (max 25)'
    ),
  
  clientId: z.string()
    .min(1, 'Required')
    .max(255, 'Client ID too long')
    .trim()
    .refine(val => !/<script|javascript:|data:|vbscript:/i.test(val), 'Potentially unsafe content')
    .optional(),
    
  userId: SecuritySchemas.uuid.optional()
});

// File upload validation schema
export const FileUploadSchema = z.object({
  fileName: SecuritySchemas.fileName,
  
  fileSize: z.number()
    .positive('File size must be positive')
    .max(50 * 1024 * 1024, 'File too large (max 50MB)'),
  
  mimeType: z.string()
    .refine(
      val => /^(application\/(step|x-step|octet-stream|sla)|model\/(vnd\.collada\+xml|x3d\+xml|gltf\+json)|text\/plain)$/i.test(val),
      'Invalid file type for CAD upload'
    ),
    
  userId: SecuritySchemas.uuid
});

// DFM Analysis validation (enhanced)
export const DFMAnalysisSchema = z.object({
  message: z.string()
    .min(1, 'Message required')
    .max(500, 'Message too long')
    .trim()
    .refine(val => !/<script|javascript:|data:|vbscript:/i.test(val), 'Potentially unsafe content'),
  
  fileName: SecuritySchemas.fileName,
  
  userId: SecuritySchemas.uuid.optional(),
  
  geometryData: z.object({
    dimensions: z.object({
      length: SecuritySchemas.positiveInteger.optional(),
      width: SecuritySchemas.positiveInteger.optional(),
      height: SecuritySchemas.positiveInteger.optional(),
    }).optional(),
    volume: SecuritySchemas.positiveInteger.optional(),
    surfaceArea: SecuritySchemas.positiveInteger.optional(),
    features: z.any().optional()
  }).optional(),
  
  priority: z.enum(['high', 'normal', 'low']).default('normal')
});

/**
 * XSS Prevention - Sanitizes user input to prevent cross-site scripting attacks
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    // Remove HTML tags (basic sanitization)
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    // Encode dangerous characters
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    // Remove potentially dangerous protocols
    .replace(/(javascript|data|vbscript):/gi, '')
    .trim();
}

/**
 * SQL Injection Prevention - Sanitizes strings for database queries
 */
export function sanitizeSQLInput(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .replace(/['";\\]/g, '') // Remove SQL metacharacters
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove SQL block comments start
    .replace(/\*\//g, '') // Remove SQL block comments end
    .replace(/xp_/gi, '') // Remove SQL Server extended procedures
    .replace(/sp_/gi, '') // Remove SQL Server stored procedures
    .trim();
}

/**
 * Path Traversal Prevention - Validates and sanitizes file paths
 */
export function sanitizeFilePath(path: string): string | null {
  if (typeof path !== 'string') return null;
  
  // Remove or replace dangerous patterns
  const sanitized = path
    .replace(/\.\./g, '') // Remove parent directory references
    .replace(/[^a-zA-Z0-9\-_.]/g, '-') // Replace special characters
    .replace(/-+/g, '-') // Collapse multiple dashes
    .toLowerCase()
    .trim();
  
  // Validate result
  if (sanitized.length === 0 || sanitized.length > 255) return null;
  if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(sanitized)) return null;
  
  return sanitized;
}

/**
 * Request validation wrapper for API routes
 */
export async function validateRequest<T>(
  request: NextRequest,
  schema: z.ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    let body;
    
    // Handle different content types
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      body = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      body = Object.fromEntries(formData.entries());
    } else if (request.method === 'GET') {
      const { searchParams } = new URL(request.url);
      body = Object.fromEntries(searchParams.entries());
    } else {
      return { success: false, error: 'Unsupported content type' };
    }
    
    // Validate with schema
    const result = schema.safeParse(body);
    
    if (!result.success) {
      const errorDetails = result.error.errors
        .map(err => `${err.path.join('.')}: ${err.message}`)
        .join(', ');
      
      return { 
        success: false, 
        error: `Validation failed: ${errorDetails}` 
      };
    }
    
    return { success: true, data: result.data };
    
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Invalid request format' 
    };
  }
}

/**
 * Middleware wrapper for automatic request validation
 */
export function withInputValidation<T>(
  schema: z.ZodSchema<T>,
  handler: (req: NextRequest, data: T, context: any) => Promise<Response>
) {
  return async (req: NextRequest, context: any): Promise<Response> => {
    const validation = await validateRequest(req, schema);
    
    if (!validation.success) {
      return new Response(
        JSON.stringify({
          error: 'Invalid input',
          details: 'error' in validation ? validation.error : 'Unknown error'
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return handler(req, validation.data, context);
  };
}

/**
 * Content Security Policy for user-generated content
 */
export function validateUserContent(content: string): {
  isValid: boolean;
  sanitized: string;
  warnings: string[];
} {
  const warnings: string[] = [];
  let sanitized = content;
  
  // Check for potential XSS patterns
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /data:\s*text\/html/i
  ];
  
  for (const pattern of xssPatterns) {
    if (pattern.test(content)) {
      warnings.push('Potentially unsafe HTML content detected');
      break;
    }
  }
  
  // Sanitize content
  sanitized = sanitizeInput(content);
  
  // Length validation
  if (sanitized.length > 10000) {
    warnings.push('Content exceeds maximum length');
    sanitized = sanitized.substring(0, 10000);
  }
  
  return {
    isValid: warnings.length === 0,
    sanitized,
    warnings
  };
}