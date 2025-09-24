import { catchAsync } from "@/lib/middlewares/catchAsync";
import { ClassifiedSubCategoryController } from "@/lib/modules/classifieds-subcategory/subcategory.controller";

export const GET = catchAsync(ClassifiedSubCategoryController.getSubCategoriesByParent);