// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\seo-settings\route.ts
import { SeoSettingsController } from '@/lib/modules/seo-settings/seo.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// অ্যাডমিন রুট: SEO সেটিংস তৈরি বা আপডেট করার জন্য
export const POST = catchAsync(checkRole(['admin'])(SeoSettingsController.createOrUpdateSeoSettings));

export const GET = catchAsync(SeoSettingsController.getPublicSeoSettings);


