import { catchAsync } from "@/lib/middlewares/catchAsync";
import { DonationCategoryController } from "@/lib/modules/donation-category/donation-category.controller";

/**
 * @description Get all active donation categories. (Public)
 * @method GET
 */
export const GET = catchAsync(DonationCategoryController.getActiveCategories);