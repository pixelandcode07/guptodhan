import { z } from 'zod';

// Create ModelForm validation
export const createModelFormValidationSchema = z.object({
  modelFormId: z.string().optional(),
  brand: z.string().min(1, { message: 'Brand is required.' }),
  modelName: z.string().min(1, { message: 'Model name is required.' }),
  modelCode: z.string().min(1, { message: 'Model code is required.' }),
  status: z.enum(['active', 'inactive']).optional(),
});

// Update ModelForm validation
export const updateModelFormValidationSchema = z.object({
  modelFormId: z.string().optional(),
  brand: z.string().optional(),
  modelName: z.string().optional(),
  modelCode: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});
