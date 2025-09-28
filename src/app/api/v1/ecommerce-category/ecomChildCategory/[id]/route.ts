import { ChildCategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomChildCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(ChildCategoryController.updateChildCategory);
export const DELETE = catchAsync(ChildCategoryController.deleteChildCategory);