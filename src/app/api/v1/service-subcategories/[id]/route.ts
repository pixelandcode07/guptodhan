// নতুন ফাইল
// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\service-subcategories\[id]\route.ts

import { ServiceSubCategoryController } from '@/lib/modules/service-subcategory/serviceSubCategory.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// সাব-ক্যাটাগরি আপডেট করা (শুধুমাত্র অ্যাডমিন)
export const PATCH = catchAsync(checkRole(['admin'])(ServiceSubCategoryController.updateSubCategory));

// সাব-ক্যাটাগরি ডিলিট করা (শুধুমাত্র অ্যাডমিন)
export const DELETE = catchAsync(checkRole(['admin'])(ServiceSubCategoryController.deleteSubCategory));