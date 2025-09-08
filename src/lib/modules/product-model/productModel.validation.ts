// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\lib\modules\product-model\productModel.validation.ts
import { z } from 'zod';

export const createProductModelValidationSchema = z.object({
  name: z.string().min(1, { message: 'Model name is required.' }),
  brand: z.string({ required_error: 'Parent brand ID is required.' }),
});

// নতুন: মডেল আপডেট করার জন্য
export const updateProductModelValidationSchema = z.object({
    name: z.string().min(1).optional(),
    brand: z.string().optional(),
    status: z.enum(['active', 'inactive']).optional(),
});