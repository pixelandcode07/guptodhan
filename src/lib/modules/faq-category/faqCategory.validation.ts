import { z } from 'zod';

// Create FAQ Category validation
export const createFAQCategoryValidationSchema = z.object({
  name: z.string().min(1, { message: 'Category name is required.' }),
  isActive: z.boolean().optional(),
});

// Update FAQ Category validation
export const updateFAQCategoryValidationSchema = z.object({
  name: z.string().optional(),
  isActive: z.boolean().optional(),
});
