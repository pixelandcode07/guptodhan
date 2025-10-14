import { DeliveryChargeController } from "@/lib/modules/delivery-charge/deliveryCharge.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(DeliveryChargeController.updateDeliveryCharge);