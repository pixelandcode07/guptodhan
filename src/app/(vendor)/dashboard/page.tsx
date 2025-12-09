import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ShoppingCart, Package, CreditCard } from "lucide-react";
import { DataTable } from "@/components/TableHelper/data-table";
import { blog_bagegory_columns } from "@/components/TableHelper/blog_cagegory_columns";
import SalesAnalyticsChart from "../components/SalesAnalyticsChart";

export default async function VendorDashboard() {
  const session = await getServerSession(authOptions);
  console.log('Vendor Dashboard Session:', session)
  const recentOrders: any = [];

  return (
    <div className="p-6 space-y-8">
      {/* Breadcrumb/Title */}
      {/* <div className="text-xl font-semibold">Dashboard</div> */}

      {/* Top Four Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="shadow-sm border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Today’s Orders
            </CardTitle>
            <ShoppingCart className="h-6 w-6 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-blue-600 cursor-pointer">
              View All Orders
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <BarChart3 className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-blue-600 cursor-pointer">
              View All Orders
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">54</div>
            <p className="text-sm text-blue-600 cursor-pointer">
              View All Products
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium">Total Sells</CardTitle>
            <CreditCard className="h-6 w-6 text-slate-700" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">0</div>
            <p className="text-sm text-blue-600 cursor-pointer">
              View Accounts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Analytics */}
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>
            Sales Analytics (Successful & Failed Order Ratio)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <SalesAnalyticsChart />
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
            <DataTable columns={blog_bagegory_columns} data={recentOrders} />
          </CardContent>
        </Card>

        {/* Best Selling Products */}
        <Card className="shadow-sm border">
          <CardHeader>
            <CardTitle>Best Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-gray-500">No data available.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
