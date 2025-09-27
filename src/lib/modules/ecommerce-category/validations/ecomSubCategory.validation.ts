import { z } from 'zod';

// Create subcategory validation
export const createSubCategoryValidationSchema = z.object({
  subCategoryId: z.string().min(1, { message: 'SubCategory ID is required.' }),
  category: z.string({ required_error: 'Category ID is required.' }),
  name: z.string().min(1, { message: 'SubCategory name is required.' }),
  icon: z.string().min(1, { message: 'SubCategory icon is required.' }),
  image: z.string().optional(),
  isFeatured: z.boolean().optional(),
  slug: z.string().min(1, { message: 'Slug is required.' }),
  status: z.enum(['active', 'inactive']).optional(),
});

// Update subcategory validation
export const updateSubCategoryValidationSchema = z.object({
  subCategoryId: z.string().optional(),
  category: z.string().optional(),
  name: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  isFeatured: z.boolean().optional(),
  slug: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});
