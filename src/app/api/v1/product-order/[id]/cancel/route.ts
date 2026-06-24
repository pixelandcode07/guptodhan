import { OrderController } from "@/lib/modules/product-order/order/order.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

export const PATCH = catchAsync(OrderController.cancelOrderByUser);