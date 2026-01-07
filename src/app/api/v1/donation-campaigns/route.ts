import { DonationCampaignController } from '@/lib/modules/donation-campaign/donation-campaign.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

export const POST = catchAsync(
  checkRole(['user', 'admin', 'vendor', 'service-provider'])(
    DonationCampaignController.createCampaign
  )
);
export const GET = catchAsync(DonationCampaignController.getAllCampaigns);