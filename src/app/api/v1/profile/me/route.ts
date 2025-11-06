import { UserController } from '@/lib/modules/user/user.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const GET = catchAsync(UserController.getMyProfile);
export const PATCH = catchAsync(UserController.updateMyProfile);
export const DELETE = catchAsync(UserController.deleteMyAccount); 