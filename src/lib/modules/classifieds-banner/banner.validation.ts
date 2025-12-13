// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\classifieds-banner\banner.validation.ts

import { z } from 'zod';

export const createBannerValidationSchema = z.object({
  bannerImage: z.string().url({ message: 'A valid banner image URL is required.' }),
  bannerDescription: z.string().optional(),
});

export const updateBannerValidationSchema = z.object({
  bannerDescription: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});