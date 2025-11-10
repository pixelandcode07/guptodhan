import { IOrder } from './order.interface';
import { OrderModel } from './order.model';
import { Types } from 'mongoose';


import '@/lib/modules/product/vendorProduct.model';
import '@/lib/modules/vendor-store/vendorStore.model';
import '@/lib/modules/vendor/vendor.model';
import '@/lib/modules/promo-code/promoCode.model'; // Import PromoCodeModel for couponId populate
import '../orderDetails/orderDetails.model';



import { StoreModel } from '@/lib/modules/vendor-store/vendorStore.model';
import { VendorProductModel } from '@/lib/modules/product/vendorProduct.model';
import { Vendor } from '@/lib/modules/vendor/vendor.model';


const _ = { StoreModel, VendorProductModel, Vendor };


const createOrderInDB = async (payload: Partial<IOrder>) => {
  const result = await OrderModel.create(payload);
  console.log(result)
  return result;
};

// Get all orders
const getAllOrdersFromDB = async (status?: string) => {
  try {
    const filter: Record<string, unknown> = {};
    if (status) {
      filter.orderStatus = status;
    }
    const result = await OrderModel.find(filter)
      .populate('userId', 'name email phoneNumber')
      .populate('storeId', 'storeName')
      .populate({
        path: 'orderDetails',
        populate: {
          path: 'productId',
          select: 'productTitle thumbnailImage productPrice discountPrice photoGallery',
          model: 'VendorProductModel'
        }
      })
      .populate({
        path: 'couponId',
        select: 'code value type title minimumOrderAmount',
        model: 'PromoCodeModel'
      })
      .sort({ orderDate: -1 })
      .lean(); 
    return result;
  } catch (error) {
    console.error('Error in getAllOrdersFromDB:', error);
    throw error;
  }
};

// Get orders by user
const getOrdersByUserFromDB = async (userId: string) => {
  try {
    const result = await OrderModel.find({ userId: new Types.ObjectId(userId) })
      .populate({
        path: 'orderDetails',
        populate: {
          path: 'productId',
          select: 'productTitle thumbnailImage productPrice discountPrice photoGallery',
          model: 'VendorProductModel'
        }
      })
      .populate('storeId', 'storeName')
      .sort({ orderDate: -1 })
      .lean(); 
    return result;
  } catch (error) {
    console.error('Error in getOrdersByUserFromDB:', error);
    throw error;
  }
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
    .populate({
      path: 'orderDetails',
      populate: {
        path: 'productId',
        select: 'productTitle thumbnailImage productPrice discountPrice photoGallery',
        model: 'VendorProductModel'
      }
    })
    .populate({
      path: 'couponId',
      select: 'code value type title minimumOrderAmount',
      model: 'PromoCodeModel'
    })
    .lean(); // Use lean() to get plain JavaScript objects for better serialization
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
