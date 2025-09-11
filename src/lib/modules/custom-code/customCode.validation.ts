// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\custom-code\customCode.validation.ts

import { z } from 'zod';

export const updateCustomCodeSchema = z.object({
  customCSS: z.string().optional(),
  headerScript: z.string().optional(),
  footerScript: z.string().optional(),
});