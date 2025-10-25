import { ChildCategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomChildCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(ChildCategoryController.getAllChildCategories);
export const POST = catchAsync(checkRole(["admin"])(ChildCategoryController.createChildCategory));