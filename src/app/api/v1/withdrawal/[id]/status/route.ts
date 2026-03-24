import { WithdrawalController } from '@/lib/modules/withdrawal/withdrawal.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// শুধুমাত্র Admin রিকোয়েস্ট অ্যাপ্রুভ বা রিজেক্ট করতে পারবে
export const PATCH = catchAsync(checkRole(['admin'])(WithdrawalController.updateStatus));