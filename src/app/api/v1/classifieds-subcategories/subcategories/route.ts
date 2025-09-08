// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\classifieds-categories\[id]\subcategories\route.ts

import { ClassifiedSubCategoryController } from '@/lib/modules/classifieds-subcategory/subcategory.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

// একটি নির্দিষ্ট ক্যাটাগরির অধীনে থাকা সব সাব-ক্যাটাগরি দেখা (পাবলিক)
export const GET = catchAsync(ClassifiedSubCategoryController.getSubCategoriesByParent);