// src/lib/modules/product-config/validations/productCountry.validation.ts

import { z } from 'zod';

export const createProductCountrySchema = z.object({
  name: z.string().min(1, 'Country name is required').trim(),
  code: z.string().min(2).max(3).optional(),
  flag: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

export const updateProductCountrySchema = z.object({
  name: z.string().min(1).trim().optional(),
  code: z.string().min(2).max(3).optional(),
  flag: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});