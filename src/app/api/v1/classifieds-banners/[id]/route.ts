// নতুন ফাইল: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\classifieds-banners\[id]\route.ts

import { ClassifiedBannerController } from '@/lib/modules/classifieds-banner/banner.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// ব্যানার ডিলিট করা (শুধুমাত্র অ্যাডমিন)
export const DELETE = catchAsync(checkRole(['admin'])(ClassifiedBannerController.deleteBanner));