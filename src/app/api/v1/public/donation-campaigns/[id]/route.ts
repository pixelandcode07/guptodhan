import { DonationCampaignController } from '@/lib/modules/donation-campaign/donation-campaign.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Get a single donation campaign by ID. (Public)
 * @method GET
 */
export const GET = catchAsync(DonationCampaignController.getCampaignById);