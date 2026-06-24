import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { fetchVendorOrders } from '@/lib/VendorApis/fetchVendorOrders';
import { getServerSession } from 'next-auth';
import VendorOrdersClient from './[id]/components/VendorOrdersClient';

export default async function VendorOrdersPage() {
  const session = await getServerSession(authOptions);
  const vendorId = session?.user?.vendorId || (session?.user as any)?.id;

  if (!vendorId) {
    return (
      <div className="p-10 text-center text-red-500 font-bold">
        Error: Unauthorized access. Please login again.
      </div>
    );
  }

  let formattedOrders: any[] = [];

  try {
    const result = await fetchVendorOrders(vendorId, session?.accessToken);

    if (result && result.orders) {
      formattedOrders = result.orders.map((o: any, i: number) => ({
        id: o._id,
        sl: i + 1,
        orderNo: o.orderId || 'N/A',
        orderDate: o.createdAt ? new Date(o.createdAt).toLocaleDateString('en-GB') : 'N/A',
        from: o.orderForm || 'Website',
        userName: o.shippingName || o.user?.name || 'Guest',
        phone: o.shippingPhone || 'N/A',
        // ✅ NEW: Mapped Product and Earnings fields
        productName: o.products?.[0]?.productTitle || 'Unknown Product',
        productImage: o.products?.[0]?.thumbnailImage || '',
        vendorEarned: o.vendorEarned || 0,
        total: typeof o.totalAmount === 'number' ? o.totalAmount : 0,
        payment: o.paymentStatus || 'Pending',
        delivery: o.deliveryMethodId || 'Standard',
        trackingId: o.trackingId || '',
        parcelId: o.parcelId || '',
        status: o.orderStatus || 'Pending',
      }));
    }
  } catch (e) {
    console.error('Error loading orders:', e);
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen pb-32">
      <div className="max-w-[1600px] mx-auto space-y-6">
        <div className="flex flex-col gap-1">
           <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Order Management</h1>
           <p className="text-sm text-gray-500">Manage all your store orders and track earnings.</p>
        </div>
        
        {/* Pass data to Client Component to enable interactivity (Bulk Actions) */}
        <VendorOrdersClient initialOrders={formattedOrders} />
      </div>
    </div>
  );
}