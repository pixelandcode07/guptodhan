import { AuthController } from '@/lib/modules/auth/auth.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Verify Vendor OTP and Return Reset Token
 * @method POST
 */
export const POST = catchAsync(AuthController.vendorVerifyForgotPasswordOtp);