import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ShoppingCart, Package, CreditCard } from "lucide-react";
import { DataTable } from "@/components/TableHelper/data-table";
import SalesAnalyticsChart from '../components/SalesAnalyticsChart';
import { recentOrdersColumns } from '@/components/TableHelper/recent-orders-columns';
import { bestSellingProductsColumns } from '@/components/TableHelper/best-selling-products-columns';
import Link from 'next/link';

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
    return <div>Please log in to view dashboard.</div>;
  }

  const vendorId = session?.user?.vendorId;
  const accessToken = session.accessToken;
  const baseUrl = process.env.NEXTAUTH_URL;


  const res = await fetch(`${baseUrl}/api/v1/vendor-store/dashboard/${vendorId}`, {
    cache: "no-store",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const error = await res.text();
    console.error("Dashboard API Error:", error);
    throw new Error("Failed to load dashboard data");
  }

  const { data }: DashboardResponse = await res.json();

  const {
    todayOrdersCount = 0,
    totalOrders = 0,
    totalProducts = 0,
    totalSell = 0,
  } = data.stats || {};

  const { todaysOrders = [], deliveredCancelledOrders = [], allOrders = [] } = data.orders || {};
  const bestSellingProducts = data.bestSellingProducts || [];

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
            <Link href={'/withdrawal/request'} className="text-sm text-blue-600 cursor-pointer hover:underline">View Earnings</Link>
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