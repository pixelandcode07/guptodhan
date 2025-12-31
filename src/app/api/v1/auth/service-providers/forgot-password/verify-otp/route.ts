import { AuthController } from '@/lib/modules/auth/auth.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
export const POST = catchAsync(AuthController.serviceProviderVerifyForgotPasswordOtp);