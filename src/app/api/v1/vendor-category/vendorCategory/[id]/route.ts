import { CategoryController } from "@/lib/modules/vendor-category/controllers/vendorCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(CategoryController.updateCategory);
export const DELETE = catchAsync(CategoryController.deleteCategory);