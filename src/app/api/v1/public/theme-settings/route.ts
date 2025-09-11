// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\public\theme-settings\route.ts
import { ThemeSettingsController } from '@/lib/modules/theme-settings/theme.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

// পাবলিক রুট: ফ্রন্টএন্ডে থিম কালার দেখানোর জন্য
export const GET = catchAsync(ThemeSettingsController.getPublicTheme);