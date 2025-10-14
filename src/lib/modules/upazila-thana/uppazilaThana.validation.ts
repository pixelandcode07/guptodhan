import { z } from 'zod';

// Create Upazila Thana validation
export const createUpazilaThanaValidationSchema = z.object({
  district: z.string().min(1, { message: 'District is required.' }),
  upazilaThanaEnglish: z.string().min(1, { message: 'Upazila/Thana (English) is required.' }),
  upazilaThanaBangla: z.string().min(1, { message: 'Upazila/Thana (Bangla) is required.' }),
  websiteLink: z.string().url({ message: 'Website link must be a valid URL.' }).optional(),
  createdAt: z.date().optional(),
});

// Update Upazila Thana validation
export const updateUpazilaThanaValidationSchema = z.object({
  district: z.string().optional(),
  upazilaThanaEnglish: z.string().optional(),
  upazilaThanaBangla: z.string().optional(),
  websiteLink: z.string().url().optional(),
  createdAt: z.date().optional(),
});
