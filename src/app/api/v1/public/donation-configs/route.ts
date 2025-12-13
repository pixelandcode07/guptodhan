import { DonationConfigController } from '@/lib/modules/donation-config/donation-config.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Get the current donation page configuration.
 * This is a public route for all website visitors.
 * @method GET
 */
export const GET = catchAsync(DonationConfigController.getDonationConfig);