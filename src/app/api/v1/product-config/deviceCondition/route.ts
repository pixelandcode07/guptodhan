import { DeviceConditionController } from "@/lib/modules/product-config/controllers/deviceCondition.controller";    
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(checkRole(["admin"])(DeviceConditionController.getAllDeviceConditions));
export const POST = catchAsync(checkRole(["admin"])(DeviceConditionController.createDeviceCondition));