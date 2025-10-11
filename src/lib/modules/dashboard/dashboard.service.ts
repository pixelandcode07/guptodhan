import { Order } from '../order/order.model';
import { User } from '../user/user.model';

const getDashboardAnalyticsFromDB = async () => {
  // --- Date Ranges ---
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const startOfToday = new Date(new Date().setHours(0, 0, 0, 0));

  // --- KPI Queries ---
  const monthlyOrdersQuery = Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
  const todaysOrdersQuery = Order.countDocuments({ createdAt: { $gte: startOfToday } });
  const monthlyUsersQuery = User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
  const monthlyRevenueQuery = Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo }, paymentStatus: 'paid' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);

  // --- Sales Analytics Bar Chart Query ---
  const salesByMonthQuery = Order.aggregate([
    { $match: { paymentStatus: { $in: ['paid', 'failed'] } } },
    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        successful: { $sum: { $cond: [{ $eq: ["$paymentStatus", "paid"] }, 1, 0] } },
        failed: { $sum: { $cond: [{ $eq: ["$paymentStatus", "failed"] }, 1, 0] } }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } }
  ]);

  // --- Order Ratio Pie Chart Query ---
  const orderStatusRatioQuery = Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  // ✅ Recent Customers (Latest registered users)
  const recentCustomersQuery = User.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .select('name email profilePicture phoneNumber address createdAt');

  // ✅ Recent Payments (Latest orders)
  const recentOrdersQuery = Order.find({})
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('user', 'name email');

  // --- Run all queries in parallel ---
  const [
    monthlyOrdersCount,
    todaysOrdersCount,
    monthlyUsersCount,
    revenueResult,
    salesByMonth,
    orderStatusRatio,
    recentCustomers,
    latestOrders,
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

  // Format data for charts
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
    recentCustomers: recentCustomers, // ✅ Newly registered users
    recentOrders: latestOrders, // ✅ Recent payments/orders
  };
};

export const DashboardServices = {
  getDashboardAnalyticsFromDB,
};