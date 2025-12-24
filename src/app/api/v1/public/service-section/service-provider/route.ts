import { ServiceProviderController } from "@/lib/modules/service-section/serviceProvider/serviceProvider.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(ServiceProviderController.getAllUsersPublic);