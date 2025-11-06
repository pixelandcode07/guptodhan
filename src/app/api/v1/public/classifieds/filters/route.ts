import { catchAsync } from '@/lib/middlewares/catchAsync';
import { ClassifiedAdController } from '@/lib/modules/classifieds/ad.controller';

/**
 * @description Get aggregated filter counts (locations, brands) for a category. (Public)
 * @method GET
 */
export const GET = catchAsync(ClassifiedAdController.getFiltersForCategory);