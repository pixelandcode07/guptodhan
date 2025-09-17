import { DonationConfigController } from '@/lib/modules/donation-config/donation-config.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

export const POST = catchAsync(checkRole(['admin'])(DonationConfigController.setDonationConfig));
export const DELETE = catchAsync(checkRole(['admin'])(DonationConfigController.deleteDonationConfig));
