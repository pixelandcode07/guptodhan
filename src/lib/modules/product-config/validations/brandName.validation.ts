import { z } from 'zod';

// Create brand validation
export const createBrandValidationSchema = z.object({
  brandId: z.string().min(1, { message: 'Brand ID is required.' }),
  name: z.string().min(1, { message: 'Brand name is required.' }),
  brandLogo: z.string().min(1, { message: 'Brand logo is required.' }),
  brandBanner: z.string().min(1, { message: 'Brand banner is required.' }),
  category: z.string({ required_error: 'Category ID is required.' }),
  subCategory: z.string({ required_error: 'Sub-category ID is required.' }),
  children: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});

// Update brand validation
export const updateBrandValidationSchema = z.object({
  brandId: z.string().optional(),
  name: z.string().optional(),
  brandLogo: z.string().optional(),
  brandBanner: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  children: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive']).optional(),
});
