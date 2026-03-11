import { AuthController } from '@/lib/modules/auth/auth.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Send OTP to Vendor Email for Password Reset
 * @method POST
 */
export const POST = catchAsync(AuthController.vendorSendForgotPasswordOtp);