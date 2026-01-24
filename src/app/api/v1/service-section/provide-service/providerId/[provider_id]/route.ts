import {ServiceController} from "@/lib/modules/service-section/provideService/provideService.controller";
import {catchAsync} from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(ServiceController.getProviderServices);