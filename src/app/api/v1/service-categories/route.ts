// ফাইল পাথ: src/app/api/v1/service-categories/route.ts

import { ServiceCategoryController } from '@/lib/modules/service-category/serviceCategory.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description সকল فعال সার্ভিস ক্যাটাগরির তালিকা প্রদান করে।
 * এটি একটি পাবলিক রুট, যে কেউ অ্যাক্সেস করতে পারবে।
 * @method GET
 */
export const GET = catchAsync(ServiceCategoryController.getAllCategories);

/**
 * @description একটি নতুন সার্ভিস ক্যাটাগরি তৈরি করে।
 * শুধুমাত্র 'admin' role-এর ব্যবহারকারীরাই এই কাজটি করতে পারবে।
 * @method POST
 */
export const POST = catchAsync(checkRole(['admin'])(ServiceCategoryController.createCategory));