import { z } from 'zod';

export const createSupportTicketValidationSchema = z.object({
  customer: z.string().min(1, { message: 'Customer is required.' }),
  subject: z.string().min(1, { message: 'Subject is required.' }),
  attachment: z.string().url().optional(),
  status: z
    .enum(['on hold', 'reject', 'resolved', 'pending'])
    .default('pending')
    .optional(),
});

export const updateSupportTicketValidationSchema = z.object({
  customer: z.string().min(1).optional(),
  subject: z.string().min(1).optional(),
  attachment: z.string().url().optional(),
  status: z.enum(['on hold', 'reject', 'resolved', 'pending']).optional(),
});
