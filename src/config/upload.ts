import { serverEnv } from './env'

/**
 * File Upload Configuration
 * Centralized configuration for file size limits across the application
 */

// Get max upload size from environment variable or default to 500MB
export const MAX_UPLOAD_SIZE_MB = serverEnv.MAX_UPLOAD_SIZE_MB || 500
export const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024

/**
 * File size limits for different file types
 */
export const FILE_SIZE_LIMITS = {
  // CAD files (STEP, STL, IGES, OBJ)
  CAD_FILES: MAX_UPLOAD_SIZE_BYTES,
  
  // PDF files for balloon diagrams
  PDF_FILES: MAX_UPLOAD_SIZE_BYTES,
  
  // General uploads
  GENERAL: MAX_UPLOAD_SIZE_BYTES,
  
  // Images (smaller limit for performance)
  IMAGES: Math.min(50 * 1024 * 1024, MAX_UPLOAD_SIZE_BYTES), // 50MB max for images
} as const

/**
 * Supported file types for different operations
 */
export const SUPPORTED_FILE_TYPES = {
  CAD_FILES: ['step', 'stp', 'stl', 'iges', 'igs', 'obj'],
  PDF_FILES: ['pdf'],
  IMAGES: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
} as const

/**
 * File validation helper
 */
export function validateFileSize(file: File, maxSizeBytes: number): { valid: boolean; error?: string } {
  if (file.size > maxSizeBytes) {
    const maxSizeMB = (maxSizeBytes / (1024 * 1024)).toFixed(0)
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1)
    return {
      valid: false,
      error: `File size (${fileSizeMB}MB) exceeds the ${maxSizeMB}MB limit. For larger files, please contact support@emuski.com`
    }
  }
  return { valid: true }
}

/**
 * File type validation helper
 */
export function validateFileType(file: File, allowedTypes: readonly string[]): { valid: boolean; error?: string } {
  const fileExtension = file.name.split('.').pop()?.toLowerCase()
  
  if (!fileExtension || !allowedTypes.includes(fileExtension)) {
    return {
      valid: false,
      error: `File type not supported. Allowed types: ${allowedTypes.join(', ')}`
    }
  }
  
  return { valid: true }
}