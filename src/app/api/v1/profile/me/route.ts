// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\profile\me\route.ts
import { UserController } from '@/lib/modules/user/user.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

// এই রুটটি সকল লগইন করা ইউজারদের জন্য
export const GET = catchAsync(UserController.getMyProfile);
export const PATCH = catchAsync(UserController.updateMyProfile);
export const DELETE = catchAsync(UserController.deleteMyAccount); // <-- নতুন: DELETE মেথড যোগ করা হলো