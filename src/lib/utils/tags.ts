/**
 * Tag Utility Functions
 *
 * Handles tag normalization and conversion between display and URL formats.
 *
 * SEO Best Practice:
 * - URLs should use hyphens as word separators instead of spaces
 * - Consistent tag format across the application
 * - Maintains backwards compatibility with old space-based URLs via redirects
 */

/**
 * Converts a tag to URL-safe format (spaces to hyphens)
 * Example: "OEM supplier management" -> "oem-supplier-management"
 */
export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Converts a URL slug back to display format (hyphens to spaces, title case)
 * Example: "oem-supplier-management" -> "OEM Supplier Management"
 */
export function slugToTag(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Normalizes a tag array by removing duplicates and empty strings
 */
export function normalizeTags(tags: string[]): string[] {
  return Array.from(new Set(tags.filter(tag => tag && tag.trim().length > 0)));
}

/**
 * Checks if a tag matches a slug (case-insensitive comparison)
 * Handles both space and hyphen formats
 */
export function tagMatchesSlug(tag: string, slug: string): boolean {
  const normalizedTag = tagToSlug(tag);
  const normalizedSlug = slug.toLowerCase().replace(/\s+/g, '-');
  return normalizedTag === normalizedSlug;
}
