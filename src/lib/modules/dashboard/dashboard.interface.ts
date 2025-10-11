export interface DashboardAnalytics {
  stats: {
    monthlyOrders: number;
    monthlyRevenue: number;
    todaysOrders: number;
    monthlyRegisteredUsers: number;
  };
  salesAnalyticsChart: Array<{ name: string; successful: number; failed: number }>;
  orderRatioChart: Array<{ name: string; value: number }>;
  recentCustomers: Array<{
    name: string;
    email: string;
    profilePicture?: string;
    phoneNumber?: string;
    address?: string;
    createdAt?: string | Date;
  }>;
  recentOrders: Array<{
    orderId: string;
    totalAmount: number;
    paymentStatus: string;
    paymentMethodId?: { methodName?: string };
  }>;
}
