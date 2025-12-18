import { DonationCampaignController } from '@/lib/modules/donation-campaign/donation-campaign.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// GET Single Campaign
export const GET = catchAsync(DonationCampaignController.getCampaignById);

// UPDATE Campaign (Only Admin or specific logic)
export const PATCH = catchAsync(checkRole(['admin', 'user'])(DonationCampaignController.updateCampaign));

// DELETE Campaign (Only Admin)
export const DELETE = catchAsync(checkRole(['admin'])(DonationCampaignController.deleteCampaign));