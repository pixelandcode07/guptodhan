import { z } from 'zod';

export const createDonationCampaignSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  title: z.string().min(5, 'Title must be at least 5 characters').max(200, 'Title must be at most 200 characters'),
  item: z.enum(['money', 'clothes', 'food', 'books', 'other'], {
    errorMap: () => ({ message: 'Invalid item type' })
  }),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  goalAmount: z.number().optional().default(0),
  images: z.array(z.any()).optional(),
});

export const updateDonationCampaignSchema = createDonationCampaignSchema.partial();