import { DonationCategoryController } from '@/lib/modules/donation-category/donation-category.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description Create a new donation category. (Admin Only)
 * @method POST
 */
export const POST = catchAsync(checkRole(['admin'])(DonationCategoryController.createCategory));
export const PATCH = catchAsync(checkRole(['admin'])(DonationCategoryController.reorderDonationCategory)); // added by naeem

