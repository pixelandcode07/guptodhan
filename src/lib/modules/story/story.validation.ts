import { z } from 'zod';

// Create story validation
export const createStoryValidationSchema = z.object({
  imageUrl: z.string().min(1, { message: 'Image URL is required.' }),
  duration: z.number().optional(),
  status: z.enum(['active', 'inactive']).optional(),
    // expiryDate: z.date({ required_error: 'Expiry date is required.' }).optional(),
    expiryDate: z
    .string()
    .min(1, { message: 'Expiry date is required.' })
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Expiry date must be a valid date string.' }),
});

// Update story validation
export const updateStoryValidationSchema = z.object({
  imageUrl: z.string().optional(),
  duration: z.number().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  expiryDate: z.date().optional(),
});
