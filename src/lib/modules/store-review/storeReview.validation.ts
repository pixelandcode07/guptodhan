import { z } from 'zod';

export const createStoreReviewValidationSchema = z.object({
  storeId: z
    .string()
    .min(1, 'Store ID is required'),

  userId: z
    .string()
    .min(1, 'User ID is required'),

  userName: z
    .string()
    .min(1, 'User name is required'),

  userImage: z
    .string()
    .url('User image must be a valid URL'),

  rating: z
    .number()
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),

  comment: z
    .string()
    .min(5, 'Comment must be at least 5 characters')
    .max(500, 'Comment cannot exceed 500 characters'),
});

export const updateStoreReviewValidationSchema = z.object({
  userName: z.string().optional(),
  userImage: z.string().url().optional(),
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().min(5).max(500).optional(),
});
