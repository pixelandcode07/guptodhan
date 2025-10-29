import { CategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";


export const PATCH = catchAsync(checkRole(["admin"])(CategoryController.updateCategory));
export const DELETE = catchAsync(checkRole(["admin"])(CategoryController.deleteCategory));