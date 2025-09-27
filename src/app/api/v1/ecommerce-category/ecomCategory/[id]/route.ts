import { CategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";


export const PATCH = catchAsync(CategoryController.updateCategory);
export const DELETE = catchAsync(CategoryController.deleteCategory);