import { catchAsync } from "@/lib/middlewares/catchAsync";
import { ClassifiedCategoryController } from "@/lib/modules/classifieds-category/category.controller";

// ✅ Public categories with ad count route
export const GET = catchAsync(ClassifiedCategoryController.getPublicCategoriesWithCounts);
