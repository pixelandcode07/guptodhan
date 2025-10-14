import { CategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(CategoryController.getAllCategories);
export const POST = catchAsync(CategoryController.createCategory);