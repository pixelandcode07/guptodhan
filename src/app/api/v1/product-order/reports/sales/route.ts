// src/app/api/v1/product-order/reports/sales/route.ts
import { OrderController } from '@/lib/modules/product-order/order/order.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';
import { checkRole } from '@/lib/middlewares/checkRole';

export const GET = catchAsync(checkRole(['admin'])(OrderController.getSalesReport));
