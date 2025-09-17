import { z } from 'zod';

// Create review validation
export const createReviewValidationSchema = z.object({
  reviewId: z.string().min(1, { message: 'Review ID is required.' }),
  userId: z.string({ required_error: 'User ID is required.' }),
  userName: z.string().min(1, { message: 'User name is required.' }),
  userEmail: z.string().email({ message: 'Valid user email is required.' }),
  uploadedTime: z.string().optional(), // can be auto-generated if not provided
  rating: z.number().min(1, { message: 'Rating must be at least 1.' }).max(5, { message: 'Rating cannot exceed 5.' }),
  comment: z.string().optional(),
  userImage: z.string().min(1, { message: 'User image is required.' }),
});

// Update review validation
export const updateReviewValidationSchema = z.object({
  reviewId: z.string().optional(),
  userId: z.string().optional(),
  userName: z.string().optional(),
  userEmail: z.string().email().optional(),
  uploadedTime: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
  userImage: z.string().optional(),
});
