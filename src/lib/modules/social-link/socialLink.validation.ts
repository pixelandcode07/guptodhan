// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\social-link\socialLink.validation.ts

import { z } from 'zod';

export const createSocialLinkSchema = z.object({
  label: z.string().min(1, { message: 'Label is required.' }),
  icon: z.string().url({ message: 'A valid icon URL is required.' }),
  url: z.string().url({ message: 'A valid social media URL is required.' }),
});

export const updateSocialLinkSchema = z.object({
  label: z.string().min(1).optional(),
  url: z.string().url().optional(),
  // Icon update will require file upload, better handled in a separate endpoint if needed
});
