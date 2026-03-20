/**
 * Storage utilities for Supabase auth token management
 * Uses pattern matching instead of hardcoded project refs
 */

/**
 * Clears all Supabase-related auth tokens from localStorage.
 * Uses a pattern match instead of hardcoding the project ref,
 * so this works across environments (dev, staging, prod).
 */
export function clearSupabaseStorage(): void {
  if (typeof window === 'undefined') return
  Object.keys(localStorage)
    .filter((k) => k.startsWith('sb-') && k.endsWith('-auth-token'))
    .forEach((k) => localStorage.removeItem(k))
}