import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';
import { AccountDeletionController } from '@/lib/modules/account-deletion/accountDeletion.controller';

// রিকোয়েস্ট আপডেট (Approve/Reject) করার জন্য
export const PATCH = catchAsync(
  checkRole(['admin'])(AccountDeletionController.processDeletionRequest)
);