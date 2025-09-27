import { ChildCategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomChildCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(ChildCategoryController.getAllChildCategories);
export const POST = catchAsync(ChildCategoryController.createChildCategory);