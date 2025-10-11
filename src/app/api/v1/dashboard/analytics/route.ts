import { DashboardController } from '@/lib/modules/dashboard/dashboard.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description Get all analytics data for the admin dashboard. (Admin Only)
 * @method GET
 */
export const GET = catchAsync(checkRole(['admin'])(DashboardController.getDashboardAnalytics));