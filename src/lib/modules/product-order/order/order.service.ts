import { IOrder } from './order.interface';
import { OrderModel } from './order.model';
import { Types } from 'mongoose';

// ✅ Import Models explicitly to prevent MissingSchemaError
import '@/lib/modules/product/vendorProduct.model';
import '@/lib/modules/vendor-store/vendorStore.model'; 
import '@/lib/modules/promo-code/promoCode.model';

const createOrderInDB = async (payload: Partial<IOrder>) => {
  const result = await OrderModel.create(payload);
  return result;
};

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
        model: 'OrderDetails',
        populate: {
          path: 'productId',
          select: 'productTitle thumbnailImage productPrice discountPrice photoGallery',
          model: 'VendorProductModel',
        },
      })
      .populate({
        path: 'couponId',
        select: 'code value type title minimumOrderAmount',
        model: 'PromoCodeModel',
      })
      .sort({ orderDate: -1 })
      .lean();
    return result;
  } catch (error) {
    console.error('Error in getAllOrdersFromDB:', error);
    throw error;
  }
};

const getOrdersByUserFromDB = async (userId: string) => {
  try {
    const result = await OrderModel.find({ userId: new Types.ObjectId(userId) })
      .populate({
        path: 'orderDetails',
        model: 'OrderDetails',
        populate: {
          path: 'productId',
          select: 'productTitle thumbnailImage productPrice discountPrice photoGallery',
          model: 'VendorProductModel',
        },
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

const updateOrderInDB = async (id: string, payload: Partial<IOrder>) => {
  const result = await OrderModel.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Order not found to update.');
  }
  return result;
};

const deleteOrderFromDB = async (id: string) => {
  const result = await OrderModel.findByIdAndDelete(id);
  if (!result) {
    throw new Error('Order not found to delete.');
  }
  return null;
};

const getOrderByIdFromDB = async (id: string) => {
  const result = await OrderModel.findById(id)
    .populate('userId', 'name email phoneNumber')
    .populate('storeId', 'storeName')
    .populate({
      path: 'orderDetails',
      model: 'OrderDetails',
      populate: {
        path: 'productId',
        select: 'productTitle thumbnailImage productPrice discountPrice photoGallery',
        model: 'VendorProductModel',
      },
    })
    .populate({
      path: 'couponId',
      select: 'code value type title minimumOrderAmount',
      model: 'PromoCodeModel',
    })
    .lean();
  return result;
};

const getSalesReportFromDB = async (filters: {
  startDate?: string;
  endDate?: string;
  orderStatus?: string;
  paymentStatus?: string;
  paymentMethod?: string;
}) => {
  try {
    const query: Record<string, any> = {};

    if (filters.startDate || filters.endDate) {
      query.orderDate = {};
      if (filters.startDate) {
        query.orderDate.$gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        const endDate = new Date(filters.endDate);
        endDate.setHours(23, 59, 59, 999);
        query.orderDate.$lte = endDate;
      }
    }

    if (filters.orderStatus?.trim()) query.orderStatus = filters.orderStatus.trim();
    if (filters.paymentStatus?.trim()) query.paymentStatus = filters.paymentStatus.trim();
    if (filters.paymentMethod?.trim()) {
      query.paymentMethod = { $regex: filters.paymentMethod.trim(), $options: 'i' };
    }

    const result = await OrderModel.find(query)
      .populate('userId', 'name email phoneNumber')
      .populate('storeId', 'storeName')
      .populate({
        path: 'orderDetails',
        model: 'OrderDetails',
        populate: {
          path: 'productId',
          select: 'productTitle thumbnailImage productPrice discountPrice',
          model: 'VendorProductModel',
        },
      })
      .populate({
        path: 'couponId',
        select: 'code value type title minimumOrderAmount',
        model: 'PromoCodeModel',
      })
      .sort({ orderDate: -1 })
      .lean();

    return result;
  } catch (error) {
    console.error('Error in getSalesReportFromDB:', error);
    throw error;
  }
};

const getReturnedOrdersByUserFromDB = async (userId: string) => {
  try {
    const result = await OrderModel.find({
      userId: new Types.ObjectId(userId),
      // Check both Returned and Return Request status
      orderStatus: { $in: ['Returned', 'Return Request'] }, 
    })
      .populate({
        path: 'orderDetails',
        model: 'OrderDetails',
        populate: {
          path: 'productId',
          select: 'productTitle thumbnailImage productPrice discountPrice',
          model: 'VendorProductModel',
        },
      })
      .populate('storeId', 'storeName')
      .sort({ updatedAt: -1 })
      .lean();

    return result;
  } catch (error) {
    console.error('Error in getReturnedOrdersByUserFromDB:', error);
    throw error;
  }
};

const getFilteredOrdersFromDB = async (filters: any) => {
  const query: any = {};

  if (filters.orderId?.trim()) query.orderId = filters.orderId.trim();
  if (filters.orderForm) query.orderForm = filters.orderForm;
  if (filters.paymentStatus) query.paymentStatus = filters.paymentStatus;
  if (filters.orderStatus) query.orderStatus = filters.orderStatus;

  if (filters.customerName) query.shippingName = { $regex: filters.customerName, $options: 'i' };
  if (filters.customerPhone) query.shippingPhone = { $regex: filters.customerPhone, $options: 'i' };
  if (filters.deliveryMethod) query.deliveryMethodId = filters.deliveryMethod;

  if (filters.orderedProduct && Types.ObjectId.isValid(filters.orderedProduct)) {
    query.orderDetails = { $in: [filters.orderedProduct] };
  }

  if (filters.couponCode) {
    query['coupon.code'] = filters.couponCode.toUpperCase();
  }

  if (filters.startDate && filters.endDate) {
    query.orderDate = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    };
  }

  const orders = await OrderModel.find(query)
    .populate('userId', 'name email phoneNumber')
    .populate('storeId', 'storeName')
    .populate({
      path: 'orderDetails',
      model: 'OrderDetails',
      populate: {
        path: 'productId',
        select: 'productTitle thumbnailImage productPrice discountPrice photoGallery',
        model: 'VendorProductModel',
      },
    })
    .populate({
      path: 'couponId',
      select: 'code value type title minimumOrderAmount',
      model: 'PromoCodeModel',
    })
    .sort({ orderDate: -1 })
    .lean();

  return orders;
};

// ✅ Request Return Logic
const requestReturnInDB = async (orderId: string, reason: string) => {
  // Find by _id (ObjectId)
  const order = await OrderModel.findById(orderId);
  if (!order) throw new Error('Order not found');

  if (order.orderStatus !== 'Delivered') {
    throw new Error('Only delivered orders can be returned');
  }

  // Update status and reason
  order.orderStatus = 'Return Request';
  order.returnReason = reason;
  
  await order.save();
  return order;
};

export const OrderServices = {
  createOrderInDB,
  getAllOrdersFromDB,
  getOrdersByUserFromDB,
  getOrderByIdFromDB,
  updateOrderInDB,
  deleteOrderFromDB,
  getSalesReportFromDB,
  getReturnedOrdersByUserFromDB,
  getFilteredOrdersFromDB,
  requestReturnInDB, // ✅ Exported
};