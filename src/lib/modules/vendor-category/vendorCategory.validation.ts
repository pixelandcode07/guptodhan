import { z } from 'zod';

// Create vendor category validation
export const createVendorCategoryValidationSchema = z.object({
  name: z.string().min(1, { message: 'Vendor category name is required.' }),
  slug: z.string().min(1, { message: 'Slug is required.' }),
  status: z.enum(['active', 'inactive']).optional(),
  orderCount: z.number().optional(),
});

// Update vendor category validation
export const updateVendorCategoryValidationSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  orderCount: z.number().optional(),
});
