import { z } from 'zod';

// Create ProductFlag validation
export const createProductFlagValidationSchema = z.object({
  productFlagId: z.string({ required_error: 'ProductFlag ID is required.' }),
  name: z.string().min(1, { message: 'Flag name is required.' }),
  icon: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  featured: z.boolean().optional(),
  orderCount: z.number().optional(),
});

// Update ProductFlag validation
export const updateProductFlagValidationSchema = z.object({
  productFlagId: z.string().optional(),
  name: z.string().optional(),
  icon: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  featured: z.boolean().optional(),
  orderCount: z.number().optional(),
});
