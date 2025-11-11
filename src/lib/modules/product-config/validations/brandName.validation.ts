import { z } from 'zod';

// Create brand validation
export const createBrandValidationSchema = z.object({
  brandId: z.string().min(1, { message: 'Brand ID is required.' }),
  name: z.string().min(1, { message: 'Brand name is required.' }),
  brandLogo: z.string().min(1, { message: 'Brand logo is required.' }),
  brandBanner: z.string().min(1, { message: 'Brand banner is required.' }),
  category: z.string().min(1, 'Category is required.'),
  subCategory: z.string().min(1, 'Sub-category is required.'),
  children: z.array(z.string()).optional(),
  status: z.enum(['active', 'inactive']).optional(),
  orderCount: z.number().optional(),
});

// Update brand validation
export const updateBrandValidationSchema = z.object({
  brandId: z.string().optional(),
  name: z.string().optional(),
  brandLogo: z.string().optional(),
  brandBanner: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  childCategory: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  featured: z.enum(['featured', 'not_featured']).optional(),
  orderCount: z.number().optional(),
});
