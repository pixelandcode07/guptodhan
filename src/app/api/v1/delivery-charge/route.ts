import { DeliveryChargeController } from "@/lib/modules/delivery-charge/deliveryCharge.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";
import { checkRole } from "@/lib/middlewares/checkRole";

export const GET = catchAsync(DeliveryChargeController.getAllDeliveryCharges);
export const POST = catchAsync(checkRole(["admin"])(DeliveryChargeController.createDeliveryCharges));
