import {DeviceConditionController} from '@/lib/modules/product-config/controllers/deviceCondition.controller';
import {catchAsync} from '@/lib/middlewares/catchAsync';

export const PATCH = catchAsync(DeviceConditionController.updateDeviceCondition);
export const DELETE = catchAsync(DeviceConditionController.deleteDeviceCondition);