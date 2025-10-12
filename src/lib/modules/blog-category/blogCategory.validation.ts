import { z } from 'zod';

// Create blog category validation
export const createBlogCategoryValidationSchema = z.object({
  name: z.string().min(1, { message: 'Blog category name is required.' }),
  slug: z.string().min(1, { message: 'Slug is required.' }),
  isFeatured: z.boolean().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  createdAt: z.date().optional(),
});

// Update blog category validation
export const updateBlogCategoryValidationSchema = z.object({
  name: z.string().optional(),
  slug: z.string().optional(),
  isFeatured: z.boolean().optional(),
  status: z.enum(['active', 'inactive']).optional(),
  createdAt: z.date().optional(),
});
