// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service-category\serviceCategory.validation.ts

import { z } from 'zod';

export const createServiceCategorySchema = z.object({
  name: z.string().min(1, { message: 'Category name is required.' }),
  icon: z.string().url().optional(),
});

export const updateServiceCategorySchema = z.object({
    name: z.string().min(1).optional(),
    status: z.enum(['active', 'inactive']).optional(),
});