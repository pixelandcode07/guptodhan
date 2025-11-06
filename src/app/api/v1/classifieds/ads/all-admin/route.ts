import { ClassifiedAdController } from '@/lib/modules/classifieds/ad.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description Get all ads (any status) for admin panel. (Admin Only)
 * @method GET
 */
export const GET = catchAsync(checkRole(['admin'])(ClassifiedAdController.getAllAdsForAdmin));