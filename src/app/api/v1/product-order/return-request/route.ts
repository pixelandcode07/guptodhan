import { OrderController } from "@/lib/modules/product-order/order/order.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync";

// POST /api/v1/product-order/return-request
export const POST = catchAsync(OrderController.requestReturn);