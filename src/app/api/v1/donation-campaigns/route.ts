import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';
import { DonationCampaignController } from '@/lib/modules/donation-campaign/donation-campaign.controller';

/**
 * @description Create a new donation campaign. (Any logged in user)
 * @method POST
 */
export const POST = catchAsync(checkRole(['user', 'service-provider', 'admin', 'vendor'])(DonationCampaignController.createCampaign));