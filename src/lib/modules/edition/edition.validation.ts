import { z } from 'zod';

export const createEditionValidationSchema = z.object({
  name: z.string().min(1),
  productModel: z.string(), // ID of the parent model
});

export const updateEditionValidationSchema = z.object({
    name: z.string().min(1).optional(),
    status: z.enum(['active', 'inactive']).optional(),
}); 