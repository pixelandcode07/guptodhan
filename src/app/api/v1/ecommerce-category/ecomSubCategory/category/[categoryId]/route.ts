import { SubCategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomSubCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(SubCategoryController.getSubCategoriesByCategory);
