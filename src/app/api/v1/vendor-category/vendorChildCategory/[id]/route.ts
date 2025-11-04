import { catchAsync } from "@/lib/middlewares/catchAsync";
import { SubCategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomSubCategory.controller";

// export const GET = catchAsync(SubCategoryController?.getSubCategoriesByCategory);
export const PATCH = catchAsync(SubCategoryController?.updateSubCategory);
export const DELETE = catchAsync(SubCategoryController?.deleteSubCategory);
