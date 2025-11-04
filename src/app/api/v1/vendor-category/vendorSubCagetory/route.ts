import { catchAsync } from "@/lib/middlewares/catchAsync";
import { ChildCategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomChildCategory.controller";

export const GET = catchAsync(ChildCategoryController.getAllChildCategories);
export const POST = catchAsync(ChildCategoryController.createChildCategory);