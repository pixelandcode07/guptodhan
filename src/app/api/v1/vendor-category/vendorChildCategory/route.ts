import { catchAsync } from "@/lib/middlewares/catchAsync";
import { SubCategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomSubCategory.controller";

export const GET = catchAsync(SubCategoryController.getAllSubCategories);
export const POST = catchAsync(SubCategoryController.createSubCategory);