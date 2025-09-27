import { SubCategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomSubCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";  


export const PATCH = catchAsync(SubCategoryController.updateSubCategory);
export const DELETE = catchAsync(SubCategoryController.deleteSubCategory);