// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\reports\report.validation.ts

import { z } from 'zod';

export const createReportValidationSchema = z.object({
  adId: z.string({ required_error: 'Ad ID is required.' }),
  reason: z.enum(['spam', 'scam', 'prohibited_item', 'false_information', 'other'], {
    required_error: 'A valid reason is required.',
  }),
  details: z.string().min(10, { message: 'Details must be at least 10 characters long.' }),
});

export const updateReportStatusValidationSchema = z.object({
  status: z.enum(['pending', 'under_review', 'resolved', 'rejected']),
  adminNotes: z.string().optional(),
});