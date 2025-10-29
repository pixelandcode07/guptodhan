import { SubCategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomSubCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(SubCategoryController.getAllSubCategories);
export const POST = catchAsync(checkRole(["admin"])(SubCategoryController.createSubCategory));