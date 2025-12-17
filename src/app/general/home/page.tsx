// src/app/general/home/page.tsx

// =========================================================
// 🔥 STEP 1: Import models-index at the VERY TOP
// =========================================================
import '@/lib/models-index';

import { Suspense } from 'react';
import dbConnect from '@/lib/db';
import { DashboardServices } from '@/lib/modules/dashboard/dashboard.service';
import { DollarSign, ShoppingBag, Users, Store, Calendar } from 'lucide-react';
import KpiCard from './Components/KpiCard';
import RevenueChart from './Components/RevenueChart';
import TopProducts from './Components/TopProducts';
import LowStockAlert from './Components/LowStockAlert';
import AdminActionCards from './Components/AdminActionCards';
import Image from 'next/image';

export default async function DashboardPage() {
  // Connect to database
  await dbConnect();
  
  // Fetch dashboard data
  const data = await DashboardServices.getDashboardAnalyticsFromDB();

  // Time based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="p-6 md:p-8 space-y-8 bg-gray-50/50 min-h-screen">
      
      {/* 1. Header with Date & Action */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{greeting}, Admin! 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here is what's happening with your store today.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 bg-white px-4 py-2 rounded-lg border shadow-sm text-sm font-medium text-gray-600">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition">
            Download Report
          </button>
        </div>
      </div>

      {/* 2. Admin Action Center */}
      <AdminActionCards 
        pendingVendors={data.stats.pendingVendors} 
        pendingOrders={data.stats.pendingOrders} 
      />

      {/* 3. KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard 
          title="Total Revenue" 
          value={`৳${data.stats.totalRevenue.toLocaleString()}`} 
          growth={12.5}
          icon={DollarSign}
          iconColor="#10b981"
          subtext="vs last 30 days"
        />
        <KpiCard 
          title="Total Orders" 
          value={data.stats.totalOrders} 
          growth={8.2}
          icon={ShoppingBag}
          iconColor="#3b82f6"
          subtext="processed"
        />
        <KpiCard 
          title="Active Users" 
          value={data.stats.totalUsers} 
          growth={-2.4}
          icon={Users}
          iconColor="#f59e0b"
          subtext="registered accounts"
        />
        <KpiCard 
          title="Total Vendors" 
          value={data.stats.totalVendors} 
          growth={5.0}
          icon={Store}
          iconColor="#8b5cf6"
          subtext="active shops"
        />
      </div>

      {/* 4. Analytics & Alerts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Revenue Chart & Recent Orders (Takes 2 columns) */}
        <div className="xl:col-span-2 space-y-6">
          <RevenueChart data={data.charts.revenueOverTime} />
          
          {/* Recent Orders Section */}
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Recent Orders</h3>
              <a href="/orders" className="text-sm text-blue-600 hover:underline">View All</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-6 py-3">Order ID</th>
                    <th className="px-6 py-3">Customer</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.recentOrders.length > 0 ? (
                    data.recentOrders.map((order: any) => (
                      <tr key={order._id} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-3 font-medium text-gray-900">#{order.orderId}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-200 overflow-hidden relative">
                              <Image 
                                src={'/placeholder-user.jpg'} 
                                alt="user" 
                                fill 
                                className="object-cover" 
                              />
                            </div>
                            <span className="truncate max-w-[100px]">
                              {order.userId?.name || 'Guest'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3 font-medium">৳{order.totalAmount.toLocaleString()}</td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold 
                            ${order.paymentStatus === 'Paid' 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : 'bg-red-50 text-red-700 border border-red-200'
                            }`}>
                            {order.paymentStatus}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                        No recent orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Top Products & Alerts (Takes 1 column) */}
        <div className="space-y-6">
          {/* Low Stock Alert */}
          <LowStockAlert products={data.lowStockProducts} />
          
          {/* Top Products */}
          <TopProducts products={data.topProducts} />
        </div>
      </div>
    </div>
  );
}