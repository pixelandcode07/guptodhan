import { z } from 'zod';

// Create promo code validation
export const createPromoCodeValidationSchema = z.object({
  promoCodeId: z.string().min(1, { message: 'Promo code ID is required.' }),
  title: z.string().min(1, { message: 'Title is required.' }),
  icon: z.string().min(1, { message: 'Icon is required.' }),
  startDate: z.string({ required_error: 'Start date is required.' }), // use string and later convert to Date
  endingDate: z.string({ required_error: 'Ending date is required.' }),
  type: z.string().min(1, { message: 'Type is required.' }),
  shortDescription: z.string().optional(),
  value: z.number({ required_error: 'Value is required.' }),
  minimumOrderAmount: z.number({ required_error: 'Minimum order amount is required.' }),
  code: z.string().min(1, { message: 'Code is required.' }),
  status: z.enum(['active', 'inactive']).optional(),
});

// Update promo code validation
export const updatePromoCodeValidationSchema = z.object({
  promoCodeId: z.string().optional(),
  title: z.string().optional(),
  icon: z.string().optional(),
  startDate: z.string().optional(),
  endingDate: z.string().optional(),
  type: z.string().optional(),
  shortDescription: z.string().optional(),
  value: z.number().optional(),
  minimumOrderAmount: z.number().optional(),
  code: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});
