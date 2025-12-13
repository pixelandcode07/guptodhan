import { z } from 'zod';

export const createOrUpdateSeoSchema = z.object({
  pageIdentifier: z.string().min(1, { message: 'Page identifier is required.' }),
  metaTitle: z.string().min(1, { message: 'Meta title is required.' }),
  metaKeywords: z.preprocess((val) => {
    if (typeof val === 'string' && val.trim() !== '') return val.split(',').map(item => item.trim());
    if (Array.isArray(val)) return val;
    return [];
  }, z.array(z.string()).optional().default([])),
  metaDescription: z.string().min(1, { message: 'Meta description is required.' }),
  ogTitle: z.string().optional(), // ✅ Optional করলাম
  ogDescription: z.string().optional(), // ✅ Optional করলাম
  ogImage: z.string().url().optional(),
});