import { ServiceCategoryController } from "@/lib/modules/service-section/serviceCategory/serviceCategory.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(checkRole(["admin"])(ServiceCategoryController.getServiceCategoryById));
export const PATCH = catchAsync(checkRole(["admin"])(ServiceCategoryController.updateServiceCategory));
export const DELETE = catchAsync(checkRole(["admin"])(ServiceCategoryController.deleteServiceCategory));