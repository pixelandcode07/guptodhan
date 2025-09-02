// ফাইল পাথ: D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\otp\send\route.ts
import { OtpController } from '@/lib/modules/otp/otp.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const POST = catchAsync(OtpController.sendOtp);