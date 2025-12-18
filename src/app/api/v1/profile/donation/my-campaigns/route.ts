import { DonationProfileController } from '@/lib/modules/donation-profile/donation-profile.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

export const GET = catchAsync(DonationProfileController.getMyCampaigns);