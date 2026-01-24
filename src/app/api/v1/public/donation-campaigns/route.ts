import { DonationCampaignController } from '@/lib/modules/donation-campaign/donation-campaign.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Get all active donation campaigns. (Public)
 * @method GET
 */
export const GET = catchAsync(DonationCampaignController.getApprovedCampaigns);
