import { z } from 'zod';

export const createSupportTicketValidationSchema = z.object({
  reporter: z.string().min(1, { message: 'Reporter (User ID) is required.' }),
  subject: z.string().min(1, { message: 'Subject is required.' }),
  message: z.string().min(1, { message: 'Message is required.' }),
  attachment: z.string().url().optional(),
});

export const updateTicketStatusValidationSchema = z.object({
  status: z.enum(['Pending', 'In Progress', 'Solved', 'Rejected', 'On Hold']),
  note: z.string().optional(), // For admin notes
});

export const addReplyValidationSchema = z.object({
    sender: z.enum(['user', 'admin']),
    message: z.string().min(1, { message: 'Reply message cannot be empty.' }),
    attachment: z.string().url().optional(),
});