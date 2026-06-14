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
import { User } from '../../user/user.model';

// ================================================================
// 📝 CREATE ORDER (WITHOUT TRANSACTIONS)
// ================================================================
const createOrderInDB = async (payload: Partial<IOrder>) => {
  try {
    const result = await OrderModel.create(payload);

    if (payload.userId) {
      await deleteCachePattern(`orders:user:${payload.userId}*`);
    }
    
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

          // ✅ Project needed fields (Added products.productTitle & transactionId)
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
              'products.productTitle': 1, // ✅ FIX for Product Name Column
              'couponId.code': 1,
              'couponId.value': 1,
              shippingName: 1,
              shippingPhone: 1,
              shippingCity: 1,
              createdAt: 1,
              transactionId: 1, // ✅ FIX for Transaction ID Column
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
              from: 'vendorproductmodels',
              localField: 'orderDetails.productId',
              foreignField: '_id',
              as: 'products',
            },
          },

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
    const previousOrder = await OrderModel.findById(id).lean() as any;
    
    if (!previousOrder) {
      throw new Error('Order not found to update.');
    }

    const result = await OrderModel.findByIdAndUpdate(id, payload, { new: true });

    if (
      payload.orderStatus === 'Delivered' && 
      previousOrder.orderStatus !== 'Delivered' &&
      previousOrder.storeId
    ) {
      const store = await StoreModel.findById(previousOrder.storeId).lean() as any;
      
      if (store) {
        const commissionRate = store.commission || 0;
        const deliveryCharge = previousOrder.deliveryCharge || 0; 
        
        const productTotal = previousOrder.totalAmount - deliveryCharge;
        const vendorEarning = productTotal * (1 - commissionRate / 100);

        await StoreModel.findByIdAndUpdate(previousOrder.storeId, {
          $inc: {
            availableBalance: vendorEarning,
            totalEarned: vendorEarning,
          }
        });
      }
    }

    await deleteCacheKey(CacheKeys.ORDER.BY_ID(id));
    if (result?.userId) {
      await deleteCachePattern(`orders:user:${result.userId}*`);
    }
    await deleteCachePattern(CacheKeys.PATTERNS.ORDER_ALL);

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

    await deleteCachePattern(CacheKeys.PATTERNS.ORDER_ALL);
    return null;
  } catch (error) {
    console.error('❌ Error deleting order:', error);
    throw error;
  }
};

// ================================================================
// 🔍 GET ORDER BY ID
// ================================================================
const getOrderByIdFromDB = async (id: string) => {
  const cacheKey = CacheKeys.ORDER.BY_ID(id);

  return getCachedData(
    cacheKey,
    async () => {
      try {
        const result = await OrderModel.aggregate([
          { $match: { _id: new Types.ObjectId(id) } },
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
              from: 'vendorproductmodels',
              localField: 'orderDetails.productId',
              foreignField: '_id',
              as: 'products',
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
// 📊 GET SALES REPORT 
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
// 🔄 GET RETURNED ORDERS 
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
              from: 'vendorproductmodels',
              localField: 'orderDetails.productId',
              foreignField: '_id',
              as: 'products',
            },
          },
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
// 🔍 GET FILTERED ORDERS
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
  } else if (filters.startDate) {
      match.orderDate = { $gte: new Date(filters.startDate) };
  } else if (filters.endDate) {
      match.orderDate = { $lte: new Date(filters.endDate) };
  }

  try {
    const orders = await OrderModel.aggregate([
      { $match: match },
      { $sort: { orderDate: -1 } },
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
          from: 'vendorproductmodels',
          localField: 'orderDetails.productId',
          foreignField: '_id',
          as: 'products',
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
      
      // ✅ Project similar to getAllOrdersFromDB for uniformity
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
          'products.productTitle': 1, // ✅ FIX for Product Name Column
          'couponId.code': 1,
          'couponId.value': 1,
          shippingName: 1,
          shippingPhone: 1,
          shippingCity: 1,
          createdAt: 1,
          transactionId: 1, // ✅ FIX for Transaction ID Column
        },
      },
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

    await deleteCacheKey(CacheKeys.ORDER.BY_ID(orderId));
    if (order.userId) {
      await deleteCachePattern(`orders:user:${order.userId}*`);
    }

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
      throw new Error('আইডির ফরম্যাট সঠিক নয়।');
    }

    const vId = new Types.ObjectId(vendorId);

    let store = await StoreModel.findOne({ vendorId: vId });

    if (!store) {
      const userWithVendor = await User.findById(vId).select('vendorInfo');
      if (userWithVendor && userWithVendor.vendorInfo) {
        store = await StoreModel.findOne({ vendorId: userWithVendor.vendorInfo });
      }
    }

    if (!store) {
      throw new Error('আপনার অ্যাকাউন্টের বিপরীতে কোনো স্টোর খুঁজে পাওয়া যায়নি।');
    }

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
    console.error('❌ Error fetching vendor orders:', error.message);
    throw error;
  }
};

const getAdminDashboardReportFromDB = async (filters: {
  startDate?: string;
  endDate?: string;
  orderStatus?: string;
  paymentStatus?: string;
  paymentMethod?: string;
}) => {
  const match: Record<string, any> = {};
 
  if (filters.startDate || filters.endDate) {
    match.orderDate = {};
    if (filters.startDate) {
      match.orderDate.$gte = new Date(filters.startDate);
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      end.setHours(23, 59, 59, 999);
      match.orderDate.$lte = end;
    }
  }
 
  if (filters.orderStatus?.trim())   match.orderStatus   = filters.orderStatus.trim();
  if (filters.paymentStatus?.trim()) match.paymentStatus = filters.paymentStatus.trim();
  if (filters.paymentMethod?.trim()) {
    match.paymentMethod = { $regex: filters.paymentMethod.trim(), $options: 'i' };
  }
 
  const [vendorBreakdown, customerBreakdown, summaryRaw] = await Promise.all([
 
    OrderModel.aggregate([
      { $match: match },
 
      {
        $lookup: {
          from: 'storemodels',
          localField: 'storeId',
          foreignField: '_id',
          as: 'store',
        },
      },
      { $unwind: { path: '$store', preserveNullAndEmptyArrays: true } },
 
      {
        $addFields: {
          productTotal: { $subtract: ['$totalAmount', { $ifNull: ['$deliveryCharge', 0] }] },
          commissionRate: { $ifNull: ['$store.commission', 0] },
        },
      },
      {
        $addFields: {
          adminEarned: {
            $multiply: [
              '$productTotal',
              { $divide: ['$commissionRate', 100] },
            ],
          },
          vendorNet: {
            $multiply: [
              '$productTotal',
              {
                $subtract: [1, { $divide: ['$commissionRate', 100] }],
              },
            ],
          },
        },
      },
 
      {
        $group: {
          _id: '$storeId',
          storeName:          { $first: '$store.storeName' },
          storeEmail:         { $first: '$store.storeEmail' },
          storeLogo:          { $first: '$store.storeLogo' },
          commissionRate:     { $first: '$commissionRate' },
          totalOrders:        { $sum: 1 },
          deliveredOrders:    { $sum: { $cond: [{ $eq: ['$orderStatus', 'Delivered'] }, 1, 0] } },
          cancelledOrders:    { $sum: { $cond: [{ $eq: ['$orderStatus', 'Cancelled'] }, 1, 0] } },
          totalRevenue:       { $sum: '$totalAmount' },
          totalProductRevenue:{ $sum: '$productTotal' },
          totalDeliveryCharge:{ $sum: { $ifNull: ['$deliveryCharge', 0] } },
          adminEarned:        { $sum: '$adminEarned' },
          vendorNet:          { $sum: '$vendorNet' },
        },
      },
 
      { $sort: { totalRevenue: -1 } },
 
      {
        $project: {
          _id: 0,
          storeId:             '$_id',
          storeName:           { $ifNull: ['$storeName', 'Unknown Store'] },
          storeEmail:          1,
          storeLogo:           1,
          commissionRate:      1,
          totalOrders:         1,
          deliveredOrders:     1,
          cancelledOrders:     1,
          totalRevenue:        { $round: ['$totalRevenue', 2] },
          totalProductRevenue: { $round: ['$totalProductRevenue', 2] },
          totalDeliveryCharge: { $round: ['$totalDeliveryCharge', 2] },
          adminEarned:         { $round: ['$adminEarned', 2] },
          vendorNet:           { $round: ['$vendorNet', 2] },
        },
      },
    ]),
 
    OrderModel.aggregate([
      { $match: match },
 
      {
        $lookup: {
          from: 'orderdetails',
          localField: 'orderDetails',
          foreignField: '_id',
          as: 'detailDocs',
        },
      },
 
      {
        $addFields: {
          totalProductsInOrder: { $sum: '$detailDocs.quantity' },
          uniqueProductsInOrder: { $size: { $ifNull: ['$detailDocs', []] } },
        },
      },
 
      {
        $group: {
          _id: '$userId',
          customerName:     { $first: '$shippingName' },
          customerPhone:    { $first: '$shippingPhone' },
          totalOrders:      { $sum: 1 },
          deliveredOrders:  { $sum: { $cond: [{ $eq: ['$orderStatus', 'Delivered'] }, 1, 0] } },
          cancelledOrders:  { $sum: { $cond: [{ $eq: ['$orderStatus', 'Cancelled'] }, 1, 0] } },
          totalSpent:       { $sum: '$totalAmount' },
          totalProducts:    { $sum: '$totalProductsInOrder' },
          uniqueProducts:   { $sum: '$uniqueProductsInOrder' },
          lastOrderDate:    { $max: '$orderDate' },
          firstOrderDate:   { $min: '$orderDate' },
          cities:           { $addToSet: '$shippingCity' },
        },
      },
 
      { $sort: { totalSpent: -1 } },
 
      {
        $project: {
          _id: 0,
          userId:          '$_id',
          customerName:    1,
          customerPhone:   1,
          totalOrders:     1,
          deliveredOrders: 1,
          cancelledOrders: 1,
          totalSpent:      { $round: ['$totalSpent', 2] },
          totalProducts:   1,
          uniqueProducts:  1,
          lastOrderDate:   1,
          firstOrderDate:  1,
          cities:          1,
        },
      },
    ]),
 
    OrderModel.aggregate([
      { $match: match },
 
      {
        $lookup: {
          from: 'storemodels',
          localField: 'storeId',
          foreignField: '_id',
          as: 'store',
        },
      },
      { $unwind: { path: '$store', preserveNullAndEmptyArrays: true } },
 
      {
        $addFields: {
          productTotal:  { $subtract: ['$totalAmount', { $ifNull: ['$deliveryCharge', 0] }] },
          commissionRate: { $ifNull: ['$store.commission', 0] },
        },
      },
      {
        $addFields: {
          adminEarned: {
            $multiply: ['$productTotal', { $divide: ['$commissionRate', 100] }],
          },
        },
      },
 
      {
        $group: {
          _id: null,
          totalRevenue:       { $sum: '$totalAmount' },
          totalDeliveryRevenue: { $sum: { $ifNull: ['$deliveryCharge', 0] } },
          totalProductRevenue:  { $sum: '$productTotal' },
          totalAdminProfit:   { $sum: '$adminEarned' },
          totalOrders:        { $sum: 1 },
          deliveredOrders:    { $sum: { $cond: [{ $eq: ['$orderStatus', 'Delivered'] }, 1, 0] } },
          pendingOrders:      { $sum: { $cond: [{ $eq: ['$orderStatus', 'Pending'] }, 1, 0] } },
          processingOrders:   { $sum: { $cond: [{ $eq: ['$orderStatus', 'Processing'] }, 1, 0] } },
          shippedOrders:      { $sum: { $cond: [{ $eq: ['$orderStatus', 'Shipped'] }, 1, 0] } },
          cancelledOrders:    { $sum: { $cond: [{ $eq: ['$orderStatus', 'Cancelled'] }, 1, 0] } },
          returnedOrders:     { $sum: { $cond: [{ $in:  ['$orderStatus', ['Returned', 'Return Request']] }, 1, 0] } },
          paidOrders:         { $sum: { $cond: [{ $eq: ['$paymentStatus', 'Paid'] }, 1, 0] } },
          unpaidOrders:       { $sum: { $cond: [{ $eq: ['$paymentStatus', 'Pending'] }, 1, 0] } },
          uniqueCustomers:    { $addToSet: '$userId' },
          uniqueVendors:      { $addToSet: '$storeId' },
        },
      },
 
      {
        $project: {
          _id: 0,
          totalRevenue:         { $round: ['$totalRevenue', 2] },
          totalDeliveryRevenue: { $round: ['$totalDeliveryRevenue', 2] },
          totalProductRevenue:  { $round: ['$totalProductRevenue', 2] },
          totalAdminProfit:     { $round: ['$totalAdminProfit', 2] },
          totalOrders:          1,
          deliveredOrders:      1,
          pendingOrders:        1,
          processingOrders:     1,
          shippedOrders:        1,
          cancelledOrders:      1,
          returnedOrders:       1,
          paidOrders:           1,
          unpaidOrders:         1,
          uniqueCustomersCount: { $size: '$uniqueCustomers' },
          uniqueVendorsCount:   { $size: '$uniqueVendors' },
        },
      },
    ]),
  ]);
 
  const summary = summaryRaw[0] ?? {
    totalRevenue:          0,
    totalDeliveryRevenue:  0,
    totalProductRevenue:   0,
    totalAdminProfit:      0,
    totalOrders:           0,
    deliveredOrders:       0,
    pendingOrders:         0,
    processingOrders:      0,
    shippedOrders:         0,
    cancelledOrders:       0,
    returnedOrders:        0,
    paidOrders:            0,
    unpaidOrders:          0,
    uniqueCustomersCount:  0,
    uniqueVendorsCount:    0,
  };
 
  return {
    summary,
    vendorBreakdown,
    customerBreakdown,
  };
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
  requestReturnInDB,
  getVendorStoreAndOrdersFromDBVendor,
  getAdminDashboardReportFromDB,
};