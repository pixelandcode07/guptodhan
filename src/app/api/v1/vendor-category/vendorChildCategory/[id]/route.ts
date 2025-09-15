import { SubCategoryController } from "@/lib/modules/vendor-category/controllers/vendorSubCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

// export const GET = catchAsync(SubCategoryController?.getSubCategoriesByCategory);
export const PATCH = catchAsync(SubCategoryController?.updateSubCategory);
export const DELETE = catchAsync(SubCategoryController?.deleteSubCategory);
