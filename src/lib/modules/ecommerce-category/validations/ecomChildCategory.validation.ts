import { z } from 'zod';

// Create child category validation
export const createChildCategoryValidationSchema = z.object({
  childCategoryId: z.string().min(1, { message: 'ChildCategory ID is required.' }),
  category: z.string({ required_error: 'Category ID is required.' }),
  subCategory: z.string({ required_error: 'SubCategory ID is required.' }),
  name: z.string().min(1, { message: 'ChildCategory name is required.' }),
  icon: z.string().min(1, { message: 'ChildCategory icon is required.' }),
  slug: z.string().min(1, { message: 'Slug is required.' }),
  status: z.enum(['active', 'inactive']).optional(),
});

// Update child category validation
export const updateChildCategoryValidationSchema = z.object({
  childCategoryId: z.string().optional(),
  category: z.string().optional(),
  subCategory: z.string().optional(),
  name: z.string().optional(),
  icon: z.string().optional(),
  slug: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});
