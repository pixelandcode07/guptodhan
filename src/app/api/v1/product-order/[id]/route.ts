import { NextRequest, NextResponse } from 'next/server';
import { OrderController } from '@/lib/modules/product-order/order/order.controller';
import { catchAsync } from '@/lib/middlewares/catchAsync';

// Get, update, or delete a specific order
export const GET = catchAsync(OrderController.getOrderById);
export const PATCH = catchAsync(OrderController.updateOrder);
export const DELETE = catchAsync(OrderController.deleteOrder);
