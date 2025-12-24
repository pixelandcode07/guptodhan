import { ServiceProviderController } from "@/lib/modules/service-section/serviceProvider/serviceProvider.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const PATCH = catchAsync(checkRole(["admin"])(ServiceProviderController.promoteToServiceProvider));
// export const PATCH = catchAsync((ServiceProviderController.promoteToServiceProvider));