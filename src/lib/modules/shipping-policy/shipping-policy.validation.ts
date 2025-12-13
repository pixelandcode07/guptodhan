import { z } from 'zod';

export const updateShippingPolicySchema = z.object({
  content: z.string().min(1, 'Content cannot be empty.'),
  status: z.enum(['active', 'inactive']).optional(),
});