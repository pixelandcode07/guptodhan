// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\classifieds-banners\route.ts

import { ClassifiedBannerController } from '@/lib/modules/classifieds-banner/banner.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// সকল ব্যানার দেখা (পাবলিক)
export const GET = catchAsync(ClassifiedBannerController.getAllPublicBanners);

// নতুন ব্যানার তৈরি করা (শুধুমাত্র অ্যাডমিন)
export const POST = catchAsync(checkRole(['admin'])(ClassifiedBannerController.createBanner));