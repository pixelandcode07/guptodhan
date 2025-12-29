import { z } from 'zod';

export const createServiceBannerValidationSchema = z.object({
  bannerImage: z.string().min(1, 'bannerImage is required'),

  bannerLink: z.string().optional(),
  subTitle: z.string().optional(),
  bannerTitle: z.string().min(1, 'bannerTitle is required'),
  bannerDescription: z.string().optional(),

  status: z.enum(['active', 'inactive']).optional(),
});

export const updateServiceBannerValidationSchema = z.object({
  bannerImage: z.string().optional(),
  bannerLink: z.string().optional(),
  subTitle: z.string().optional(),
  bannerTitle: z.string().optional(),
  bannerDescription: z.string().optional(),

  status: z.enum(['active', 'inactive']).optional(),
  orderCount: z.number().optional(),
});
