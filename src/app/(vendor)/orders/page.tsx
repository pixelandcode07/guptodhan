import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DataTable } from '@/components/TableHelper/data-table';
import { vendorOrdersColumns } from '@/components/TableHelper/vendor_orders_columns';
import { fetchVendorOrders } from '@/lib/VendorApis/fetchVendorOrders';
import { getServerSession } from 'next-auth';

export default async function VendorOrdersPage() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  const vendorId = session?.user?.id; // সাধারণত সেশনে ইউজারের ID থাকে যা ভেন্ডর আইডি হিসেবে কাজ করে

  if (!vendorId) {
    return <div className="p-10 text-center text-red-500 font-bold">Please log in as a vendor.</div>;
  }

  let formattedOrders: any[] = [];

  try {
    const result = await fetchVendorOrders(vendorId, token);
    
    if (result && result.orders) {
      formattedOrders = result.orders.map((order: any, index: number) => ({
        id: order._id,
        sl: index + 1,
        orderNo: order.orderId,
        orderDate: new Date(order.createdAt).toLocaleDateString('en-GB'),
        customerName: order.shippingName || order.user?.name || 'Guest',
        phone: order.shippingPhone || 'N/A',
        total: order.totalAmount,
        status: order.orderStatus,
        payment: order.paymentStatus,
        // টেবিল কলাম যদি quantity/unitPrice চায় তবে প্রথম আইটেম থেকে দিচ্ছি
        quantity: order.orderDetails?.[0]?.quantity || 0,
        unitPrice: order.orderDetails?.[0]?.unitPrice || 0,
      }));
    }
  } catch (error) {
    console.error('Page Error:', error);
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Received Orders</h1>
      </div>

      <DataTable 
        columns={vendorOrdersColumns} 
        data={formattedOrders} 
      />
    </div>
  );
}