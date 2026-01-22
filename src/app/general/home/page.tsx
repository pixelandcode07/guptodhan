// src/app/general/home/page.tsx
import '@/lib/models-index';

import dbConnect from '@/lib/db';
import { DashboardServices } from '@/lib/modules/dashboard/dashboard.service';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Package,
  Zap,
  BarChart3,
  Calendar,
  Download,
  Settings
} from 'lucide-react';
import RevenueChart from './Components/RevenueChart';
import SalesAnalyticsChart from './Components/SalaesAnlytcChart';
import CircleChart from './Components/CircleChart';
import Image from 'next/image';
import { AdminActionCards } from './Components/AdminActionCards';
import { KpiCard } from './Components/KpiCard';
import { LowStockAlert } from './Components/LowStockAlert';
import { TopProducts } from './Components/TopProducts';

export default async function DashboardPage() {
  // Connect to database
  await dbConnect();

  // Fetch dashboard data
  const data = await DashboardServices.getDashboardAnalyticsFromDB();
  console.log('Dashboard Data Loaded Successfully ✅');

  // Time based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative p-6 md:p-8 space-y-8">

        {/* ===== HEADER SECTION ===== */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent">
              {greeting}, Admin 👋
            </h1>
            <p className="text-slate-600 text-lg font-medium">
              Welcome back! Here's your store performance overview.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-3 rounded-xl border border-white/20 shadow-lg text-sm font-medium text-slate-600">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <button className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-xl text-sm font-semibold hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="p-3 bg-white/80 backdrop-blur-md rounded-xl border border-white/20 hover:bg-white/90 transition-all duration-300 shadow-lg">
              <Settings className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* ===== ADMIN ACTION CENTER ===== */}
        <AdminActionCards
          pendingVendors={data.stats.pendingVendors}
          pendingOrders={data.stats.pendingOrders}
        />

        {/* ===== KPI CARDS GRID ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <KpiCard
            title="Total Revenue"
            value={`৳${(data.stats.totalRevenue || 0).toLocaleString()}`}
            growth={12.5}
            icon={DollarSign}
            iconColor="#10b981"
            subtext="all time"
          />
          <KpiCard
            title="Monthly Revenue"
            value={`৳${(data.stats.monthlyRevenue || 0).toLocaleString()}`}
            growth={8.2}
            icon={TrendingUp}
            iconColor="#3b82f6"
            subtext="this month"
          />
          <KpiCard
            title="Total Orders"
            value={data.stats.totalOrders || 0}
            growth={5.0}
            icon={ShoppingBag}
            iconColor="#f59e0b"
            subtext="all time"
          />
          <KpiCard
            title="Active Users"
            value={data.stats.totalUsers || 0}
            growth={-2.4}
            icon={Users}
            iconColor="#8b5cf6"
            subtext="registered"
          />
        </div>

        {/* ===== ADDITIONAL STATS ROW ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100/50 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-700 rounded-full">
                +{data.stats.todaysOrders} Today
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">Today's Orders</h3>
            <p className="text-3xl font-bold text-slate-900">{data.stats.todaysOrders}</p>
            <p className="text-xs text-slate-500 mt-2">Orders processed today</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100/50 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-purple-100 text-purple-700 rounded-full">
                {data.stats.monthlyRegisteredUsers} New
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">New Users</h3>
            <p className="text-3xl font-bold text-slate-900">{data.stats.monthlyRegisteredUsers}</p>
            <p className="text-xs text-slate-500 mt-2">Registered this month</p>
          </div>

          <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100/50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-xs font-bold px-3 py-1 bg-red-100 text-red-700 rounded-full">
                Action Required
              </span>
            </div>
            <h3 className="text-sm font-medium text-slate-600 mb-1">Low Stock Products</h3>
            <p className="text-3xl font-bold text-slate-900">{data.lowStockProducts?.length || 0}</p>
            <p className="text-xs text-slate-500 mt-2">Need restocking soon</p>
          </div>
        </div>

        {/* ===== MAIN ANALYTICS SECTION ===== */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Charts Section (2 columns) */}
          <div className="xl:col-span-2 space-y-6">
            {/* Revenue Chart */}
            <RevenueChart data={data.charts.revenueOverTime} />

            {/* Sales Analytics & Order Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SalesAnalyticsChart data={data.salesAnalyticsChart} />
              <CircleChart data={data.orderStatusChart} />
            </div>

            {/* Recent Orders Table */}
            
          </div>

          {/* Right: Alerts & Products (1 column) */}
          <div className="space-y-6">
            {/* Low Stock Alert */}
            <LowStockAlert products={data.lowStockProducts || []} />

            {/* Top Products */}
            <TopProducts products={data.topProducts || []} />
          </div>
        </div>

        {/* ===== FOOTER STATS ===== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg">
            <BarChart3 className="w-8 h-8 mb-4 opacity-80" />
            <h4 className="text-sm font-medium opacity-90 mb-2">Platform Stats</h4>
            <p className="text-3xl font-bold">{data.stats.totalOrders}</p>
            <p className="text-xs opacity-80 mt-2">Total Orders Processed</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-xl p-6 shadow-lg">
            <Users className="w-8 h-8 mb-4 opacity-80" />
            <h4 className="text-sm font-medium opacity-90 mb-2">Community</h4>
            <p className="text-3xl font-bold">{data.stats.totalUsers}</p>
            <p className="text-xs opacity-80 mt-2">Active Customers</p>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg">
            <DollarSign className="w-8 h-8 mb-4 opacity-80" />
            <h4 className="text-sm font-medium opacity-90 mb-2">Revenue</h4>
            <p className="text-3xl font-bold">৳{(data.stats.totalRevenue / 1000000).toFixed(2)}M</p>
            <p className="text-xs opacity-80 mt-2">Lifetime Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
}