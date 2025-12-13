// ফাইল পাথ: src/app/api/v1/service-categories/[id]/route.ts

import { ServiceCategoryController } from '@/lib/modules/service-category/serviceCategory.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description একটি নির্দিষ্ট সার্ভিস ক্যাটাগরিকে তার ID দিয়ে আপডেট করে।
 * শুধুমাত্র 'admin' role-এর ব্যবহারকারীরাই এই কাজটি করতে পারবে।
 * @method PATCH
 */
export const PATCH = catchAsync(checkRole(['admin'])(ServiceCategoryController.updateCategory));

/**
 * @description একটি নির্দিষ্ট সার্ভিস ক্যাটাগরিকে তার ID দিয়ে ডিলিট করে।
 * শুধুমাত্র 'admin' role-এর ব্যবহারকারীরাই এই কাজটি করতে পারবে।
 * @method DELETE
 */
export const DELETE = catchAsync(checkRole(['admin'])(ServiceCategoryController.deleteCategory));