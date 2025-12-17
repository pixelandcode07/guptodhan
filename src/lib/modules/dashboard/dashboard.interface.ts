// src/lib/modules/dashboard/dashboard.interface.ts
export interface DashboardAnalytics {
  stats: {
    monthlyOrders: number;
    monthlyRevenue: number;
    todaysOrders: number;
    monthlyRegisteredUsers: number;
    totalOrders: number;
    totalUsers: number;
    totalRevenue: number;
    pendingVendors: number;
    pendingOrders: number;
  };
  salesAnalyticsChart: Array<{
    name: string;
    successful: number;
    failed: number;
  }>;
  orderRatioChart: Array<{
    name: string;
    value: number;
  }>;
  orderStatusChart: Array<{
    name: string;
    value: number;
  }>;
  recentCustomers: Array<{
    _id?: string;
    name: string;
    email: string;
    profilePicture?: string;
    phoneNumber?: string;
    address?: string;
    createdAt?: string | Date;
  }>;
  recentOrders: Array<{
    _id?: string;
    orderId: string;
    totalAmount: number;
    paymentStatus: string;
    paymentMethod?: string;
    orderStatus?: string;
    createdAt?: string | Date;
    userId?: {
      _id?: string;
      name: string;
      email: string;
    };
  }>;
  lowStockProducts: Array<{
    _id?: string;
    productTitle: string;
    thumbnailImage: string;
    stock: number;
    productPrice: number;
  }>;
  topProducts: Array<{
    name: string;
    image: string;
    totalSold: number;
    revenue: number;
  }>;
  charts: {
    revenueOverTime: Array<{
      date: string;
      Sales: number;
    }>;
  };
}