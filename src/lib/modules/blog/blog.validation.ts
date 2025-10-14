import { z } from 'zod';

// Create blog validation
export const createBlogValidationSchema = z.object({
  // blogId: z.string().min(1, { message: 'Blog ID is required.' }),
  coverImage: z.string().min(1, { message: 'Cover image is required.' }),
  category: z.string({ required_error: 'Category ID is required.' }),
  content: z.string().min(1, { message: 'Content is required.' }), // <-- added new value
  title: z.string().min(1, { message: 'Blog title is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().min(1, { message: 'Meta title is required.' }),
  metaKeywords: z.array(z.string()).optional(),
  metaDescription: z
    .string()
    .min(1, { message: 'Meta description is required.' }),
  status: z.enum(['active', 'inactive']).optional(),
});

// Update blog validation
export const updateBlogValidationSchema = z.object({
  // blogId: z.string().optional(),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  content: z.string().optional(), // <-- added new value
  title: z.string().optional(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metaTitle: z.string().optional(),
  metaKeywords: z.array(z.string()).optional(),
  metaDescription: z.string().optional(),
  status: z.enum(['active', 'inactive']).optional(),
});
