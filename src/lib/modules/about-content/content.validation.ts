// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-content\content.validation.ts
import { z } from 'zod';

export const contentValidationSchema = z.object({
  aboutContent: z.string().min(20, { message: 'Content must be at least 20 characters long.' }),
  status: z.enum(['active', 'inactive']).optional(),
});