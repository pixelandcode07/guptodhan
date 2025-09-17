import { DonationCampaignController } from '@/lib/modules/donation-campaign/donation-campaign.controller.ts';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description Create a new donation campaign. (Any logged in user)
 * @method POST
 */
export const POST = catchAsync(checkRole(['user', 'service-provider', 'admin'])(DonationCampaignController.createCampaign));