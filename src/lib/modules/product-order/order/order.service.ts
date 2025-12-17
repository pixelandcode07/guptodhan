import { IOrder } from './order.interface';
import { OrderModel } from './order.model';
import { Types } from 'mongoose';

// ✅ IMPORTANT: Import ALL models BEFORE using them
import '@/lib/modules/product/vendorProduct.model';
import '@/lib/modules/vendor-store/vendorStore.model'; // ✅ Store Model
import '@/lib/modules/promo-code/promoCode.model';

// ✅ Create Order with validation
const createOrderInDB = async (payload: Partial<IOrder>) => {
  try {
    if (!payload.userId || !payload.storeId) {
      throw new Error('userId and storeId are required fields');
    }

    console.log('📝 Creating order with payload:', {
      orderId: payload.orderId,
      userId: payload.userId,
      storeId: payload.storeId,
      totalAmount: payload.totalAmount,
    });

    const result = await OrderModel.create(payload);

    console.log('✅ Order created successfully:', result._id);
    return result;
  } catch (error: any) {
    console.error('❌ Error in createOrderInDB:', error.message);
    throw error;
  }
};

// ✅ Get all orders
const getAllOrdersFromDB = async (status?: string) => {
  try {
    const filter: Record<string, unknown> = {};

    if (status) {
      filter.orderStatus = status;
    }

    console.log('📊 Fetching all orders with filter:', filter);

    const result = await OrderModel.find(filter)
      .populate('userId', 'name email phoneNumber')
      .populate('storeId', 'storeName') // ✅ Ensure Store is imported
      .populate({
        path: 'orderDetails',
        model: 'OrderDetails',
        populate: {
          path: 'productId',
          select:
            'productTitle thumbnailImage productPrice discountPrice photoGallery',
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

    console.log(`✅ Found ${result.length} orders`);
    return result;
  } catch (error: any) {
    console.error('❌ Error in getAllOrdersFromDB:', error.message);
    throw error;
  }
};

// ✅ Get orders by user - MAIN FUNCTION
const getOrdersByUserFromDB = async (userId: string) => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid userId format');
    }

    console.log('👤 Fetching orders for user:', userId);

    const result = await OrderModel.find({ userId: new Types.ObjectId(userId) })
      .populate({
        path: 'orderDetails',
        model: 'OrderDetails',
        populate: {
          path: 'productId',
          select:
            'productTitle thumbnailImage productPrice discountPrice photoGallery',
          model: 'VendorProductModel',
        },
      })
      .populate('storeId', 'storeName') // ✅ Populate Store with storeId reference
      .sort({ orderDate: -1 })
      .lean();

    console.log(`✅ Found ${result.length} orders for user`);
    return result;
  } catch (error: any) {
    console.error('❌ Error in getOrdersByUserFromDB:', error.message);
    throw error;
  }
};

// ✅ Update order
const updateOrderInDB = async (id: string, payload: Partial<IOrder>) => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid order ID format');
    }

    console.log('📝 Updating order:', id);

    const result = await OrderModel.findByIdAndUpdate(id, payload, {
      new: true,
    });

    if (!result) {
      throw new Error('Order not found to update.');
    }

    console.log('✅ Order updated successfully');
    return result;
  } catch (error: any) {
    console.error('❌ Error in updateOrderInDB:', error.message);
    throw error;
  }
};

// ✅ Delete order
const deleteOrderFromDB = async (id: string) => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid order ID format');
    }

    console.log('🗑️ Deleting order:', id);

    const result = await OrderModel.findByIdAndDelete(id);

    if (!result) {
      throw new Error('Order not found to delete.');
    }

    console.log('✅ Order deleted successfully');
    return null;
  } catch (error: any) {
    console.error('❌ Error in deleteOrderFromDB:', error.message);
    throw error;
  }
};

// ✅ Get order by ID
const getOrderByIdFromDB = async (id: string) => {
  try {
    if (!Types.ObjectId.isValid(id)) {
      throw new Error('Invalid order ID format');
    }

    console.log('🔍 Fetching order by ID:', id);

    const result = await OrderModel.findById(id)
      .populate('userId', 'name email phoneNumber')
      .populate('storeId', 'storeName') // ✅ Populate Store
      .populate({
        path: 'orderDetails',
        model: 'OrderDetails',
        populate: {
          path: 'productId',
          select:
            'productTitle thumbnailImage productPrice discountPrice photoGallery',
          model: 'VendorProductModel',
        },
      })
      .populate({
        path: 'couponId',
        select: 'code value type title minimumOrderAmount',
        model: 'PromoCodeModel',
      })
      .lean();

    if (!result) {
      console.warn('⚠️ Order not found:', id);
      return null;
    }

    console.log('✅ Order found');
    return result;
  } catch (error: any) {
    console.error('❌ Error in getOrderByIdFromDB:', error.message);
    throw error;
  }
};

// ✅ Get sales report
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

    if (filters.orderStatus?.trim()) {
      query.orderStatus = filters.orderStatus.trim();
    }

    if (filters.paymentStatus?.trim()) {
      query.paymentStatus = filters.paymentStatus.trim();
    }

    if (filters.paymentMethod?.trim()) {
      query.paymentMethod = {
        $regex: filters.paymentMethod.trim(),
        $options: 'i',
      };
    }

    console.log('📊 Fetching sales report with query:', query);

    const result = await OrderModel.find(query)
      .populate('userId', 'name email phoneNumber')
      .populate('storeId', 'storeName') // ✅ Populate Store
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

    console.log(`✅ Found ${result.length} orders in sales report`);
    return result;
  } catch (error: any) {
    console.error('❌ Error in getSalesReportFromDB:', error.message);
    throw error;
  }
};

// ✅ Get returned orders by user
const getReturnedOrdersByUserFromDB = async (userId: string) => {
  try {
    if (!Types.ObjectId.isValid(userId)) {
      throw new Error('Invalid userId format');
    }

    console.log('📦 Fetching returned orders for user:', userId);

    const result = await OrderModel.find({
      userId: new Types.ObjectId(userId),
      orderStatus: 'Returned',
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
      .populate('storeId', 'storeName') // ✅ Populate Store
      .sort({ orderDate: -1 })
      .lean();

    console.log(`✅ Found ${result.length} returned orders`);
    return result;
  } catch (error: any) {
    console.error('❌ Error in getReturnedOrdersByUserFromDB:', error.message);
    throw error;
  }
};

// ✅ Get filtered orders
const getFilteredOrdersFromDB = async (filters: any) => {
  try {
    const query: any = {};

    if (filters.orderId?.trim()) query.orderId = filters.orderId.trim();
    if (filters.orderForm) query.orderForm = filters.orderForm;
    if (filters.paymentStatus?.trim()) query.paymentStatus = filters.paymentStatus.trim();
    if (filters.orderStatus?.trim()) query.orderStatus = filters.orderStatus.trim();

    if (filters.customerName?.trim()) {
      query.shippingName = { $regex: filters.customerName, $options: 'i' };
    }
    if (filters.customerPhone?.trim()) {
      query.shippingPhone = { $regex: filters.customerPhone, $options: 'i' };
    }

    if (filters.deliveryMethod?.trim()) {
      query.deliveryMethodId = filters.deliveryMethod;
    }

    if (filters.orderedProduct && Types.ObjectId.isValid(filters.orderedProduct)) {
      query.orderDetails = { $in: [filters.orderedProduct] };
    }

    if (filters.couponCode?.trim()) {
      query['coupon.code'] = filters.couponCode.toUpperCase();
    }

    if (filters.startDate && filters.endDate) {
      query.orderDate = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      };
    }

    console.log('🔎 Fetching filtered orders with query:', query);

    const orders = await OrderModel.find(query)
      .populate('userId', 'name email phoneNumber')
      .populate('storeId', 'storeName') // ✅ Populate Store
      .populate({
        path: 'orderDetails',
        model: 'OrderDetails',
        populate: {
          path: 'productId',
          select:
            'productTitle thumbnailImage productPrice discountPrice photoGallery',
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

    console.log(`✅ Found ${orders.length} filtered orders`);
    return orders;
  } catch (error: any) {
    console.error('❌ Error in getFilteredOrdersFromDB:', error.message);
    throw error;
  }
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
};