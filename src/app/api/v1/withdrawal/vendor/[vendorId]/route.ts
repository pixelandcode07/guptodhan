import { WithdrawalController } from '@/lib/modules/withdrawal/withdrawal.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// ভেন্ডর তার নিজের হিস্ট্রি দেখতে পারবে
export const GET = catchAsync(checkRole(['vendor'])(WithdrawalController.getVendorHistory));