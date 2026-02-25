import { IOrder } from './order.interface';
import { OrderModel } from './order.model';
import { Types } from 'mongoose';
import { StoreModel } from '../../vendor-store/vendorStore.model';

// ✅ Import Models explicitly
import '@/lib/modules/product/vendorProduct.model';
import '@/lib/modules/vendor-store/vendorStore.model'; 
import '@/lib/modules/promo-code/promoCode.model';

// ✅ Redis Cache Imports
import { getCachedData, deleteCacheKey, deleteCachePattern } from '@/lib/redis/cache-helpers';
import { CacheKeys, CacheTTL } from '@/lib/redis/cache-keys';

// ================================================================
// 📝 CREATE ORDER (WITHOUT TRANSACTIONS) ✅ FIXED
// ================================================================
const createOrderInDB = async (payload: Partial<IOrder>) => {
  try {
    // Simple create without transaction - works on any MongoDB setup
    const result = await OrderModel.create(payload);

    // 🗑️ Clear user's order cache
    if (payload.userId) {
      await deleteCachePattern(`orders:user:${payload.userId}*`);
    }
    
    // Clear all orders cache
    await deleteCachePattern(CacheKeys.PATTERNS.ORDER_ALL);

    console.log('✅ Order created successfully:', result._id);
    return result;
  } catch (error) {
    console.error('❌ Error creating order:', error);
    throw new Error(`Failed to create order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// ================================================================
// 📋 GET ALL ORDERS (WITH CACHE + AGGREGATION)
// ================================================================
const getAllOrdersFromDB = async (status?: string) => {
  const cacheKey = status ? `orders:all:status:${status}` : CacheKeys.ORDER.ALL;

  return getCachedData(
    cacheKey,
    async () => {
      try {
        const filter: Record<string, unknown> = {};
        if (status) {
          filter.orderStatus = status;
        }

        // ✅ Use aggregation instead of populate
        const result = await OrderModel.aggregate([
          { $match: filter },
          { $sort: { orderDate: -1 } },

          // Lookup user
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userId',
            },
          },
          { $unwind: { path: '$userId', preserveNullAndEmptyArrays: true } },

          // Lookup store
          {
            $lookup: {
              from: 'storemodels',
              localField: 'storeId',
              foreignField: '_id',
              as: 'storeId',
            },
          },
          { $unwind: { path: '$storeId', preserveNullAndEmptyArrays: true } },

          // Lookup order details
          {
            $lookup: {
              from: 'orderdetails',
              localField: 'orderDetails',
              foreignField: '_id',
              as: 'orderDetails',
            },
          },

          // Lookup products in order details
          {
            $lookup: {
              from: 'vendorproductmodels',
              localField: 'orderDetails.productId',
              foreignField: '_id',
              as: 'products',
            },
          },

          // Lookup coupon
          {
            $lookup: {
              from: 'promocodemodels',
              localField: 'couponId',
              foreignField: '_id',
              as: 'couponId',
            },
          },
          { $unwind: { path: '$couponId', preserveNullAndEmptyArrays: true } },

          // Project needed fields
          {
            $project: {
              orderId: 1,
              'userId.name': 1,
              'userId.email': 1,
              'userId.phoneNumber': 1,
              'storeId.storeName': 1,
              orderStatus: 1,
              paymentStatus: 1,
              paymentMethod: 1,
              totalAmount: 1,
              orderDate: 1,
              deliveryDate: 1,
              orderDetails: 1,
              'couponId.code': 1,
              'couponId.value': 1,
              shippingName: 1,
              shippingPhone: 1,
              shippingCity: 1,
              createdAt: 1,
            },
          },
        ]);

        return result;
      } catch (error) {
        console.error('Error in getAllOrdersFromDB:', error);
        throw error;
      }
    },
    CacheTTL.ORDER_LIST
  );
};

// ================================================================
// 🔍 GET ORDERS BY USER (WITH CACHE + AGGREGATION)
// ================================================================
const getOrdersByUserFromDB = async (userId: string) => {
  const cacheKey = CacheKeys.ORDER.BY_USER(userId);

  return getCachedData(
    cacheKey,
    async () => {
      try {
        const result = await OrderModel.aggregate([
          { $match: { userId: new Types.ObjectId(userId) } },
          { $sort: { orderDate: -1 } },

          // Lookup order details
          {
            $lookup: {
              from: 'orderdetails',
              localField: 'orderDetails',
              foreignField: '_id',
              as: 'orderDetails',
            },
          },

          // Lookup products
          {
            $lookup: {
              from: 'vendorproductmodels',
              localField: 'orderDetails.productId',
              foreignField: '_id',
              as: 'products',
            },
          },

          // Lookup store
          {
            $lookup: {
              from: 'storemodels',
              localField: 'storeId',
              foreignField: '_id',
              as: 'storeId',
            },
          },
          { $unwind: { path: '$storeId', preserveNullAndEmptyArrays: true } },

          // Merge product docs into each orderDetail so productId is populated (productTitle, thumbnailImage, etc.)
          {
            $project: {
              _id: 1,
              orderId: 1,
              orderStatus: 1,
              paymentStatus: 1,
              totalAmount: 1,
              orderDate: 1,
              storeId: 1,
              createdAt: 1,
              orderDetails: {
                $map: {
                  input: '$orderDetails',
                  as: 'd',
                  in: {
                    $mergeObjects: [
                      '$$d',
                      {
                        productId: {
                          $let: {
                            vars: {
                              found: {
                                $filter: {
                                  input: '$products',
                                  as: 'p',
                                  cond: { $eq: ['$$p._id', '$$d.productId'] },
                                },
                              },
                            },
                            in: { $arrayElemAt: ['$$found', 0] },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        ]);

        return result;
      } catch (error) {
        console.error('Error in getOrdersByUserFromDB:', error);
        throw error;
      }
    },
    CacheTTL.ORDER_USER
  );
};

// ================================================================
// ✏️ UPDATE ORDER
// ================================================================
const updateOrderInDB = async (id: string, payload: Partial<IOrder>) => {
  try {
    const result = await OrderModel.findByIdAndUpdate(id, payload, { new: true });
    
    if (!result) {
      throw new Error('Order not found to update.');
    }

    // 🗑️ Clear caches
    await deleteCacheKey(CacheKeys.ORDER.BY_ID(id));
    if (result.userId) {
      await deleteCachePattern(`orders:user:${result.userId}*`);
    }
    await deleteCachePattern(CacheKeys.PATTERNS.ORDER_ALL);

    console.log('✅ Order updated successfully:', id);
    return result;
  } catch (error) {
    console.error('❌ Error updating order:', error);
    throw error;
  }
};

// ================================================================
// 🗑️ DELETE ORDER
// ================================================================
const deleteOrderFromDB = async (id: string) => {
  try {
    const result = await OrderModel.findByIdAndDelete(id);
    
    if (!result) {
      throw new Error('Order not found to delete.');
    }

    // 🗑️ Clear caches
    await deleteCachePattern(CacheKeys.PATTERNS.ORDER_ALL);

    console.log('✅ Order deleted successfully:', id);
    return null;
  } catch (error) {
    console.error('❌ Error deleting order:', error);
    throw error;
  }
};

// ================================================================
// 🔍 GET ORDER BY ID (WITH CACHE + AGGREGATION)
// ================================================================
const getOrderByIdFromDB = async (id: string) => {
  const cacheKey = CacheKeys.ORDER.BY_ID(id);

  return getCachedData(
    cacheKey,
    async () => {
      try {
        const result = await OrderModel.aggregate([
          { $match: { _id: new Types.ObjectId(id) } },

          // Lookup user
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userId',
            },
          },
          { $unwind: { path: '$userId', preserveNullAndEmptyArrays: true } },

          // Lookup store
          {
            $lookup: {
              from: 'storemodels',
              localField: 'storeId',
              foreignField: '_id',
              as: 'storeId',
            },
          },
          { $unwind: { path: '$storeId', preserveNullAndEmptyArrays: true } },

          // Lookup order details
          {
            $lookup: {
              from: 'orderdetails',
              localField: 'orderDetails',
              foreignField: '_id',
              as: 'orderDetails',
            },
          },

          // Lookup products
          {
            $lookup: {
              from: 'vendorproductmodels',
              localField: 'orderDetails.productId',
              foreignField: '_id',
              as: 'products',
            },
          },

          // Lookup coupon
          {
            $lookup: {
              from: 'promocodemodels',
              localField: 'couponId',
              foreignField: '_id',
              as: 'couponId',
            },
          },
          { $unwind: { path: '$couponId', preserveNullAndEmptyArrays: true } },

          // Merge product docs into each orderDetail so productId is populated
          {
            $project: {
              orderId: 1,
              userId: 1,
              storeId: 1,
              deliveryMethodId: 1,
              paymentMethod: 1,
              shippingName: 1,
              shippingPhone: 1,
              shippingEmail: 1,
              shippingStreetAddress: 1,
              shippingCity: 1,
              shippingDistrict: 1,
              shippingPostalCode: 1,
              shippingCountry: 1,
              addressDetails: 1,
              deliveryCharge: 1,
              totalAmount: 1,
              paymentStatus: 1,
              orderStatus: 1,
              orderDate: 1,
              createdAt: 1,
              trackingId: 1,
              parcelId: 1,
              couponId: 1,
              orderDetails: {
                $map: {
                  input: '$orderDetails',
                  as: 'd',
                  in: {
                    $mergeObjects: [
                      '$$d',
                      {
                        productId: {
                          $let: {
                            vars: {
                              found: {
                                $filter: {
                                  input: '$products',
                                  as: 'p',
                                  cond: { $eq: ['$$p._id', '$$d.productId'] },
                                },
                              },
                            },
                            in: { $arrayElemAt: ['$$found', 0] },
                          },
                        },
                      },
                    ],
                  },
                },
              },
            },
          },
        ]);

        return result[0] || null;
      } catch (error) {
        console.error('Error in getOrderByIdFromDB:', error);
        throw error;
      }
    },
    CacheTTL.ORDER_DETAIL
  );
};

// ================================================================
// 📊 GET SALES REPORT (WITH CACHE + AGGREGATION)
// ================================================================
const getSalesReportFromDB = async (filters: {
  startDate?: string;
  endDate?: string;
  orderStatus?: string;
  paymentStatus?: string;
  paymentMethod?: string;
}) => {
  const cacheKey = `orders:sales-report:${JSON.stringify(filters)}`;

  return getCachedData(
    cacheKey,
    async () => {
      try {
        const match: Record<string, any> = {};

        if (filters.startDate || filters.endDate) {
          match.orderDate = {};
          if (filters.startDate) {
            match.orderDate.$gte = new Date(filters.startDate);
          }
          if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999);
            match.orderDate.$lte = endDate;
          }
        }

        if (filters.orderStatus?.trim()) match.orderStatus = filters.orderStatus.trim();
        if (filters.paymentStatus?.trim()) match.paymentStatus = filters.paymentStatus.trim();
        if (filters.paymentMethod?.trim()) {
          match.paymentMethod = { $regex: filters.paymentMethod.trim(), $options: 'i' };
        }

        const result = await OrderModel.aggregate([
          { $match: match },
          { $sort: { orderDate: -1 } },

          // Lookups (same as getAllOrders)
          {
            $lookup: {
              from: 'users',
              localField: 'userId',
              foreignField: '_id',
              as: 'userId',
            },
          },
          { $unwind: { path: '$userId', preserveNullAndEmptyArrays: true } },

          {
            $lookup: {
              from: 'storemodels',
              localField: 'storeId',
              foreignField: '_id',
              as: 'storeId',
            },
          },
          { $unwind: { path: '$storeId', preserveNullAndEmptyArrays: true } },

          {
            $lookup: {
              from: 'orderdetails',
              localField: 'orderDetails',
              foreignField: '_id',
              as: 'orderDetails',
            },
          },

          {
            $lookup: {
              from: 'promocodemodels',
              localField: 'couponId',
              foreignField: '_id',
              as: 'couponId',
            },
          },
          { $unwind: { path: '$couponId', preserveNullAndEmptyArrays: true } },
        ]);

        return result;
      } catch (error) {
        console.error('Error in getSalesReportFromDB:', error);
        throw error;
      }
    },
    CacheTTL.ORDER_REPORT
  );
};

// ================================================================
// 🔄 GET RETURNED ORDERS (WITH CACHE + AGGREGATION)
// ================================================================
const getReturnedOrdersByUserFromDB = async (userId: string) => {
  const cacheKey = `orders:user:${userId}:returned`;

  return getCachedData(
    cacheKey,
    async () => {
      try {
        const result = await OrderModel.aggregate([
          {
            $match: {
              userId: new Types.ObjectId(userId),
              orderStatus: { $in: ['Returned', 'Return Request'] },
            },
          },
          { $sort: { updatedAt: -1 } },

          // Lookup order details
          {
            $lookup: {
              from: 'orderdetails',
              localField: 'orderDetails',
              foreignField: '_id',
              as: 'orderDetails',
            },
          },

          // Lookup products
          {
            $lookup: {
              from: 'vendorproductmodels',
              localField: 'orderDetails.productId',
              foreignField: '_id',
              as: 'products',
            },
          },

          // Lookup store
          {
            $lookup: {
              from: 'storemodels',
              localField: 'storeId',
              foreignField: '_id',
              as: 'storeId',
            },
          },
          { $unwind: { path: '$storeId', preserveNullAndEmptyArrays: true } },
        ]);

        return result;
      } catch (error) {
        console.error('Error in getReturnedOrdersByUserFromDB:', error);
        throw error;
      }
    },
    CacheTTL.ORDER_USER
  );
};

// ================================================================
// 🔍 GET FILTERED ORDERS (NO CACHE - DYNAMIC FILTERS)
// ================================================================
const getFilteredOrdersFromDB = async (filters: any) => {
  const match: any = {};

  if (filters.orderId?.trim()) match.orderId = filters.orderId.trim();
  if (filters.orderForm) match.orderForm = filters.orderForm;
  if (filters.paymentStatus) match.paymentStatus = filters.paymentStatus;
  if (filters.orderStatus) match.orderStatus = filters.orderStatus;

  if (filters.customerName) match.shippingName = { $regex: filters.customerName, $options: 'i' };
  if (filters.customerPhone) match.shippingPhone = { $regex: filters.customerPhone, $options: 'i' };
  if (filters.deliveryMethod) match.deliveryMethodId = filters.deliveryMethod;

  if (filters.orderedProduct && Types.ObjectId.isValid(filters.orderedProduct)) {
    match.orderDetails = { $in: [filters.orderedProduct] };
  }

  if (filters.couponCode) {
    match['coupon.code'] = filters.couponCode.toUpperCase();
  }

  if (filters.startDate && filters.endDate) {
    match.orderDate = {
      $gte: new Date(filters.startDate),
      $lte: new Date(filters.endDate),
    };
  }

  // ✅ Use aggregation
  try {
    const orders = await OrderModel.aggregate([
      { $match: match },
      { $sort: { orderDate: -1 } },

      // Lookups
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'userId',
        },
      },
      { $unwind: { path: '$userId', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'storemodels',
          localField: 'storeId',
          foreignField: '_id',
          as: 'storeId',
        },
      },
      { $unwind: { path: '$storeId', preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: 'orderdetails',
          localField: 'orderDetails',
          foreignField: '_id',
          as: 'orderDetails',
        },
      },

      {
        $lookup: {
          from: 'promocodemodels',
          localField: 'couponId',
          foreignField: '_id',
          as: 'couponId',
        },
      },
      { $unwind: { path: '$couponId', preserveNullAndEmptyArrays: true } },
    ]);

    return orders;
  } catch (error) {
    console.error('Error in getFilteredOrdersFromDB:', error);
    throw error;
  }
};

// ================================================================
// 🔄 REQUEST RETURN
// ================================================================
const requestReturnInDB = async (orderId: string, reason: string) => {
  try {
    const order = await OrderModel.findById(orderId);
    
    if (!order) throw new Error('Order not found');

    if (order.orderStatus !== 'Delivered') {
      throw new Error('Only delivered orders can be returned');
    }

    order.orderStatus = 'Return Request';
    order.returnReason = reason;
    
    await order.save();

    // 🗑️ Clear caches
    await deleteCacheKey(CacheKeys.ORDER.BY_ID(orderId));
    if (order.userId) {
      await deleteCachePattern(`orders:user:${order.userId}*`);
    }

    console.log('✅ Return request created for order:', orderId);
    return order;
  } catch (error) {
    console.error('❌ Error requesting return:', error);
    throw error;
  }
};

// ================================================================
// 🏪 GET VENDOR STORE AND ORDERS
// ================================================================
const getVendorStoreAndOrdersFromDBVendor = async (vendorId: string) => {
  try {
    if (!Types.ObjectId.isValid(vendorId)) {
      throw new Error('Invalid Vendor ID format.');
    }

    const vId = new Types.ObjectId(vendorId);

    // ১. প্রথমে সরাসরি vendorId দিয়ে স্টোর খোঁজা
    let store = await StoreModel.findOne({ vendorId: vId });

    // ২. যদি না পাওয়া যায়, তবে চেক করা এই আইডিটি কি ইউজারের? 
    // যদি ইউজারের হয়, তবে তার প্রোফাইল থেকে vendorInfo (Vendor ID) নিয়ে স্টোর খোঁজা।
    if (!store) {
      const userWithVendor = await User.findById(vId).select('vendorInfo');
      if (userWithVendor && userWithVendor.vendorInfo) {
        store = await StoreModel.findOne({ vendorId: userWithVendor.vendorInfo });
      }
    }

    if (!store) {
      throw new Error('Store not found for this vendor account.');
    }

    // ৩. অর্ডারের এগ্রিগেশন (সব স্ট্যাটাসের অর্ডার আসবে)
    const orders = await OrderModel.aggregate([
      { $match: { storeId: store._id } },
      { $sort: { createdAt: -1 } },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'orderdetails',
          localField: 'orderDetails',
          foreignField: '_id',
          as: 'details',
        },
      },
      {
        $project: {
          _id: 1,
          orderId: 1,
          orderStatus: 1,
          paymentStatus: 1,
          totalAmount: 1,
          createdAt: 1,
          shippingName: 1,
          shippingPhone: 1,
          'user.name': 1,
          'user.email': 1,
          orderDetails: '$details',
        },
      },
    ]);

    return { store, orders };
  } catch (error: any) {
    console.error('Error fetching vendor orders:', error.message);
    throw error;
  }
};

// ================================================================
// 📤 EXPORTS
// ================================================================
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
  requestReturnInDB,
  getVendorStoreAndOrdersFromDBVendor
};