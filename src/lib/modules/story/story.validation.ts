import { z } from 'zod';

// Create story validation
export const createStoryValidationSchema = z.object({
  title: z.string().max(100, { message: 'Title must be at most 100 characters.' }).optional(),
  description: z
    .string()
    .max(200, { message: 'Description must be at most 200 characters.' })
    .optional(),
  imageUrl: z.string().min(1, { message: 'Image URL is required.' }),
  duration: z.number().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  expiryDate: z
    .string()
    .min(1, { message: 'Expiry date is required.' })
    .refine((val) => !isNaN(Date.parse(val)), { message: 'Expiry date must be a valid date string.' }),
});

// Update story validation
export const updateStoryValidationSchema = z.object({
  title: z.string().max(100).optional(),
  description: z.string().max(200).optional(),
  imageUrl: z.string().optional(),
  duration: z.number().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  expiryDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), { message: 'Expiry date must be a valid date string.' }),
});
