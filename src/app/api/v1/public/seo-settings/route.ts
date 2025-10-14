// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\public\seo-settings\route.ts
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { SeoSettingsController } from '@/lib/modules/seo-settings/seo.controller';

// পাবলিক রুট: ফ্রন্টএন্ডে SEO ডেটা দেখানোর জন্য
export const GET = catchAsync(SeoSettingsController.getPublicSeoSettings);