import { z } from 'zod';

export const jobZodSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  companyName: z.string().min(1, 'Company name is required'),
  location: z.string().min(1, 'Location is required'),
  category: z.string().min(1, 'Category is required'),
  salaryRange: z.string().optional(),
  
  // ✅ ভ্যালিডেশন যোগ করা হলো
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(11, 'Phone number must be at least 11 digits'),
});

export const updateStatusZodSchema = z.object({
  status: z.enum(['pending', 'approved', 'rejected']),
});