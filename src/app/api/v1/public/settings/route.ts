// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\public\settings\route.ts
import { SettingsController } from '@/lib/modules/settings/settings.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

// পাবলিক রুট: ফ্রন্টএন্ডে সেটিংস দেখানোর জন্য
export const GET = catchAsync(SettingsController.getPublicSettings);