import { DeliveryChargeController } from "@/lib/modules/delivery-charge/deliveryCharge.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const GET = catchAsync(DeliveryChargeController.getAllDeliveryCharges);
export const POST = catchAsync(DeliveryChargeController.createDeliveryCharges);
