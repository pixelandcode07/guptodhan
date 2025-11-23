// import { CategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { SubCategoryController } from "@/lib/modules/ecommerce-category/controllers/ecomSubCategory.controller";

// export const GET = catchAsync(CategoryController.getProductsByCategorySlug);

export const GET = catchAsync(SubCategoryController.getProductsBySubCategorySlug);

