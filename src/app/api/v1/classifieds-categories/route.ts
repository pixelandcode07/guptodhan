// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\classifieds-categories\route.ts

import { ClassifiedCategoryController } from '@/lib/modules/classifieds-category/category.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';


// নতুন ক্যাটাগরি তৈরি করা (শুধুমাত্র অ্যাডমিন)
export const POST = catchAsync(checkRole(['admin'])(ClassifiedCategoryController.createCategory));