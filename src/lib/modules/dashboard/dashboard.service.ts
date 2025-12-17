// src/lib/modules/dashboard/dashboard.service.ts

// =========================================================
// 🔥 STEP 1: Import models-index FIRST to register all models
// =========================================================
import '@/lib/models-index';

// =========================================================
// 🔥 STEP 2: Now import specific models
// =========================================================
import { OrderModel } from '../product-order/order/order.model';
import { User } from '../user/user.model';
import { VendorProductModel } from '../product/vendorProduct.model';
import { VendorStoreModel } from '@/lib/models-index';
import { StoreModel } from '../vendor-store/vendorStore.model';

const getDashboardAnalyticsFromDB = async () => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  // --- 1. Existing KPIs (Growth Calculation) ---
  const currentRevenueData = await OrderModel.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo }, paymentStatus: 'Paid' } },
    { $group: { _id: null, total: { $sum: '$totalAmount' } } }
  ]);
  const currentRevenue = currentRevenueData[0]?.total || 0;

  const totalOrders = await OrderModel.countDocuments({});
  const totalUsers = await User.countDocuments({ role: 'user' });
  const totalVendors = await StoreModel.countDocuments({});

  // --- 2. Low Stock Alert (Stock < 10) ---
  const lowStockProductsQuery = VendorProductModel.find({ 
    stock: { $lte: 10 }, 
    status: 'active' 
  })
    .select('productTitle thumbnailImage stock productPrice')
    .limit(5)
    .lean();

  // --- 3. Pending Actions ---
  const pendingVendorsCountQuery = VendorStoreModel.countDocuments({ status: 'pending' });
  const pendingOrdersCountQuery = OrderModel.countDocuments({ orderStatus: 'Pending' });

  // --- 4. Sales Graph Data (Last 14 Days) ---
  const dailyRevenueQuery = OrderModel.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo }, paymentStatus: 'Paid' } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        totalSales: { $sum: "$totalAmount" },
      }
    },
    { $sort: { _id: 1 } },
    { $limit: 14 }
  ]);

  // --- 5. Top Selling Products ---
  const topProductsQuery = OrderModel.aggregate([
    { $match: { paymentStatus: 'Paid' } },
    { $unwind: "$products" },
    { 
      $group: { 
        _id: "$products.productId", 
        totalSold: { $sum: "$products.quantity" }, 
        revenue: { $sum: { $multiply: ["$products.quantity", "$products.price"] } }
      } 
    },
    { $sort: { totalSold: -1 } },
    { $limit: 5 },
    { 
      $lookup: { 
        from: "vendorproducts", 
        localField: "_id", 
        foreignField: "_id", 
        as: "details" 
      } 
    },
    { $unwind: { path: "$details", preserveNullAndEmptyArrays: true } },
    { 
      $project: { 
        name: { $ifNull: ["$details.productTitle", "Unknown Product"] }, 
        image: { $ifNull: ["$details.thumbnailImage", "/placeholder-product.jpg"] }, 
        totalSold: 1, 
        revenue: 1 
      } 
    }
  ]);

  // --- 6. Recent Orders ---
  const recentOrdersQuery = OrderModel.find({})
    .sort({ createdAt: -1 })
    .limit(6)
    .populate('userId', 'name email')
    .select('orderId totalAmount paymentStatus orderStatus createdAt')
    .lean();

  // Execute all queries in parallel
  const [
    lowStockProducts,
    pendingVendors,
    pendingOrders,
    dailyRevenue,
    topProducts,
    recentOrders
  ] = await Promise.all([
    lowStockProductsQuery,
    pendingVendorsCountQuery,
    pendingOrdersCountQuery,
    dailyRevenueQuery,
    topProductsQuery,
    recentOrdersQuery
  ]);

  // Format Chart Data
  const revenueChart = dailyRevenue.map(item => ({
    date: item._id,
    Sales: item.totalSales,
  }));

  return {
    stats: {
      totalRevenue: currentRevenue,
      totalOrders,
      totalUsers,
      totalVendors,
      pendingVendors,
      pendingOrders,
    },
    charts: {
      revenueOverTime: revenueChart,
    },
    lowStockProducts,
    topProducts,
    recentOrders,
  };
};

export const DashboardServices = {
  getDashboardAnalyticsFromDB,
};