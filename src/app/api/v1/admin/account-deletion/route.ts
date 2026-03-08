import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';
import { AccountDeletionController } from '@/lib/modules/account-deletion/accountDeletion.controller';

// সব রিকোয়েস্ট লিস্ট দেখার জন্য
export const GET = catchAsync(
  checkRole(['admin'])(AccountDeletionController.getAllDeletionRequests)
);