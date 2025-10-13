import { DonationCategoryController } from '@/lib/modules/donation-category/donation-category.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

/**
 * @description Update a donation category. (Admin Only)
 * @method PATCH
 */
export const PATCH = catchAsync(checkRole(['admin'])(DonationCategoryController.updateCategory));

/**
 * @description Delete a donation category. (Admin Only)
 * @method DELETE
 */
export const DELETE = catchAsync(checkRole(['admin'])(DonationCategoryController.deleteCategory));