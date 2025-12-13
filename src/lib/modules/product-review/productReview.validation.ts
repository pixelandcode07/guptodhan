import { z } from 'zod';

// Create review validation
export const createReviewValidationSchema = z.object({
  reviewId: z.string().min(1, { message: 'Review ID is required.' }),
  productId: z.string().min(1, { message: 'Product ID is required.' }),
  userId: z.string().min(1, { message: 'User ID is required.' }),
  userName: z.string().min(1, { message: 'User name is required.' }),
  userEmail: z.string().email({ message: 'Valid user email is required.' }),
  uploadedTime: z.string().optional(),
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
  userImage: z.string().min(1, { message: 'User image is required.' }),

  // ✅ New Multiple Images Field
  reviewImages: z.array(z.string()).optional(),
});


export const updateReviewValidationSchema = z.object({
  reviewId: z.string().optional(),
  productId: z.string().optional(),
  userId: z.string().optional(),
  userName: z.string().optional(),
  userEmail: z.string().email().optional(),
  uploadedTime: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  comment: z.string().optional(),
  userImage: z.string().optional(),

  // ✅ Optional array for updating multiple images
  reviewImages: z.array(z.string()).optional(),
});
