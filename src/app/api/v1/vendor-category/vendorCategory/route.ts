import { catchAsync } from "@/lib/middlewares/catchAsync";
import { CategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomCategory.controller";

export const GET = catchAsync(CategoryController.getAllCategories);
export const POST = catchAsync(CategoryController.createCategory);