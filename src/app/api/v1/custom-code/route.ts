// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\custom-code\route.ts
import { CustomCodeController } from '@/lib/modules/custom-code/customCode.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// অ্যাডমিন রুট: Custom CSS & JS তৈরি বা আপডেট করার জন্য
export const POST = catchAsync(checkRole(['admin'])(CustomCodeController.createOrUpdateCode));