import { z } from 'zod';

// Create ProductSize validation
export const createProductSizeValidationSchema = z.object({
  sizeId: z.string({ required_error: 'Size ID is required.' }),
  name: z.string().min(1, { message: 'Size name is required.' }),
  status: z.enum(['active', 'inactive']).optional(),
  orderCount: z.number().optional(),
});

// Update ProductSize validation
export const updateProductSizeValidationSchema = z.object({
  sizeId: z.string().optional(),
  name: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  orderCount: z.number().optional(),
});
