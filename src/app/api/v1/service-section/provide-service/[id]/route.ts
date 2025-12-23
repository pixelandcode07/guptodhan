import {ServiceController} from "@/lib/modules/service-section/provideService/provideService.controller";
import {catchAsync} from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(ServiceController.getServiceById);
export const PATCH = catchAsync(ServiceController.updateService);
export const DELETE = catchAsync(ServiceController.deleteService);