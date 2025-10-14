import { z } from 'zod';

// Create testimonial validation
export const createTestimonialValidationSchema = z.object({
  reviewID: z.string().min(1, { message: 'Review ID is required.' }),
  customerImage: z.string().min(1, { message: 'Customer image is required.' }),
  customerName: z.string().min(1, { message: 'Customer name is required.' }),
  customerProfession: z.string().optional(),
  rating: z.number({ invalid_type_error: 'Rating must be a number.' }).min(1).max(5),
  description: z.string().min(1, { message: 'Description is required.' }),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  date: z.date().optional(),
  productID: z.string({ required_error: 'Product ID is required.' }),
});

// Update testimonial validation
export const updateTestimonialValidationSchema = z.object({
  reviewID: z.string().optional(),
  customerImage: z.string().optional(),
  customerName: z.string().optional(),
  customerProfession: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  description: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected']).optional(),
  date: z.date().optional(),
  productID: z.string().optional(),
});
