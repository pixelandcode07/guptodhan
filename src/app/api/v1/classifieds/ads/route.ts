// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\classifieds\ads\route.ts
// এই ফাইলটি এখন GET (সব) এবং POST (নতুন তৈরি) হ্যান্ডেল করবে

import { ClassifiedAdController } from '@/lib/modules/classifieds/ad.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

// নতুন: সকল বিজ্ঞাপন দেখার জন্য
export const GET = catchAsync(ClassifiedAdController.getAllAds);
// নতুন বিজ্ঞাপন তৈরি করার জন্য (আগের মতোই)
export const POST = catchAsync(ClassifiedAdController.createAd);