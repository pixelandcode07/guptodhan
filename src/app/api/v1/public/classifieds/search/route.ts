import { ClassifiedAdController } from '@/lib/modules/classifieds/ad.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Search and filter classified ads. (Public)
 * @method GET
 */
export const GET = catchAsync(ClassifiedAdController.searchAds);