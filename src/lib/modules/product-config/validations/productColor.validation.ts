import { z } from 'zod';

// Create ProductColor validation
export const createProductColorValidationSchema = z.object({
  productColorId: z.string({ required_error: 'ProductColor ID is required.' }),
  color: z.string().min(1, { message: 'Color value is required.' }),
  colorName: z.string().min(1, { message: 'Color name is required.' }),
  colorCode: z.string().min(1, { message: 'Color code is required.' }),
  status: z.enum(['active', 'inactive']).optional(),
});

// Update ProductColor validation
export const updateProductColorValidationSchema = z.object({
  productColorId: z.string().optional(),
  color: z.string().optional(),
  colorName: z.string().optional(),
  colorCode: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});
