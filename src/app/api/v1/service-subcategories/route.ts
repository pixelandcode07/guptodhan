// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\service-subcategories\route.ts
import { ServiceSubCategoryController } from '@/lib/modules/service-subcategory/serviceSubCategory.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// নতুন সাব-ক্যাটাগরি তৈরি করা (শুধুমাত্র অ্যাডমিন)
export const POST = catchAsync(checkRole(['admin'])(ServiceSubCategoryController.createSubCategory));