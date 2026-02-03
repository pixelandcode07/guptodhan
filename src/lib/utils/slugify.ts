// utils/slugify.ts

/**
 * Convert text to URL-friendly slug
 * Example: "Men's Fashion" -> "mens-fashion"
 */
export function createSlug(text: string): string {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    // Remove apostrophes
    .replace(/'/g, '')
    .replace(/'/g, '')
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single hyphen
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

/**
 * Examples:
 * "Men's Fashion" -> "mens-fashion"
 * "Women & Girls" -> "women-girls"
 * "Electronics & Gadgets" -> "electronics-gadgets"
 * "Kids' Toys" -> "kids-toys"
 */