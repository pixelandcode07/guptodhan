import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";
import { DonationCampaignController } from "@/lib/modules/donation-campaign/donation-campaign.controller";

export const GET = catchAsync(
  checkRole(['admin'])(DonationCampaignController.getPendingCampaigns)
);