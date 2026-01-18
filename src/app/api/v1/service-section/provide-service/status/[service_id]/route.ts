import {ServiceController} from "@/lib/modules/service-section/provideService/provideService.controller";
import {catchAsync} from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const PATCH = catchAsync(checkRole(['service-provider'])(ServiceController.changeServiceStatus));
