import { SubCategoryController } from "@/lib/modules/vendor-category/controllers/vendorSubCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(SubCategoryController.getAllSubCategories);
export const POST = catchAsync(SubCategoryController.createSubCategory);