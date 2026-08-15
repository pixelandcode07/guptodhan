import { ServiceProviderController } from "@/lib/modules/service-provider/serviceProvider.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(ServiceProviderController.getUserById);

export const DELETE = catchAsync(checkRole(["admin"])(ServiceProviderController.deleteServiceProvider));