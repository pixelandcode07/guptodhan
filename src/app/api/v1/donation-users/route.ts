import { DonationUserController } from '@/lib/modules/donation-stats/donation-user.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// শুধুমাত্র অ্যাডমিন এই লিস্ট দেখতে পারবে
export const GET = catchAsync(checkRole(['admin'])(DonationUserController.getDonationUsers));