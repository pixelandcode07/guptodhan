import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DataTable } from '@/components/TableHelper/data-table';
import { vendorOrdersColumns } from '@/components/TableHelper/vendor_orders_columns';
import { fetchVendorOrders } from '@/lib/VendorApis/fetchVendorOrders';
import { getServerSession } from 'next-auth';

export default async function VendorOrdersPage() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  
  // ✅ সেশন থেকে ভেন্ডর আইডি অথবা ইউজার আইডি নেওয়া হচ্ছে
  const vendorId = session?.user?.vendorId || session?.user?.id;

  if (!vendorId) {
    return (
      <div className="p-10 text-center text-red-500">
        Unauthorized access. Please login as a vendor.
      </div>
    );
  }

  let ordersData: any[] = [];

  try {
    const result = await fetchVendorOrders(vendorId, token);
    
    if (result && result.orders) {
      // ✅ টেবিল কলামের সাথে ডাটা ফরম্যাট করা হচ্ছে
      ordersData = result.orders.map((order: any, index: number) => ({
        id: order._id,
        sl: index + 1,
        orderNo: order.orderId,
        orderDate: new Date(order.createdAt).toLocaleDateString('en-GB'),
        name: order.shippingName || order.user?.name || 'N/A',
        phone: order.shippingPhone || 'N/A',
        total: order.totalAmount,
        status: order.orderStatus,
        payment: order.paymentStatus,
        // অর্ডার ডিটেইলস থেকে কোয়ান্টিটি নেওয়া
        quantity: order.orderDetails?.[0]?.quantity || 1,
      }));
    }
  } catch (error) {
    console.error('Page Render Error:', error);
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Store Orders</h1>

      {ordersData.length === 0 ? (
        <div className="bg-white p-10 rounded-lg border text-center text-gray-500">
          No orders found for your store.
        </div>
      ) : (
        <DataTable 
          columns={vendorOrdersColumns} 
          data={ordersData} 
        />
      )}
    </div>
  );
}