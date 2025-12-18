// D:\yeamin student\Guptodhan Project\guptodhan\src\app\api\v1\users\[id]\route.ts

import { UserController } from '@/lib/modules/user/user.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// ✅ GET - Single user fetch (admin only)
export const GET = catchAsync(
  checkRole(['admin'])(UserController.getUserById)
);

// ✅ PATCH - Update user (admin only)
export const PATCH = catchAsync(
  checkRole(['admin'])(UserController.updateUserByAdmin)
);

// ✅ DELETE - Delete user (admin only)
export const DELETE = catchAsync(
  checkRole(['admin'])(UserController.deleteUserByAdmin)
);