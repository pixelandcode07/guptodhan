import { DonationStatsController } from '@/lib/modules/donation-stats/donation-stats.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

// শুধুমাত্র অ্যাডমিন এক্সেস পাবে
export const GET = catchAsync(checkRole(['admin'])(DonationStatsController.getAdminDashboardStats));