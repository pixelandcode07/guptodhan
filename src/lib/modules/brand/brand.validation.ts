// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\brand\brand.validation.ts

import { z } from 'zod';

export const createBrandValidationSchema = z.object({
  name: z.string().min(1, { message: 'Brand name is required.' }),
  logo: z.string().url().optional(),
});

export const updateBrandValidationSchema = z.object({
    name: z.string().min(1).optional(),
    status: z.enum(['active', 'inactive']).optional(),
});