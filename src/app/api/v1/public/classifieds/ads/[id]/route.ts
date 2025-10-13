import { ClassifiedAdController } from '@/lib/modules/classifieds/ad.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Get a single classified ad by its ID. (Public)
 * @method GET
 */
export const GET = catchAsync(ClassifiedAdController.getPublicAdById);