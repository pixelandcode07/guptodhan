// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-cta\cta.validation.ts

import { z } from 'zod';

export const createCtaValidationSchema = z.object({
  ctaImage: z.string().url(),
  ctaTitle: z.string().min(1),
  ctaLink: z.string().url(),
  ctaButtonText: z.string().min(1),
  ctaDescription: z.string().optional(),
});

export const updateCtaValidationSchema = z.object({
  ctaTitle: z.string().min(1).optional(),
  ctaLink: z.string().url().optional(),
  ctaButtonText: z.string().min(1).optional(),
  ctaDescription: z.string().optional(),
  isActive: z.boolean().optional(),
});