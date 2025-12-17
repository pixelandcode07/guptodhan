import { NextRequest } from 'next/server';
import { StatusCodes } from 'http-status-codes';
import { sendResponse } from '@/lib/utils/sendResponse';
import { OrderDetailsServices } from './orderDetails.service';
import { IOrderDetails } from './orderDetails.interface';
import dbConnect from '@/lib/db';


// Get all order details
const getAllOrderDetails = async () => {
  await dbConnect();
  const result = await OrderDetailsServices.getAllOrderDetailsFromDB();

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order details retrieved successfully!',
    data: result,
  });
};

// Get order details by order ID
const getOrderDetailsByOrderId = async (req: NextRequest, { params }: { params: Promise<{ orderId: string }> }) => {
  await dbConnect();
  const { orderId } = await params;
  const result = await OrderDetailsServices.getOrderDetailsByOrderIdFromDB(orderId);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order details retrieved successfully for the order!',
    data: result,
  });
};

// Update order detail
const updateOrderDetails = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;
  const body = await req.json();

  const payload: Partial<IOrderDetails> = {};
  if (body.orderId) payload.orderId = body.orderId;
  if (body.productId) payload.productId = body.productId;
  if (body.vendorId) payload.vendorId = body.vendorId;
  if (body.quantity) payload.quantity = body.quantity;
  if (body.unitPrice) payload.unitPrice = body.unitPrice;
  if (body.discountPrice) payload.discountPrice = body.discountPrice;
  if (body.totalPrice) payload.totalPrice = body.totalPrice;

  const result = await OrderDetailsServices.updateOrderDetailsInDB(id, payload);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order detail updated successfully!',
    data: result,
  });
};

// Delete order detail
const deleteOrderDetails = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  await dbConnect();
  const { id } = await params;

  await OrderDetailsServices.deleteOrderDetailsFromDB(id);

  return sendResponse({
    success: true,
    statusCode: StatusCodes.OK,
    message: 'Order detail deleted successfully!',
    data: null,
  });
};

export const OrderDetailsController = {
//   createOrderDetails,
  getAllOrderDetails,
  getOrderDetailsByOrderId,
  updateOrderDetails,
  deleteOrderDetails,
};
