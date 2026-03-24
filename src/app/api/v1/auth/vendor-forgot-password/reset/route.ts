import { AuthController } from '@/lib/modules/auth/auth.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Reset Vendor Password using Token
 * @method POST
 */
export const POST = catchAsync(AuthController.vendorResetPassword);