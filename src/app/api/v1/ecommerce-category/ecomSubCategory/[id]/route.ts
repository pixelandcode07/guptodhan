import { SubCategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomSubCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";  
import { checkRole } from "@/lib/middlewares/checkRole";


export const PATCH = catchAsync(checkRole(["admin"])(SubCategoryController.updateSubCategory));
export const DELETE = catchAsync(checkRole(["admin"])(SubCategoryController.deleteSubCategory));