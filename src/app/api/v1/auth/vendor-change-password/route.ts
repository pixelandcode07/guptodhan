import { AuthController } from '@/lib/modules/auth/auth.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// এই রুটটি প্রোটেক্টেড।
// catchAsync পুরো রিকোয়েস্টকে wrap করছে
// checkRole নিশ্চিত করছে যে রিকোয়েস্টটি একজন 'vendor' করছে
export const POST = catchAsync(
  checkRole(['vendor'])(AuthController.vendorChangePassword)
);