import { z } from 'zod';

// সব 필্ড optional কারণ অ্যাডমিন যেকোনো একটি বা একাধিক লিঙ্ক আপডেট করতে পারে
export const updateSocialLinksSchema = z.object({
  facebook: z.string().url().or(z.literal('')).optional(),
  twitter: z.string().url().or(z.literal('')).optional(),
  instagram: z.string().url().or(z.literal('')).optional(),
  linkedin: z.string().url().or(z.literal('')).optional(),
  messenger: z.string().url().or(z.literal('')).optional(),
  whatsapp: z.string().url().or(z.literal('')).optional(),
  telegram: z.string().url().or(z.literal('')).optional(),
  youtube: z.string().url().or(z.literal('')).optional(),
  tiktok: z.string().url().or(z.literal('')).optional(),
  pinterest: z.string().url().or(z.literal('')).optional(),
  viber: z.string().url().or(z.literal('')).optional(),
});