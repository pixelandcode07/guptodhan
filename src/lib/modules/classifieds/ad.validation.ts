import { z } from 'zod';

export const createAdValidationSchema = z.object({
  title: z.string().min(5),
  user: z.string(),
  category: z.string(),
  subCategory: z.string().optional(),
  division: z.string(),
  district: z.string(),
  upazila: z.string(),
  condition: z.enum(['new', 'used']),
  authenticity: z.string(),
  description: z.string().min(20),
  price: z.coerce.number().positive(),
  isNegotiable: z.coerce.boolean().optional(),
  images: z.array(z.string().url()).min(1),
  contactDetails: z.object({
    name: z.string(),
    phone: z.string(),
    isPhoneHidden: z.coerce.boolean().default(false),
    email: z.string().email().optional(),
  }),
  brand: z.string().optional(),
  productModel: z.string().optional(),
  edition: z.string().optional(),
  features: z.array(z.string()).optional(),
});

export const updateAdValidationSchema = z.object({
  title: z.string().min(5).optional(),
  division: z.string().optional(),
  district: z.string().optional(),
  upazila: z.string().optional(),
  price: z.coerce.number().positive().optional(),

  category: z.string().optional(),
  subCategory: z.string().optional(),
  condition: z.enum(['new', 'used']).optional(),
  authenticity: z.string().optional(),
  description: z.string().min(20).optional(),
  isNegotiable: z.coerce.boolean().optional(),

  contactDetails: z
    .object({
      name: z.string().optional(),
      phone: z.string().optional(),
      isPhoneHidden: z.coerce.boolean().optional(),

      email: z.string().email().optional(),
    })
    .optional(),

  brand: z.string().optional(),
  productModel: z.string().optional(),
  edition: z.string().optional(),
  features: z.array(z.string()).optional(),
});
