import { z } from 'zod';

// Create user validation
export const createUserValidationSchema = z.object({
  systemUserID: z.string().min(1, { message: 'System User ID is required.' }),
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Valid email is required.' }),
  phone: z.string().min(1, { message: 'Phone number is required.' }),
  address: z.string().min(1, { message: 'Address is required.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  userType: z.enum(['admin', 'user', 'agent']).optional(),
  isActive: z.boolean().optional(),
});

// Update user validation
export const updateUserValidationSchema = z.object({
  systemUserID: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  password: z.string().min(6).optional(),
  userType: z.enum(['admin', 'user', 'agent']).optional(),
  isActive: z.boolean().optional(),
});
