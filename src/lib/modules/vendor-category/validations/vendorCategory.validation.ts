import { z } from 'zod';

// Create category validation
export const createCategoryValidationSchema = z.object({
  categoryId: z.string().min(1, { message: 'Category ID is required.' }),
  name: z.string().min(1, { message: 'Category name is required.' }),
  categoryIcon: z.string().min(1, { message: 'Category icon is required.' }),
  categoryBanner: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isNavbar: z.boolean().default(false),
  slug: z.string().min(1, { message: 'Slug is required.' }),
  status: z.enum(['active', 'inactive']).optional(),
  createdAt: z.date().optional(),
});

// Update category validation
export const updateCategoryValidationSchema = z.object({
  categoryId: z.string().optional(),
  name: z.string().optional(),
  categoryIcon: z.string().optional(),
  categoryBanner: z.string().optional(),
  isFeatured: z.boolean().optional(),
  isNavbar: z.boolean().optional(),
  slug: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  createdAt: z.date().optional(),
});
