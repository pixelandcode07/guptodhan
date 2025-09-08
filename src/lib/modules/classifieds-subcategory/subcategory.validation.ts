// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\classifieds-subcategory\subcategory.validation.ts

import { z } from 'zod';

export const createSubCategoryValidationSchema = z.object({
  name: z.string().min(1, { message: 'Sub-category name is required.' }),
  category: z.string({ required_error: 'Parent category ID is required.' }), // এটি ID হবে
  icon: z.string().url().optional(), // আইকনটি এখন একটি URL হিসেবে ভ্যালিডেট করা হবে
});

export const updateSubCategoryValidationSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().optional(), 
  icon: z.string().url().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});