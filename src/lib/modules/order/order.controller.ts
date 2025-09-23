import { NextRequest } from 'next/server';
import { sendResponse } from '@/lib/utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '@/lib/utils/jwt';
import { createOrderSchema } from './order.validation';
import { OrderServices } from './order.service';

const createOrder = async (req: NextRequest) => {
  const token = req.headers.get('authorization')?.split(' ')[1];
  if (!token) throw new Error('Unauthorized');
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
  const userId = decoded.userId;

  const body = await req.json();
  const validatedData = createOrderSchema.parse(body);

  const result = await OrderServices.createOrderInDB(userId, validatedData);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.CREATED,
    message: 'Order created successfully!',
    data: result,
  });
};

const getMyOrders = async (req: NextRequest) => {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if (!token) throw new Error('Unauthorized');
    const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET!);
    const userId = decoded.userId;

    const result = await OrderServices.getMyOrdersFromDB(userId);
    return sendResponse({ success: true, statusCode: StatusCodes.OK, message: 'Orders retrieved!', data: result });
};

export const OrderController = {
  createOrder,
  getMyOrders,
};