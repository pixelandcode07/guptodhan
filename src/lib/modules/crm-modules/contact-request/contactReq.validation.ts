import { z } from 'zod';

export const createContactRequestValidationSchema = z.object({
  userName: z.string().min(1, { message: 'User name is required.' }),
  userEmail: z.string().email().optional(),
  userNumber: z.string().optional(),
  message: z.string().min(1, { message: 'Message is required.' }),
  status: z.enum(['pending', 'resolved']).default('pending').optional(),
});

export const updateContactRequestValidationSchema = z.object({
  userName: z.string().min(1).optional(),
  userEmail: z.string().email().optional(),
  userNumber: z.string().optional(),
  message: z.string().min(1).optional(),
  status: z.enum(['pending', 'resolved']).optional(),
});
