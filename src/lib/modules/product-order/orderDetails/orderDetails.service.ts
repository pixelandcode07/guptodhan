import { IOrderDetails } from './orderDetails.interface';
import { OrderDetailsModel } from './orderDetails.model';
import { Types } from 'mongoose';

// Create order detail
const createOrderDetailsInDB = async (payload: Partial<IOrderDetails>) => {
  const result = await OrderDetailsModel.create(payload);
  return result;
};

// Get all order details
const getAllOrderDetailsFromDB = async () => {
  const result = await OrderDetailsModel.find({}).sort({ createdAt: -1 });
  return result;
};

// Get order details by orderId
const getOrderDetailsByOrderIdFromDB = async (orderId: string) => {
  const result = await OrderDetailsModel.find({ orderId: new Types.ObjectId(orderId) });
  return result;
};

// Update order detail
const updateOrderDetailsInDB = async (id: string, payload: Partial<IOrderDetails>) => {
  const result = await OrderDetailsModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Order detail not found to update.');
  }
  return result;
};

// Delete order detail
const deleteOrderDetailsFromDB = async (id: string) => {
  const result = await OrderDetailsModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Order detail not found to delete.');
  }
  return null;
};

export const OrderDetailsServices = {
  createOrderDetailsInDB,
  getAllOrderDetailsFromDB,
  getOrderDetailsByOrderIdFromDB,
  updateOrderDetailsInDB,
  deleteOrderDetailsFromDB,
};
