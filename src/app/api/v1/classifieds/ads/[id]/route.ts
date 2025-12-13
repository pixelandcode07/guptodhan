// নতুন ফাইল: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\classifieds\ads\[id]\route.ts
// এই ডাইনামিক রুটটি একটি নির্দিষ্ট বিজ্ঞাপন হ্যান্ডেল করবে

import { ClassifiedAdController } from '@/lib/modules/classifieds/ad.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
// import { checkRole } from '@/lib/middlewares/checkRole';

// একটি নির্দিষ্ট বিজ্ঞাপন দেখার জন্য
export const GET = catchAsync(ClassifiedAdController.getSingleAd);
// একটি নির্দিষ্ট বিজ্ঞাপন আপডেট করার জন্য
export const PATCH = catchAsync(ClassifiedAdController.updateAd);
// একটি নির্দিষ্ট বিজ্ঞাপন ডিলিট করার জন্য
export const DELETE = catchAsync(ClassifiedAdController.deleteAd);

