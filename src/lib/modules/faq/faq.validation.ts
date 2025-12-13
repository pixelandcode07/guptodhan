import { z } from 'zod';

// Create FAQ validation
export const createFAQValidationSchema = z.object({
  faqID: z.string().min(1, { message: 'FAQ ID is required.' }),
  category: z.string({ required_error: 'FAQ category ID is required.' }),
  question: z.string().min(1, { message: 'Question is required.' }),
  answer: z.string().min(1, { message: 'Answer is required.' }),
  isActive: z.boolean().optional(),
});

// Update FAQ validation
export const updateFAQValidationSchema = z.object({
  faqID: z.string().optional(),
  category: z.string().optional(),
  question: z.string().optional(),
  answer: z.string().optional(),
  isActive: z.boolean().optional(),
});
