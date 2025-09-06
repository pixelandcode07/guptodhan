// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\classifieds-category\category.validation.ts

import { z } from 'zod';

export const createCategoryValidationSchema = z.object({
  name: z.string().min(1, { message: 'Category name is required.' }),
  icon: z.string().url().optional(), // Controller will add this after upload
});

export const updateCategoryValidationSchema = z.object({
    name: z.string().min(1).optional(),
    status: z.enum(['active', 'inactive']).optional(),
});