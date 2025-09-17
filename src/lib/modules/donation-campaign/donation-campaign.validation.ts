import { z } from 'zod';

export const createDonationCampaignSchema = z.object({
  category: z.string({ required_error: 'Category is required.' }),
  title: z.string({ required_error: 'Title is required.' }).min(10),
  item: z.enum(['money', 'clothes', 'food', 'books', 'other']),
  description: z.string({ required_error: 'Description is required.' }).min(50),
  goalAmount: z.preprocess(
    (val) => (val ? Number(val) : undefined),
    z.number().positive().optional()
  ),
});