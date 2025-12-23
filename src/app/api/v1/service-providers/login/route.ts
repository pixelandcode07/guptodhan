import { AuthController } from '@/lib/modules/auth/auth.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Service Provider Login
 * @method POST
 */
export const POST = catchAsync(AuthController.serviceProviderLogin);
