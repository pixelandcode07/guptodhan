import { z } from 'zod';

// Create terms validation
export const createTermsValidationSchema = z.object({
  termsId: z.string().min(1, { message: 'Terms ID is required.' }),
  category: z.string({ required_error: 'Category ID is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
});

// Update terms validation
export const updateTermsValidationSchema = z.object({
  termsId: z.string().optional(),
  category: z.string().optional(),
  description: z.string().optional(),
});
