// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\about-fact\fact.validation.ts
import { z } from 'zod';

export const createFactValidationSchema = z.object({
  factTitle: z.string().min(1, { message: 'Fact title is required.' }),
  factCount: z.number().positive({ message: 'Fact count must be a positive number.' }),
  shortDescription: z.string().optional(),
});

export const updateFactValidationSchema = z.object({
  factTitle: z.string().min(1).optional(),
  factCount: z.number().positive().optional(),
  shortDescription: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});