import { DonationCategoryController } from '@/lib/modules/donation-category/donation-category.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

/**
 * @description Get a single active donation category by its ID. (Public)
 * @method GET
 */
export const GET = catchAsync(DonationCategoryController.getCategoryById);