import { OrderModel } from '../product-order/order/order.model';
import { User } from '../user/user.model';

const getDashboardAnalyticsFromDB = async () => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));

  const monthlyOrdersQuery = OrderModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
  const todaysOrdersQuery = OrderModel.countDocuments({ createdAt: { $gte: startOfToday } });
  const monthlyUsersQuery = User.countDocuments({ role: 'user', createdAt: { $gte: thirtyDaysAgo } });
  
  const monthlyRevenueQuery = OrderModel.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo }, paymentStatus: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);

  const salesByMonthQuery = OrderModel.aggregate([
    { $match: { paymentStatus: { $in: ['Paid', 'Failed'] } } },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        successful: { $sum: { $cond: [{ $eq: ["$paymentStatus", "Paid"] }, 1, 0] } },
        failed: { $sum: { $cond: [{ $eq: ["$paymentStatus", "Failed"] }, 1, 0] } }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  const orderStatusRatioQuery = OrderModel.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
  ]);

  const recentCustomersQuery = User.find({ role: 'user' })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('name email profilePicture phoneNumber address createdAt')
    .lean();

  // ✅ Populate remove করলাম - শুধু order data নিচ্ছি
  const recentOrdersQuery = OrderModel.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('userId', 'name email phoneNumber')
    .select('orderId totalAmount paymentStatus createdAt')
    .lean();

  const [
    monthlyOrdersCount,
    todaysOrdersCount,
    monthlyUsersCount,
    revenueResult,
    salesByMonth,
    orderStatusRatio,
    recentCustomers,
    recentOrders,
  ] = await Promise.all([
    monthlyOrdersQuery,
    todaysOrdersQuery,
    monthlyUsersQuery,
    monthlyRevenueQuery,
    salesByMonthQuery,
    orderStatusRatioQuery,
    recentCustomersQuery,
    recentOrdersQuery,
  ]);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const salesAnalyticsData = salesByMonth.map(item => ({
    name: `${monthNames[item._id.month - 1]}-${String(item._id.year).slice(-2)}`,
    successful: item.successful,
    failed: item.failed
  }));

  const orderRatioData = orderStatusRatio.map(item => ({
    name: item._id,
    value: item.count
  }));

  return {
    stats: {
      monthlyOrders: monthlyOrdersCount,
      todaysOrders: todaysOrdersCount,
      monthlyRegisteredUsers: monthlyUsersCount,
      monthlyRevenue: revenueResult[0]?.total || 0,
    },
    salesAnalyticsChart: salesAnalyticsData,
    orderRatioChart: orderRatioData,
    recentCustomers: recentCustomers,
    recentOrders: recentOrders,
  };
};

export const DashboardServices = {
  getDashboardAnalyticsFromDB,
};