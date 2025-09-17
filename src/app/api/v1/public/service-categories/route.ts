import { catchAsync } from "@/lib/middlewares/catchAsync";
import { ServiceCategoryController } from "@/lib/modules/service-category/serviceCategory.controller";

export const GET = catchAsync(ServiceCategoryController.getAllCategories);