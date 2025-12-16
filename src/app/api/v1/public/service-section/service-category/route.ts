import { ServiceCategoryController } from "@/lib/modules/service-section/serviceCategory/serviceCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(ServiceCategoryController.getAllServiceCategories);