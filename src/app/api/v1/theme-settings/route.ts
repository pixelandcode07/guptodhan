// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\theme-settings\route.ts
import { ThemeSettingsController } from '@/lib/modules/theme-settings/theme.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// অ্যাডমিন রুট: থিম কালার তৈরি বা আপডেট করার জন্য
export const POST = catchAsync(checkRole(['admin'])(ThemeSettingsController.createOrUpdateTheme));