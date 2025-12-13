// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\brands\route.ts

import { BrandController } from '@/lib/modules/brand/brand.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';


// নতুন ব্র্যান্ড তৈরি করা (শুধুমাত্র অ্যাডমিন)
export const POST = catchAsync(checkRole(['admin'])(BrandController.createBrand));