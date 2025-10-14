import { DeviceConditionController } from "@/lib/modules/product-config/controllers/deviceCondition.controller";    
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(DeviceConditionController.getAllDeviceConditions);
export const POST = catchAsync(DeviceConditionController.createDeviceCondition);