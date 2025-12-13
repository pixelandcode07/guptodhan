import { z } from 'zod';

// Create ProductUnit validation
export const createProductUnitValidationSchema = z.object({
  productUnitId: z.string({ required_error: 'ProductUnit ID is required.' }),
  name: z.string().min(1, { message: 'Unit name is required.' }),
  status: z.enum(['active', 'inactive']).optional(),
});

// Update ProductUnit validation
export const updateProductUnitValidationSchema = z.object({
  productUnitId: z.string().optional(),
  name: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});
