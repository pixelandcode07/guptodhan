// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service-subcategory\serviceSubCategory.validation.ts

import { z } from 'zod';

export const createServiceSubCategorySchema = z.object({
  name: z.string().min(1, { message: 'Sub-category name is required.' }),
  category: z.string({ required_error: 'Parent category ID is required.' }),
});

// নতুন: সাব-ক্যাটাগরি আপডেট করার জন্য
export const updateServiceSubCategorySchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().optional(), // Parent category ID পরিবর্তন করার জন্য
  status: z.enum(['active', 'inactive']).optional(),
});