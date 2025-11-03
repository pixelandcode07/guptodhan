import { NextRequest, NextResponse } from 'next/server';
import { OrderController } from '@/lib/modules/product-order/order/order.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

// Get orders for the authenticated user
// Accept userId from query params or headers
export const GET = catchAsync(OrderController.getMyOrders);
