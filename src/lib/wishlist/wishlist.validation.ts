import { z } from 'zod';

// Create wishlist validation
export const createWishlistValidationSchema = z.object({
  wishlistID: z.string().min(1, { message: 'Wishlist ID is required.' }),
  userName: z.string().min(1, { message: 'User name is required.' }),
  userEmail: z.string().email({ message: 'Valid email is required.' }),
  userID: z.string({ required_error: 'User ID is required.' }),
  productID: z.string({ required_error: 'Product ID is required.' }),
  createdAt: z.date().optional(),
});

// Update wishlist validation
export const updateWishlistValidationSchema = z.object({
  wishlistID: z.string().optional(),
  userName: z.string().optional(),
  userEmail: z.string().email().optional(),
  userID: z.string().optional(),
  productID: z.string().optional(),
  createdAt: z.date().optional(),
});
