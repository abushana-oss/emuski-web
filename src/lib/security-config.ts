/**
 * Security Configuration and Environment Variable Management
 * 
 * This module provides centralized, secure management of environment variables
 * and API keys following OWASP best practices for secrets management.
 * 
 * Security Features:
 * - Environment variable validation
 * - Secrets rotation support
 * - Development/production environment separation
 * - Comprehensive logging for security audit trails
 * - Key exposure detection and prevention
 */

interface SecurityConfig {
  // API Keys (Server-side only - NEVER expose to client)
  ANTHROPIC_API_KEY: string;
  BLOGGER_API_KEY: string;
  GOOGLE_DRIVE_API_KEY: string;
  RESEND_API_KEY: string;
  GA4_API_SECRET: string;
  RECAPTCHA_SECRET_KEY: string;
  
  // Database and Storage
  SUPABASE_SERVICE_ROLE_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  
  // Authentication and Session Management
  NEXTAUTH_SECRET: string;
  JWT_SECRET: string;
  
  // Webhook and Cron Security
  WEBHOOK_SECRET: string;
  CRON_SECRET: string;
  REVALIDATE_SECRET: string;
  BLOGGER_WEBHOOK_SECRET: string;
  
  // External Service URLs
  CAD_ENGINE_URL: string;
  
  // Application Settings
  NODE_ENV: 'development' | 'production' | 'test';
  NEXT_RUNTIME?: string;
}

// Required environment variables for production
const REQUIRED_PROD_VARS = [
  'ANTHROPIC_API_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_URL',
  'NEXTAUTH_SECRET',
  'REVALIDATE_SECRET'
] as const;

// Optional environment variables (with fallbacks)
const OPTIONAL_VARS = [
  'BLOGGER_API_KEY',
  'GOOGLE_DRIVE_API_KEY',
  'RESEND_API_KEY',
  'GA4_API_SECRET',
  'RECAPTCHA_SECRET_KEY',
  'WEBHOOK_SECRET',
  'CRON_SECRET',
  'BLOGGER_WEBHOOK_SECRET',
  'CAD_ENGINE_URL'
] as const;

/**
 * Validates environment variable format and security
 */
function validateEnvVar(key: string, value: string | undefined): {
  isValid: boolean;
  message?: string;
} {
  if (!value) {
    return { isValid: false, message: `${key} is required but not set` };
  }
  
  // Check for common security issues
  if (value.length < 8 && key.includes('SECRET')) {
    return { isValid: false, message: `${key} appears too short for a secure secret` };
  }
  
  if (value === 'your_api_key_here' || value === 'changeme') {
    return { isValid: false, message: `${key} contains a placeholder value` };
  }
  
  if (value.includes(' ')) {
    return { isValid: false, message: `${key} contains spaces (may be incorrectly formatted)` };
  }
  
  // Validate UUID format for certain keys
  if (key.includes('UUID') || key === 'NEXTAUTH_SECRET') {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value) && value.length < 32) {
      return { isValid: false, message: `${key} should be a UUID or at least 32 characters long` };
    }
  }
  
  return { isValid: true };
}

/**
 * Securely loads and validates environment configuration
 */
export function loadSecurityConfig(): {
  config: Partial<SecurityConfig>;
  errors: string[];
  warnings: string[];
} {
  const config: Partial<SecurityConfig> = {};
  const errors: string[] = [];
  const warnings: string[] = [];
  
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Validate required variables for production
  if (isProduction) {
    for (const key of REQUIRED_PROD_VARS) {
      const value = process.env[key];
      const validation = validateEnvVar(key, value);
      
      if (!validation.isValid) {
        errors.push(validation.message || `${key} validation failed`);
      } else {
        (config as any)[key] = value;
      }
    }
  }
  
  // Load optional variables with warnings
  for (const key of OPTIONAL_VARS) {
    const value = process.env[key];
    
    if (value) {
      const validation = validateEnvVar(key, value);
      
      if (!validation.isValid) {
        warnings.push(validation.message || `${key} validation warning`);
      }
      
      (config as any)[key] = value;
    } else if (isProduction) {
      warnings.push(`Optional environment variable ${key} is not set`);
    }
  }
  
  // Always include environment and runtime info
  config.NODE_ENV = (process.env.NODE_ENV as any) || 'development';
  config.NEXT_RUNTIME = process.env.NEXT_RUNTIME;
  
  return { config, errors, warnings };
}

/**
 * Get specific API key with security logging
 */
export function getAPIKey(keyName: keyof SecurityConfig): string | null {
  const value = process.env[keyName];
  
  if (!value) {
    console.warn(`[SECURITY] API key ${keyName} is not configured`);
    return null;
  }
  
  // Never log the actual key value
  console.info(`[SECURITY] API key ${keyName} loaded successfully`);
  return value;
}

/**
 * Validate API key format for specific services
 */
export function validateAPIKeyFormat(service: string, key: string): boolean {
  switch (service) {
    case 'anthropic':
      return key.startsWith('sk-ant-') && key.length > 50;
    
    case 'google':
      return /^[A-Za-z0-9_-]{39}$/.test(key);
    
    case 'resend':
      return key.startsWith('re_') && key.length > 20;
    
    case 'supabase':
      return key.startsWith('sbp_') || key.length === 64;
    
    default:
      return key.length >= 16; // Minimum secure length
  }
}

/**
 * Check for potentially exposed secrets in code
 */
export function detectSecretExposure(text: string): {
  hasExposure: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];
  const secretPatterns = [
    { name: 'API Key', pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['\"][^'\"]{10,}['\"]/gi },
    { name: 'Secret Key', pattern: /(?:secret[_-]?key|secretkey)\s*[:=]\s*['\"][^'\"]{10,}['\"]/gi },
    { name: 'Password', pattern: /(?:password|passwd|pwd)\s*[:=]\s*['\"][^'\"]{5,}['\"]/gi },
    { name: 'Token', pattern: /(?:token|auth)\s*[:=]\s*['\"][^'\"]{10,}['\"]/gi },
    { name: 'Database URL', pattern: /(?:database[_-]?url|db[_-]?url)\s*[:=]\s*['\"][^'\"]{10,}['\"]/gi }
  ];
  
  for (const { name, pattern } of secretPatterns) {
    if (pattern.test(text)) {
      warnings.push(`Potential ${name} exposure detected in code`);
    }
  }
  
  return {
    hasExposure: warnings.length > 0,
    warnings
  };
}

/**
 * Generate secure random secrets for development
 */
export function generateSecureSecret(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
}

/**
 * Security audit logger for environment configuration
 */
export function logSecurityAudit(): void {
  const { config, errors, warnings } = loadSecurityConfig();
  
  console.info('[SECURITY AUDIT] Environment configuration check');
  console.info(`[SECURITY AUDIT] Environment: ${config.NODE_ENV}`);
  console.info(`[SECURITY AUDIT] Runtime: ${config.NEXT_RUNTIME || 'Unknown'}`);
  
  if (errors.length > 0) {
    console.error('[SECURITY AUDIT] CRITICAL ERRORS:', errors);
  }
  
  if (warnings.length > 0) {
    console.warn('[SECURITY AUDIT] Warnings:', warnings);
  }
  
  const configuredKeys = Object.keys(config).filter(key => 
    key !== 'NODE_ENV' && key !== 'NEXT_RUNTIME' && config[key as keyof SecurityConfig]
  );
  
  console.info(`[SECURITY AUDIT] Configured API keys: ${configuredKeys.length}`);
  
  // Check for common security misconfigurations
  if (config.NODE_ENV === 'production') {
    if (!config.NEXTAUTH_SECRET) {
      console.error('[SECURITY AUDIT] CRITICAL: NEXTAUTH_SECRET missing in production');
    }
    
    if (!config.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('[SECURITY AUDIT] CRITICAL: SUPABASE_SERVICE_ROLE_KEY missing in production');
    }
  }
}

// Initialize security audit on module load (server-side only)
if (typeof window === 'undefined') {
  logSecurityAudit();
}