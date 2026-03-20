/**
 * Enterprise-grade file security validation system
 * Implements secure file upload practices and validation
 */

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  securityScore: number; // 0-100, higher is safer
  warnings: string[];
}

export interface FileSignature {
  extension: string;
  mimeType: string;
  magicNumbers: number[][];
  maxSize: number; // in bytes
}

// Secure file type definitions with magic number validation
export const SECURE_CAD_FILE_TYPES: Record<string, FileSignature> = {
  'step': {
    extension: '.step',
    mimeType: 'application/step',
    magicNumbers: [
      [0x49, 0x53, 0x4F, 0x2D, 0x31, 0x30, 0x33, 0x30, 0x33], // ISO-10303
    ],
    maxSize: 100 * 1024 * 1024, // 100MB
  },
  'stp': {
    extension: '.stp',
    mimeType: 'application/step',
    magicNumbers: [
      [0x49, 0x53, 0x4F, 0x2D, 0x31, 0x30, 0x33, 0x30, 0x33], // ISO-10303
    ],
    maxSize: 100 * 1024 * 1024,
  },
  'iges': {
    extension: '.iges',
    mimeType: 'application/iges',
    magicNumbers: [
      [0x53, 0x54, 0x41, 0x52, 0x54], // START
    ],
    maxSize: 100 * 1024 * 1024,
  },
  'igs': {
    extension: '.igs',
    mimeType: 'application/iges',
    magicNumbers: [
      [0x53, 0x54, 0x41, 0x52, 0x54], // START
    ],
    maxSize: 100 * 1024 * 1024,
  },
  'stl': {
    extension: '.stl',
    mimeType: 'model/stl',
    magicNumbers: [
      [0x73, 0x6F, 0x6C, 0x69, 0x64], // solid (ASCII STL)
      [0x80, 0x00, 0x00, 0x00], // Binary STL header pattern
    ],
    maxSize: 50 * 1024 * 1024, // 50MB
  },
  'obj': {
    extension: '.obj',
    mimeType: 'model/obj',
    magicNumbers: [
      [0x23], // # (OBJ files start with comments)
      [0x76], // v (vertex definition)
      [0x6F], // o (object definition)
    ],
    maxSize: 50 * 1024 * 1024,
  },
};

/**
 * Validates file against magic number signatures
 */
export function validateFileSignature(file: File, expectedType: string): Promise<boolean> {
  return new Promise((resolve) => {
    const fileSignature = SECURE_CAD_FILE_TYPES[expectedType.toLowerCase()];
    if (!fileSignature) {
      resolve(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      if (!arrayBuffer) {
        resolve(false);
        return;
      }

      const bytes = new Uint8Array(arrayBuffer.slice(0, 512)); // Check first 512 bytes
      
      // Check against all possible magic numbers for this file type
      const isValid = fileSignature.magicNumbers.some(magicNumber => {
        return magicNumber.every((byte, index) => bytes[index] === byte);
      });

      resolve(isValid);
    };

    reader.onerror = () => resolve(false);
    reader.readAsArrayBuffer(file.slice(0, 512));
  });
}

/**
 * Comprehensive file validation with security scoring
 */
export async function validateCADFile(file: File): Promise<FileValidationResult> {
  const result: FileValidationResult = {
    isValid: false,
    securityScore: 0,
    warnings: []
  };

  // Basic file validation
  if (!file || file.size === 0) {
    result.error = 'File is empty or invalid';
    return result;
  }

  // Extract file extension
  const fileName = file.name.toLowerCase();
  const extension = fileName.split('.').pop() || '';
  
  // Check if file type is allowed
  const fileSignature = SECURE_CAD_FILE_TYPES[extension];
  if (!fileSignature) {
    result.error = `File type .${extension} is not supported. Allowed types: ${Object.keys(SECURE_CAD_FILE_TYPES).join(', ')}`;
    return result;
  }

  // File size validation
  if (file.size > fileSignature.maxSize) {
    result.error = `File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds maximum allowed size (${(fileSignature.maxSize / (1024 * 1024)).toFixed(2)}MB)`;
    return result;
  }

  // MIME type validation
  if (file.type && file.type !== fileSignature.mimeType && file.type !== 'application/octet-stream') {
    result.warnings.push(`MIME type mismatch: expected ${fileSignature.mimeType}, got ${file.type}`);
    result.securityScore -= 20;
  }

  // Magic number validation
  const signatureValid = await validateFileSignature(file, extension);
  if (!signatureValid) {
    result.error = 'File signature validation failed. File may be corrupted or not a valid CAD file.';
    return result;
  }

  // File name validation
  if (!isSecureFileName(fileName)) {
    result.error = 'File name contains invalid characters. Use only letters, numbers, hyphens, and underscores.';
    return result;
  }

  // Calculate security score
  result.securityScore = calculateSecurityScore(file, fileSignature, result.warnings);
  
  // File is valid if score is above threshold
  if (result.securityScore >= 60) {
    result.isValid = true;
  } else {
    result.error = 'File failed security validation. Please ensure it\'s a valid, unmodified CAD file.';
  }

  return result;
}

/**
 * Validates file name for security
 */
function isSecureFileName(fileName: string): boolean {
  // Only allow alphanumeric, hyphens, underscores, and dots
  const secureNamePattern = /^[a-zA-Z0-9._-]+$/;
  
  // Prevent path traversal
  if (fileName.includes('..') || fileName.includes('/') || fileName.includes('\\')) {
    return false;
  }
  
  // Prevent extremely long names
  if (fileName.length > 255) {
    return false;
  }
  
  // Check against secure pattern
  return secureNamePattern.test(fileName);
}

/**
 * Calculates security score based on various factors
 */
function calculateSecurityScore(file: File, signature: FileSignature, warnings: string[]): number {
  let score = 100;
  
  // Deduct for warnings
  score -= warnings.length * 10;
  
  // Deduct for large files (higher risk)
  const sizeRatio = file.size / signature.maxSize;
  if (sizeRatio > 0.8) score -= 20;
  else if (sizeRatio > 0.5) score -= 10;
  
  // Deduct for suspicious file names
  const suspiciousPatterns = ['test', 'sample', 'tmp', 'temp', '1', 'a'];
  const fileName = file.name.toLowerCase();
  if (suspiciousPatterns.some(pattern => fileName.includes(pattern))) {
    score -= 10;
  }
  
  // Deduct for files that are too small (might be malicious)
  if (file.size < 1024) { // Less than 1KB
    score -= 30;
  }
  
  return Math.max(0, score);
}

/**
 * Sanitizes file name for safe storage
 */
export function sanitizeFileName(fileName: string): string {
  return fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '_') // Replace invalid chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^[._-]+|[._-]+$/g, '') // Remove leading/trailing special chars
    .substring(0, 100); // Limit length
}

/**
 * Generates a secure file name with timestamp and hash
 */
export function generateSecureFileName(originalName: string, userId: string): string {
  const extension = originalName.split('.').pop()?.toLowerCase() || '';
  const sanitizedBase = sanitizeFileName(originalName.replace(/\.[^/.]+$/, ''));
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const userHash = btoa(userId).substring(0, 8);
  
  return `${sanitizedBase}_${timestamp}_${userHash}_${randomSuffix}.${extension}`;
}

/**
 * Content scanning for malicious patterns (basic implementation)
 */
export async function scanFileContent(file: File): Promise<{ isSafe: boolean; threats: string[] }> {
  const threats: string[] = [];
  
  try {
    // Read file as text to scan for suspicious patterns
    const text = await file.text();
    
    // Check for suspicious patterns that might indicate malicious content
    const maliciousPatterns = [
      /<script[\s\S]*?>[\s\S]*?<\/script>/gi, // JavaScript
      /javascript:/gi, // JavaScript URLs
      /vbscript:/gi, // VBScript
      /onload\s*=/gi, // Event handlers
      /onclick\s*=/gi,
      /onerror\s*=/gi,
      /eval\s*\(/gi, // Eval functions
      /document\.write/gi, // Document manipulation
      /window\.location/gi, // Redirects
      /\.exe\b/gi, // Executable references
      /\.bat\b/gi, // Batch files
      /\.cmd\b/gi, // Command files
    ];
    
    maliciousPatterns.forEach(pattern => {
      if (pattern.test(text)) {
        threats.push(`Suspicious pattern detected: ${pattern.source}`);
      }
    });
    
  } catch (error) {
    // If we can't read as text, it's likely binary - that's fine for CAD files
  }
  
  return {
    isSafe: threats.length === 0,
    threats
  };
}

/**
 * Rate limiting for file uploads per user
 */
const uploadAttempts = new Map<string, { count: number; lastAttempt: number }>();

export function checkUploadRateLimit(userId: string, maxUploads = 10, windowMs = 3600000): boolean {
  const now = Date.now();
  const userAttempts = uploadAttempts.get(userId);
  
  if (!userAttempts || now - userAttempts.lastAttempt > windowMs) {
    uploadAttempts.set(userId, { count: 1, lastAttempt: now });
    return true;
  }
  
  if (userAttempts.count >= maxUploads) {
    return false;
  }
  
  userAttempts.count++;
  userAttempts.lastAttempt = now;
  uploadAttempts.set(userId, userAttempts);
  
  return true;
}