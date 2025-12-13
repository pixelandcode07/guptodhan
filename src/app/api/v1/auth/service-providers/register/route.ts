import { UserController } from '@/lib/modules/user/user.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Registers a new service provider using the centralized User module.
 * @method POST
 */
export const POST = catchAsync(UserController.registerServiceProvider);