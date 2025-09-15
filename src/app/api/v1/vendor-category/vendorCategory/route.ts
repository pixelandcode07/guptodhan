import { CategoryController } from "@/lib/modules/vendor-category/controllers/vendorCategory.controller";   
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(CategoryController.getAllCategories);
export const POST = catchAsync(CategoryController.createCategory);