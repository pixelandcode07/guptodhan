// নতুন ফাইল
// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\classifieds-subcategories\route.ts
import { ClassifiedSubCategoryController } from '@/lib/modules/classifieds-subcategory/subcategory.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// নতুন সাব-ক্যাটাগরি তৈরি করা (শুধুমাত্র অ্যাডমিন)
export const POST = catchAsync(checkRole(['admin'])(ClassifiedSubCategoryController.createSubCategory));