// নতুন ফাইল
// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src/app/api/v1/public/categories-with-subcategories/route.ts

import { ClassifiedCategoryController } from '@/lib/modules/classifieds-category/category.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

// এই রুটটি সম্পূর্ণ পাবলিক থাকবে এবং কোনো টোকেনের প্রয়োজন হবে না
export const GET = catchAsync(ClassifiedCategoryController.getCategoriesWithSubcategories);