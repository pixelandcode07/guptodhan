export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ShoppingCart, Package, CreditCard, Store, PlusCircle, AlertCircle } from "lucide-react";
import { DataTable } from "@/components/TableHelper/data-table";
import SalesAnalyticsChart from '../components/SalesAnalyticsChart';
import { recentOrdersColumns } from '@/components/TableHelper/recent-orders-columns';
import { bestSellingProductsColumns } from '@/components/TableHelper/best-selling-products-columns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface DashboardResponse {
  success: boolean;
  data: {
    stats: {
      todayOrdersCount: number;
      totalOrders: number;
      totalProducts: number;
      totalSell: number;
    };
    orders: {
      todaysOrders: any[];
      deliveredCancelledOrders: any[];
      allOrders: any[];
    };
    bestSellingProducts: any[];
  };
}

export default async function VendorDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <div className="p-6">Please log in to view dashboard.</div>;
  }

  const vendorId = session?.user?.vendorId;
  const accessToken = session?.accessToken;

  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_API_URL || 'https://guptodhan.com';
  
  let dashboardData: DashboardResponse['data'] | null = null;
  let isStoreMissing = !vendorId; // প্রথমে চেক করছি vendorId আছে কিনা
  let apiError = false;

  // যদি vendorId থাকে, তাহলে API কল করে চেক করবো
  if (vendorId) {
    try {
      const res = await fetch(`${baseUrl}/api/v1/vendor-store/dashboard/${vendorId}`, {
        cache: "no-store",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        console.error("Dashboard API Error Status:", res.status);
        // যদি স্টোর খুঁজে না পায় (404) বা ইনভ্যালিড হয় (400), তার মানে স্টোর ক্রিয়েট করা নেই
        if (res.status === 404 || res.status === 400) {
          isStoreMissing = true;
        } else {
          apiError = true;
        }
      } else {
        const json = await res.json();
        dashboardData = json.data;
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
      apiError = true;
    }
  }

  // 💡 মেইন লজিক: যদি vendorId না থাকে অথবা API স্টোর খুঁজে না পায়
  if (isStoreMissing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <div className="bg-white p-10 rounded-2xl shadow-sm border max-w-lg w-full">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Store size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Welcome to Guptodhan!</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            You haven't set up your store yet or your store profile is incomplete. To access your dashboard and start selling, you need to create your store first.
          </p>
          <Link href="/store">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white w-full gap-2">
              <PlusCircle size={20} />
              Create My Store Now
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // যদি সত্যিই সার্ভার এরর হয়, তাহলেও আমরা ইউজারকে স্টোর খোলার অপশন দিয়ে রাখবো
  if (apiError || !dashboardData) {
    return (
      <div className="p-6 flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-4 bg-white p-8 rounded-2xl border max-w-md w-full shadow-sm">
          <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
             <AlertCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Oops! Could not load dashboard</h2>
          <p className="text-gray-600">
            We encountered an issue fetching your store data. If you haven't completed your store setup yet, please do it below.
          </p>
          <div className="pt-4">
            <Link href="/store" className="block">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                <PlusCircle className="w-4 h-4 mr-2" /> Set Up Store Now
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Safely destructure now that we guarantee dashboardData exists
  const {
    todayOrdersCount = 0,
    totalOrders = 0,
    totalProducts = 0,
    totalSell = 0,
  } = dashboardData.stats || {};

  const { todaysOrders = [], deliveredCancelledOrders = [], allOrders = [] } = dashboardData.orders || {};
  const bestSellingProducts = dashboardData.bestSellingProducts || [];

  return (
    <div className="p-6 space-y-8">
      {/* Top Four Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="shadow-sm border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Today’s Orders</CardTitle>
            <ShoppingCart className="h-6 w-6 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{todayOrdersCount}</div>
            <Link href={'/orders'} className="text-sm text-blue-600 cursor-pointer hover:underline">View All Orders</Link>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <BarChart3 className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalOrders}</div>
            <Link href={'/orders'} className="text-sm text-blue-600 cursor-pointer hover:underline">View All Orders</Link>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProducts}</div>
            <Link href={'/products/all'} className="text-sm text-blue-600 cursor-pointer hover:underline">View All Products</Link>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Sales (৳)</CardTitle>
            <CreditCard className="h-6 w-6 text-slate-700" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {totalSell.toLocaleString("en-BD")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sales Analytics Chart */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Sales Analytics (Successful vs Failed Orders - Last 12 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <SalesAnalyticsChart orders={deliveredCancelledOrders} />
        </CardContent>
      </Card>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="shadow-sm border xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {allOrders.length > 0 ? (
              <DataTable columns={recentOrdersColumns} data={allOrders} />
            ) : (
              <p className="text-gray-500 text-center py-8">No orders yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Best Selling Products */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle>Best Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            {bestSellingProducts.length > 0 ? (
              <DataTable
                columns={bestSellingProductsColumns}
                data={bestSellingProducts.slice(0, 6)}
              />
            ) : (
              <p className="text-gray-500 text-center py-8">No sales recorded yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}