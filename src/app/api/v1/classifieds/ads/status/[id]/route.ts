import { ClassifiedAdController } from '@/lib/modules/classifieds/ad.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description Update ad status by admin (Approve/Reject). (Admin Only)
 * @method PATCH
 */
export const PATCH = catchAsync(checkRole(['admin'])(ClassifiedAdController.updateAdStatus));