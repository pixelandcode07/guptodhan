// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\public\custom-code\route.ts
import { CustomCodeController } from '@/lib/modules/custom-code/customCode.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

// পাবলিক রুট: ফ্রন্টএন্ডে Custom CSS & JS দেখানোর জন্য
export const GET = catchAsync(CustomCodeController.getPublicCode);