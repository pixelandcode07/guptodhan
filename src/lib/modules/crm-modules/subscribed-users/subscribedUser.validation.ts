import { z } from 'zod';

export const createSubscriberValidationSchema = z.object({
  userEmail: z.string().email({ message: 'Valid email is required.' }),
  subscribedOn: z.date({ required_error: 'Subscribed date is required.' }),
});

export const updateSubscriberValidationSchema = z.object({
  userEmail: z.string().email().optional(),
  subscribedOn: z.date().optional(),
});
