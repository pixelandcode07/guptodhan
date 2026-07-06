// src/lib/modules/dashboard/dashboard.service.ts
import { OrderModel, VendorProductModel, VendorStoreModel, UserModel } from '@/lib/models-index';
import { UserServices } from '@/lib/modules/user/user.service'; // ✅ MAGIC FIX: UserServices ইমপোর্ট করা হলো
import mongoose from 'mongoose';

const getDashboardAnalyticsFromDB = async () => {
  const today = new Date();
  
  // চার্টের (Chart) জন্য রোলিং ৩০ দিন
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  // মাসের ১ তারিখ বের করার লজিক (Monthly Stats এর জন্য)
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  try {
    // --- 1. Monthly Orders Count ---
    const monthlyOrders = await OrderModel.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    // --- 2. Monthly Revenue ---
    const monthlyRevenueData = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth }, 
          paymentStatus: 'Paid',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    const monthlyRevenue = monthlyRevenueData[0]?.total || 0;

    // --- 3. Today's Orders ---
    const todayStart = new Date(today);
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date(today);
    todayEnd.setHours(23, 59, 59, 999);

    const todaysOrders = await OrderModel.countDocuments({
      createdAt: { $gte: todayStart, $lte: todayEnd },
    });

    // =========================================================================
    // ✅ MAGIC FIX: টেবিল যেখান থেকে ডাটা নেয়, ড্যাশবোর্ডেও ঠিক সেখান থেকেই ডাটা নেওয়া হলো!
    // এর ফলে ডাটাবেসে হিডেন বা ডিলিট হওয়া ওই ১৩ জন ইউজার আর কাউন্ট হবে না।
    // =========================================================================
    const allSystemUsers = await UserServices.getAllUsersFromDB();

    // --- 4. Monthly Registered Users (Filtered correctly) ---
    const monthlyRegisteredUsers = allSystemUsers.filter(
      (u: any) => new Date(u.createdAt) >= startOfMonth
    ).length;

    // --- 5. Total Stats (All Time) ---
    const totalOrders = await OrderModel.countDocuments({});
    
    // ✅ Now this will strictly be exactly 154 (or whatever the table shows)
    const totalUsers = allSystemUsers.length; 
    
    const totalRevenueData = await OrderModel.aggregate([
      {
        $match: { paymentStatus: 'Paid' },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalAmount' },
        },
      },
    ]);

    const totalRevenue = totalRevenueData[0]?.total || 0;

    // --- 6. Pending Vendors & Orders ---
    const pendingVendors = await VendorStoreModel.countDocuments({ status: 'pending' });
    const pendingOrders = await OrderModel.countDocuments({ orderStatus: 'Pending' });

    // --- 7. Sales Analytics Chart (Last 30 Days) ---
    const salesAnalyticsData = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            status: '$paymentStatus',
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.date': 1 },
      },
    ]);

    // Transform to chart format
    const salesMap = new Map();
    salesAnalyticsData.forEach((item) => {
      const date = item._id.date;
      if (!salesMap.has(date)) {
        salesMap.set(date, { name: date, successful: 0, failed: 0 });
      }
      const current = salesMap.get(date);
      if (item._id.status === 'Paid') {
        current.successful = item.count;
      } else {
        current.failed = item.count;
      }
    });

    const salesAnalyticsChart = Array.from(salesMap.values());

    // --- 8. Order Ratio Chart (Payment Status Distribution) ---
    const orderRatioData = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: '$paymentStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    const orderRatioChart = orderRatioData.map((item) => ({
      name: item._id || 'Unknown',
      value: item.count,
    }));

    // --- 9. Order Status Distribution ---
    const orderStatusData = await OrderModel.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 },
        },
      },
    ]);

    const orderStatusChart = orderStatusData.map((item) => ({
      name: item._id || 'Unknown',
      value: item.count,
    }));

    // --- 10. Recent Customers ---
    const recentCustomers = await UserModel.find({})
      .select('name email profilePicture phoneNumber address createdAt')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    // --- 11. Recent Orders ---
    const recentOrders = await OrderModel.find({})
      .select(
        'orderId totalAmount paymentStatus paymentMethod orderStatus createdAt userId'
      )
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'name email')
      .lean();

    // --- 12. Low Stock Products ---
    const lowStockProducts = await VendorProductModel.find({
      stock: { $lte: 10 },
      status: 'active',
    })
      .select('productTitle thumbnailImage stock productPrice')
      .limit(5)
      .lean();

    // --- 13. Top Selling Products ---
    const topProducts = await OrderModel.aggregate([
      {
        $match: { paymentStatus: 'Paid' },
      },
      {
        $unwind: '$orderDetails',
      },
      {
        $lookup: {
          from: 'orderdetails', 
          localField: 'orderDetails',
          foreignField: '_id',
          as: 'productDetails',
        },
      },
      {
        $unwind: { path: '$productDetails', preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: '$productDetails.productId',
          totalSold: { $sum: '$productDetails.quantity' },
          revenue: { $sum: { $multiply: ['$productDetails.quantity', '$productDetails.price'] } },
        },
      },
      {
        $sort: { totalSold: -1 },
      },
      {
        $limit: 5,
      },
      {
        $addFields: {
          convertedProductId: { $toObjectId: "$_id" }
        }
      },
      {
        $lookup: {
          from: 'vendorproductmodels',
          localField: 'convertedProductId',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      {
        $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true },
      },
      {
        $project: {
          name: { $ifNull: ['$productInfo.productTitle', 'Unknown Product'] },
          image: { $ifNull: ['$productInfo.thumbnailImage', '/placeholder-product.jpg'] },
          totalSold: 1,
          revenue: 1,
        },
      },
    ]);

    // --- 14. Revenue Over Time (Last 30 Days for Charts) ---
    const revenueOverTime = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          paymentStatus: 'Paid',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          Sales: { $sum: '$totalAmount' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const revenueChart = revenueOverTime.map((item) => ({
      date: item._id,
      Sales: item.Sales,
    }));

    return {
      stats: {
        monthlyOrders,
        monthlyRevenue,
        todaysOrders,
        monthlyRegisteredUsers,
        totalOrders,
        totalUsers,
        totalRevenue,
        pendingVendors,
        pendingOrders,
      },
      salesAnalyticsChart,
      orderRatioChart,
      orderStatusChart,
      recentCustomers,
      recentOrders,
      lowStockProducts,
      topProducts,
      charts: {
        revenueOverTime: revenueChart,
      },
    };
  } catch (error: any) {
    console.error('❌ Dashboard Analytics Error:', error.message);
    throw error;
  }
};

export const DashboardServices = {
  getDashboardAnalyticsFromDB,
};