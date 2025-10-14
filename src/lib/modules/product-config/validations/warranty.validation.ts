import { z } from 'zod';

// Create product warranty validation
export const createProductWarrantyValidationSchema = z.object({
  warrantyName: z.string().min(1, { message: 'Warranty name is required.' }),
  createdAt: z.date().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

// Update product warranty validation
export const updateProductWarrantyValidationSchema = z.object({
  warrantyName: z.string().optional(),
  createdAt: z.date().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});
