import {DeviceConditionController} from '@/lib/modules/product-config/controllers/deviceCondition.controller';
import {catchAsync} from '@/lib/middlewares/catchAsync';
import {checkRole} from '@/lib/middlewares/checkRole';

export const PATCH = catchAsync(checkRole(["admin"])(DeviceConditionController.updateDeviceCondition));
export const DELETE = catchAsync(checkRole(["admin"])(DeviceConditionController.deleteDeviceCondition));