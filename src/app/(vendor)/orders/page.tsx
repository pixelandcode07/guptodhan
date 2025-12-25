import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { DataTable } from '@/components/TableHelper/data-table';
import { vendorOrdersColumns } from '@/components/TableHelper/vendor_orders_columns';
import { fetchVendorOrders } from '@/lib/VendorApis/fetchVendorOrders';
import { getServerSession } from 'next-auth';

export default async function VendorOrdersPage() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  const vendorId = session?.user?.vendorId;

  if (!vendorId) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Vendor Orders</h1>
        <p className="text-red-600">Please log in as a vendor.</p>
      </div>
    );
  }

  let ordersWithStore: any[] = [];

  try {
    const result = await fetchVendorOrders(vendorId, token);
    console.log('result', result)

    const storeName = result.store.storeName;

    // Flatten orders and attach storeName + extract first orderDetail for unitPrice/quantity
    ordersWithStore = result.orders.map((order) => {
      const firstDetail = order.orderDetails[0] || {};
      return {
        ...order,
        storeName,
        userName: order.userId.name,
        userEmail: order.userId.email,
        quantity: firstDetail.quantity || 0,
        unitPrice: firstDetail.unitPrice || 0,
      };
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
  }

  return (
    <div className="">
      <h1 className="text-3xl font-bold mb-6">Vendor Orders</h1>

      {ordersWithStore.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          No orders found.
        </p>
      ) : (
        <DataTable
          columns={vendorOrdersColumns}
          data={ordersWithStore}
        />
      )}
    </div>
  );
}