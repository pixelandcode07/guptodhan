import { z } from 'zod';

export const updateVendorStatusValidationSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected'], {
    required_error: 'Status is required.',
  }),
});