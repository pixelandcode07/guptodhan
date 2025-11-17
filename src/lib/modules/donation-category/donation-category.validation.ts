import { z } from 'zod';

export const createDonationCategorySchema = z.object({
  name: z.string({ required_error: 'Category name is required.' }).min(1),
  icon: z.string().url().optional(),
  orderCount: z.number().optional(),

});

export const updateDonationCategorySchema = z.object({
  name: z.string().min(1).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  orderCount: z.number().optional(),
});