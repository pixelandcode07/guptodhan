import ChartCard from './Components/CardChart';
import CircleChart from './Components/CircleChart';
import SalesAnalyticsChart from './Components/SalaesAnlytcChart';
import { DataTable } from '@/components/TableHelper/data-table';
import { customer_data_columns } from '@/components/TableHelper/customer_data_column';
import { transactions_columns } from '@/components/TableHelper/transations_columns';
import { DashboardServices } from '@/lib/modules/dashboard/dashboard.service';
import dbConnect from '@/lib/db';

export default async function DashboardPage() {
  await dbConnect();
  const analyticsData = await DashboardServices.getDashboardAnalyticsFromDB();

  const kpiCardData = [
    { title: 'No of Orders (Monthly)', value: analyticsData.stats.monthlyOrders, color: '#3b82f6', iconName: 'ShoppingCart', iconColor: '#3b82f6' },
    { title: 'Total Revenue (Monthly)', value: `$${analyticsData.stats.monthlyRevenue.toLocaleString()}`, color: '#22c55e', iconName: 'DollarSign', iconColor: '#22c55e' },
    { title: 'Todays Orders', value: analyticsData.stats.todaysOrders, color: '#f97316', iconName: 'Package', iconColor: '#f97316', withButton: true },
    { title: 'Registered Users (Monthly)', value: analyticsData.stats.monthlyRegisteredUsers, color: '#ef4444', iconName: 'Users', iconColor: '#ef4444' },
  ];
  
  // ✅ Fix: Handle empty avatar
  const customerData = analyticsData.recentCustomers.map((user: any) => ({
      avatar: user.profilePicture || null, // ✅ null instead of empty string
      name: user.name || 'N/A',
      phone: user.phoneNumber || 'N/A',
      email: user.email || 'N/A',
      location: user.address || 'N/A',
      date: new Date(user.createdAt).toLocaleString(),
  }));

  const transactionsData = analyticsData.recentOrders.map((order: any) => ({
      trxId: order.orderNo,
      amount: `৳ ${order.totalAmount}`,
      cardType: 'N/A',
      payment: order.paymentMethod,
      status: order.paymentStatus.toUpperCase(),
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCardData.map(card => (
          <ChartCard
            key={card.title}
            title={card.title}
            value={card.value}
            color={card.color}
            data={[]}
            iconName={card.iconName as any}
            iconColor={card.iconColor}
            withButton={card.withButton}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <CircleChart data={analyticsData.orderRatioChart} />
        </div>
        <div className="lg:col-span-3">
          <SalesAnalyticsChart data={analyticsData.salesAnalyticsChart} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
            <h2 className="text-xl font-semibold mb-4">Recent Customers</h2>
            <DataTable 
              columns={customer_data_columns} 
              data={customerData}
              pageSize={5} // ✅ Show only 5 rows per page
            />
        </div>
        <div>
            <h2 className="text-xl font-semibold mb-4">Payment History</h2>
            <DataTable 
              columns={transactions_columns} 
              data={transactionsData}
              pageSize={5} // ✅ Show only 5 rows per page
            />
        </div>
      </div>
    </div>
  );
}