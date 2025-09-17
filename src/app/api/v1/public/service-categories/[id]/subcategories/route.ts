import { catchAsync } from "@/lib/middlewares/catchAsync";
import { ServiceSubCategoryController } from "@/lib/modules/service-subcategory/serviceSubCategory.controller";

export const GET = catchAsync(ServiceSubCategoryController.getSubCategoriesByParent);
