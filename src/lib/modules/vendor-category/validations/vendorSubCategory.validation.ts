import { z } from 'zod';

// Create sub-category validation
export const createSubCategoryValidationSchema = z.object({
  subCategoryId: z.string().min(1, { message: 'Sub-category ID is required.' }),
  category: z.string().min(1, { message: 'Category ID is required.' }),
  name: z.string().min(1, { message: 'Sub-category name is required.' }),
  icon: z.string().min(1, { message: 'Icon is required.' }),
  image: z.string().optional(),
  isFeatured: z.boolean().default(false),
  status: z.enum(['active', 'inactive']).optional(),
  slug: z.string().min(1, { message: 'Slug is required.' }),
  createdAt: z.date().optional(),
});

// Update sub-category validation
export const updateSubCategoryValidationSchema = z.object({
  subCategoryId: z.string().optional(),
  category: z.string().optional(),
  name: z.string().optional(),
  icon: z.string().optional(),
  image: z.string().optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  slug: z.string().optional(),
  createdAt: z.date().optional(),
});
