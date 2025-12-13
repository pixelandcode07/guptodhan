import { z } from 'zod';

const bannerPositions = z.enum(['top-homepage', 'left-homepage', 'right-homepage', 'middle-homepage', 'bottom-homepage', 'top-shoppage']);
const textPositions = z.enum(['left', 'right']);

export const createBannerSchema = z.object({
  bannerImage: z.string().url(),
  bannerPosition: bannerPositions,
  textPosition: textPositions,
  bannerLink: z.string().url().optional(),
  subTitle: z.string().optional(),
  bannerTitle: z.string().min(1, 'Banner Title is required.'),
  bannerDescription: z.string().optional(),
  buttonText: z.string().optional(),
  buttonLink: z.string().url().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  orderCount: z.number().optional()
});

export const updateBannerSchema = createBannerSchema.partial(); 