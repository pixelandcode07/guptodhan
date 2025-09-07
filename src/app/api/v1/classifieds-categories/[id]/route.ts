// নতুন ফাইল: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\classifieds-categories\[id]\route.ts

import { ClassifiedCategoryController } from '@/lib/modules/classifieds-category/category.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// ক্যাটাগরি আপডেট করা (শুধুমাত্র অ্যাডমিন)
export const PATCH = catchAsync(checkRole(['admin'])(ClassifiedCategoryController.updateCategory));
// ক্যাটাগরি ডিলিট করা (শুধুমাত্র অ্যাডমিন)
export const DELETE = catchAsync(checkRole(['admin'])(ClassifiedCategoryController.deleteCategory));