
import { z } from 'zod';

export const createCategoryValidationSchema = z.object({
  name: z.string().min(1, { message: 'Category name is required.' }),
  icon: z.string().url().optional(), // Controller will add this after upload
  orderCount: z.number().optional(),

});

// export const updateCategoryValidationSchema = z.object({
//     name: z.string().min(1).optional(),
//     status: z.enum(['active', 'inactive']).optional(),
// });

export const updateCategoryValidationSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  status: z.enum(["active", "inactive"]).optional(),
  icon: z.string().url().optional(),
  orderCount: z.number().optional(),

});
