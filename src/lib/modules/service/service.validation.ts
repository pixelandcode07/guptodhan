// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\service\service.validation.ts

import { Types } from 'mongoose';
import { z } from 'zod';

export const createServiceSchema = z.object({
  // ✅ FIX: provider 필্ডটি যোগ করা হয়েছে
  provider: z.custom<Types.ObjectId>(val => Types.ObjectId.isValid(val as string), {
    message: "Invalid provider ID",
  }),
  title: z.string().min(5),
  description: z.string().min(20),
  price: z.number().positive(),
  category: z.custom<Types.ObjectId>(val => Types.ObjectId.isValid(val as string), {
    message: "Invalid category ID",
  }),
  // ✅ FIX: subCategory এখন ObjectId হিসেবে ভ্যালিডেট হবে
  subCategory: z.custom<Types.ObjectId>(val => Types.ObjectId.isValid(val as string), {
    message: "Invalid sub-category ID",
  }).optional(),
  location: z.object({
    division: z.string(),
    district: z.string(),
    upazila: z.string(),
  }),
  images: z.array(z.string().url()).min(1, { message: 'At least one image is required.' }),
});

export const updateServiceSchema = z.object({
  title: z.string().min(5).optional(),
  description: z.string().min(20).optional(),
  price: z.number().positive().optional(),
  status: z.enum(['available', 'unavailable']).optional(),
});