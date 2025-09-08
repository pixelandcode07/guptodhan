// নতুন ফাইল
// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\brands\[id]\route.ts

import { BrandController } from '@/lib/modules/brand/brand.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// ব্র্যান্ড আপডেট করা (শুধুমাত্র অ্যাডমিন)
export const PATCH = catchAsync(checkRole(['admin'])(BrandController.updateBrand));
// ব্র্যান্ড ডিলিট করা (শুধুমাত্র অ্যাডমিন)
export const DELETE = catchAsync(checkRole(['admin'])(BrandController.deleteBrand));