import { CategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(CategoryController.getFeaturedCategories);
