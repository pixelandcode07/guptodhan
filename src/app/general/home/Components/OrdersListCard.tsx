'use client';

interface Order {
  productName: string;
  productId: string;
  price: number;
  deliveryDate: string;
}

export default function OrdersListCard({ orders }: { orders: Order[] }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900">Orders</h3>
        <button className="text-gray-400 hover:text-gray-600">⋯</button>
      </div>
      <div className="space-y-4">
        {orders.slice(0, 5).map((order, idx) => (
          <div key={idx} className="pb-4 border-b border-gray-100 last:border-0">
            <p className="text-sm font-medium text-gray-900 truncate">{order.productName}</p>
            <div className="flex justify-between mt-2">
              <span className="text-xs text-gray-500">Price: ৳{order.price}</span>
              <span className="text-xs text-gray-500">{order.deliveryDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}