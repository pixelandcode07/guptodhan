import { OrderController } from '@/lib/modules/order/order.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';
/**
 * @description Create a new order. 
 * Requires the user to be logged in with any valid role.
 * @method POST
 */
export const POST = catchAsync(checkRole(['user', 'vendor', 'service-provider', 'admin'])(OrderController.createOrder));

/**
 * @description Get all orders for the currently logged-in user.
 * Requires the user to be logged in with any valid role.
 * @method GET
 */
export const GET = catchAsync(checkRole(['user', 'vendor', 'service-provider', 'admin'])(OrderController.getMyOrders));