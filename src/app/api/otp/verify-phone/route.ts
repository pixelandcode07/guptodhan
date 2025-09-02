import { OtpController } from '@/lib/modules/otp/otp.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const POST = catchAsync(OtpController.verifyPhoneOtp);