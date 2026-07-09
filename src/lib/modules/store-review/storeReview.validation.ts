import { z } from 'zod';

export const createStoreReviewValidationSchema = z.object({
  storeId: z.string().min(1, 'Store ID is required'),
  userId: z.string().min(1, 'User ID is required'),
  userName: z.string().min(1, 'User Name is required'),
  userImage: z.string().optional(),
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  comment: z.string().min(1, 'Comment is required'),
});

export const updateStoreReviewValidationSchema = z.object({
  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5')
    .optional(),
  comment: z.string().optional(),
});

export type CreateStoreReviewFormValues = z.infer<typeof createStoreReviewValidationSchema>;