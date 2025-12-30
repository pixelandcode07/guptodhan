import { ServiceController } from "@/lib/modules/service-section/provideService/provideService.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(ServiceController.getAllServices);
// export const POST = catchAsync(ServiceController.createService);
export const POST = catchAsync(checkRole(['service-provider'])(ServiceController.createService));