import { z } from 'zod';

// Create product SIM type validation
export const createProductSimTypeValidationSchema = z.object({
  simTypeId: z.string().min(1, { message: 'SIM Type ID is required.' }),
  name: z.string().min(1, { message: 'SIM Type name is required.' }),
  status: z.enum(['active', 'inactive']).optional(),
  createdAt: z.date().optional(),
});

// Update product SIM type validation
export const updateProductSimTypeValidationSchema = z.object({
  simTypeId: z.string().optional(),
  name: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  createdAt: z.date().optional(),
});
