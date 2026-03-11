import { WithdrawalController } from '@/lib/modules/withdrawal/withdrawal.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// শুধুমাত্র Admin সব রিকোয়েস্ট দেখতে পারবে
export const GET = catchAsync(checkRole(['admin'])(WithdrawalController.getAllRequests));

// শুধুমাত্র Vendor টাকা তোলার রিকোয়েস্ট করতে পারবে
export const POST = catchAsync(checkRole(['vendor'])(WithdrawalController.createRequest));