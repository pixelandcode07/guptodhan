import { DeliveryChargeController } from "@/lib/modules/delivery-charge/deliveryCharge.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const PATCH = catchAsync(checkRole(["admin"])(DeliveryChargeController.updateDeliveryCharge));
export const DELETE = catchAsync(checkRole(["admin"])(DeliveryChargeController.deleteDeliveryCharge));