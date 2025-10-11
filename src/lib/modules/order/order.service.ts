/* eslint-disable @typescript-eslint/no-explicit-any */
import { VendorProductModel } from '../product/vendorProduct.model';
import { Order } from './order.model';
import { Types } from 'mongoose';

const createOrderInDB = async (userId: string, payload: any) => {
  const productIds = payload.items.map((item: any) => item.productId);
  const productsFromDB = await VendorProductModel.find({ _id: { $in: productIds } });

  let totalAmount = 0;
  const orderItems = payload.items.map((item: any) => {
    const product = productsFromDB.find(p => p._id.toString() === item.productId);
    if (!product) {
      throw new Error(`Product with ID ${item.productId} not found.`);
    }
    // ক্লায়েন্টের পাঠানো দাম বিশ্বাস না করে, ডেটাবেস থেকে আসল দাম নেওয়া হচ্ছে
    totalAmount += product.price * item.quantity;
    return {
      product: new Types.ObjectId(item.productId),
      quantity: item.quantity,
      price: product.price,
    };
  });

  const orderData = {
    orderNo: `ORDER-${Date.now()}`, // একটি সাধারণ ইউনিক অর্ডার নম্বর
    user: new Types.ObjectId(userId),
    items: orderItems,
    totalAmount,
    shippingAddress: payload.shippingAddress,
    contactPhone: payload.contactPhone,
    paymentMethod: payload.paymentMethod,
  };

  const result = await Order.create(orderData);
  return result;
};

// নির্দিষ্ট ইউজারের সব অর্ডার দেখার জন্য
const getMyOrdersFromDB = async (userId: string) => {
    return await Order.find({ user: userId }).sort({ createdAt: -1 });
};

export const OrderServices = {
  createOrderInDB,
  getMyOrdersFromDB,
};