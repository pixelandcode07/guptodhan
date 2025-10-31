import { IOrder } from './order.interface';
import { OrderModel } from './order.model';
import { Types } from 'mongoose';

// Create a new order
const createOrderInDB = async (payload: Partial<IOrder>) => {
  const result = await OrderModel.create(payload);
  return result;
};

// Get all orders
const getAllOrdersFromDB = async (status?: string) => {
  const filter: Record<string, unknown> = {};
  if (status) {
    filter.orderStatus = status;
  }
  const result = await OrderModel.find(filter).sort({ orderDate: -1 });
  return result;
};

// Get orders by user
const getOrdersByUserFromDB = async (userId: string) => {
  const result = await OrderModel.find({ userId: new Types.ObjectId(userId) })
    .populate({
      path: 'orderDetails',
      populate: {
        path: 'productId',
        select: 'productTitle thumbnailImage productPrice discountPrice'
      }
    })
    .populate('storeId', 'storeName')
    .sort({ orderDate: -1 });
  return result;
};

// Update order
const updateOrderInDB = async (id: string, payload: Partial<IOrder>) => {
  const result = await OrderModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Order not found to update.');
  }
  return result;
};

// Delete order
const deleteOrderFromDB = async (id: string) => {
  const result = await OrderModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Order not found to delete.');
  }
  return null;
};

// Get order by ID
const getOrderByIdFromDB = async (id: string) => {
  const result = await OrderModel.findById(id)
    .populate('userId', 'name email phoneNumber')
    .populate('storeId', 'storeName')
    .populate('orderDetails')
    .populate('paymentMethodId', 'name')
    .populate('couponId', 'couponCode discountAmount');
  return result;
};

export const OrderServices = {
  createOrderInDB,
  getAllOrdersFromDB,
  getOrdersByUserFromDB,
  getOrderByIdFromDB,
  updateOrderInDB,
  deleteOrderFromDB,
};
