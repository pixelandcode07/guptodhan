// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\seo-settings\seo.validation.ts

import { z } from 'zod';

export const createOrUpdateSeoSchema = z.object({
  pageIdentifier: z.string().min(1, { message: 'Page identifier is required.' }),
  metaTitle: z.string().min(1, { message: 'Meta title is required.' }),
  metaKeywords: z.preprocess((val) => {
    // form-data থেকে আসা comma-separated string-কে অ্যারেতে পরিণত করা হচ্ছে
    if (typeof val === 'string' && val.trim() !== '') return val.split(',').map(item => item.trim());
    if (Array.isArray(val)) return val;
    return [];
  }, z.array(z.string()).optional().default([])),
  metaDescription: z.string().min(1, { message: 'Meta description is required.' }),
  ogTitle: z.string().min(1, { message: 'OG title is required.' }),
  ogDescription: z.string().min(1, { message: 'OG description is required.' }),
  ogImage: z.string().url().optional(),
});