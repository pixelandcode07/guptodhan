import { AuthController } from '@/lib/modules/auth/auth.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

// এই রাউটে বডি হিসেবে { "identifier": "...", "otp": "..." } পাঠাতে হবে
export const POST = catchAsync(AuthController.verifyForgotPasswordOtp);