import { OrderController } from "@/lib/modules/product-order/order/order.controller";
import { catchAsync } from "@/lib/middlewares/catchAsync"; 

// GET /api/v1/product-order/return/[userId]
export const GET = catchAsync(OrderController.getReturnedOrdersByUser);