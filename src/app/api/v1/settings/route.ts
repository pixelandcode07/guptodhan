// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\settings\route.ts
import { SettingsController } from '@/lib/modules/settings/settings.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// অ্যাডমিন রুট: সেটিংস তৈরি বা আপডেট করার জন্য
export const POST = catchAsync(checkRole(['admin'])(SettingsController.createOrUpdateSettings));