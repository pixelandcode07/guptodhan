import { z } from 'zod';

// Create subcategory validation
export const createSubCategoryValidationSchema = z.object({
  subCategoryId: z.string().min(1, { message: 'SubCategory ID is required.' }),
  category: z.string().min(1, { message: 'Category ID is required.' }),
  name: z.string().min(1, { message: 'SubCategory name is required.' }),
  subCategoryIcon: z.string().optional(),
  subCategoryBanner: z.string().optional(),
  isFeatured: z.boolean().optional(),
  slug: z.string().min(1, { message: 'Slug is required.' }),
  status: z.enum(['active', 'inactive']).optional(),
});

// Update subcategory validation
export const updateSubCategoryValidationSchema = z.object({
  subCategoryId: z.string().optional(),
  category: z.string().optional(),
  name: z.string().optional(),
  subCategoryIcon: z.string().optional(),
  subCategoryBanner: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isNavbar: z.boolean().optional(),
  slug: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});
