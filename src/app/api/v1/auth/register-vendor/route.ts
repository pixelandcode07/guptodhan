// D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\auth\register-vendor\route.ts

import { AuthController } from '@/lib/modules/auth/auth.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const POST = catchAsync(AuthController.registerVendor);