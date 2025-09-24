import { catchAsync } from "@/lib/middlewares/catchAsync";
import { ClassifiedCategoryController } from "@/lib/modules/classifieds-category/category.controller";

export const GET = catchAsync(ClassifiedCategoryController.getAllCategories);