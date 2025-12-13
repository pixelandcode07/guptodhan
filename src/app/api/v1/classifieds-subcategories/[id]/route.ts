// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\classifieds-subcategories\[id]\route.ts

import { ClassifiedSubCategoryController } from '@/lib/modules/classifieds-subcategory/subcategory.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// সাব-ক্যাটাগরি আপডেট করা (শুধুমাত্র অ্যাডমিন)
export const PATCH = catchAsync(checkRole(['admin'])(ClassifiedSubCategoryController.updateSubCategory));

// নতুন: সাব-ক্যাটাগরি ডিলিট করা (শুধুমাত্র অ্যাডমিন)
export const DELETE = catchAsync(checkRole(['admin'])(ClassifiedSubCategoryController.deleteSubCategory));