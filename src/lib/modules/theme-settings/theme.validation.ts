// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\theme-settings\theme.validation.ts

import { z } from 'zod';

// Hex color কোড ভ্যালিডেট করার জন্য একটি রেগুলার এক্সপ্রেশন
const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;

export const updateThemeValidationSchema = z.object({
  primaryColor: z.string().regex(hexColorRegex, 'Invalid primary hex color code').optional(),
  secondaryColor: z.string().regex(hexColorRegex, 'Invalid secondary hex color code').optional(),
  tertiaryColor: z.string().regex(hexColorRegex, 'Invalid tertiary hex color code').optional(),
  titleColor: z.string().regex(hexColorRegex, 'Invalid title hex color code').optional(),
  paragraphColor: z.string().regex(hexColorRegex, 'Invalid paragraph hex color code').optional(),
  borderColor: z.string().regex(hexColorRegex, 'Invalid border hex color code').optional(),
});