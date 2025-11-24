/**
 * Generate URL-friendly slug from text
 * @param text - Input text to convert to slug
 * @returns URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // spaces to hyphens
    .replace(/[^\w\-]+/g, '')       // remove special chars
    .replace(/\-\-+/g, '-')         // multiple hyphens to single
    .replace(/^-+/, '')             // trim hyphens from start
    .replace(/-+$/, '');            // trim hyphens from end
}