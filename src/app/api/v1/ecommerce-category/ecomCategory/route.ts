import { CategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(CategoryController.getAllCategories);
export const POST = catchAsync(checkRole(["admin"])(CategoryController.createCategory));
// export const POST = catchAsync(CategoryController.createCategory);