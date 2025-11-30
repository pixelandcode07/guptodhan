import { z } from 'zod';

// Create Cart validation
export const createCartValidationSchema = z.object({
  cartID: z.string().optional(),
  userID: z.string({ required_error: 'User ID is required.' }),
  userName: z.string().min(1, { message: 'User name is required.' }),
  userEmail: z.string().email({ message: 'Valid email is required.' }),
  productID: z.string({ required_error: 'Product ID is required.' }),
  productName: z.string().min(1, { message: 'Product name is required.' }),
  productImage: z.string().optional(),
  quantity: z.number({ required_error: 'Quantity is required.' }).min(1, { message: 'Quantity must be at least 1.' }),
  unitPrice: z.number({ required_error: 'Unit price is required.' }).min(0, { message: 'Unit price cannot be negative.' }),
  totalPrice: z.number({ required_error: 'Total price is required.' }).min(0, { message: 'Total price cannot be negative.' }),
});

// Update Cart validation
export const updateCartValidationSchema = z.object({
  cartID: z.string().optional(),
  productID: z.string().optional(),
  productName: z.string().optional(),
  productImage: z.string().optional(),
  quantity: z.number().min(1).optional(),
  unitPrice: z.number().min(0).optional(),
  totalPrice: z.number().min(0).optional(),
});
