import { ChildCategoryController } from "@/lib/modules/vendor-category/controllers/vendorChildCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

// export const GET = catchAsync(ChildCategoryController.getAllChildCategories);
export const PATCH = catchAsync(ChildCategoryController.updateChildCategory);
export const DELETE = catchAsync(ChildCategoryController.deleteChildCategory);