'use client';

import { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

interface OrderItem {
  id: string | number;
  store: string;
  verified: boolean;
  productName: string;
  size?: string;
  color?: string;
  price: number | string;
  qty: number;
  image: string;
  status: string;
}

interface ToBeReviewProps {
  orders?: OrderItem[];
}

const getStatusStyles = (status: string) => {
  const s = status.toLowerCase();
  switch (s) {
    case 'cancelled':
    case 'canceled':
      return 'bg-red-100 text-red-600';
    case 'delivered':
      return 'bg-green-100 text-green-700';
    case 'processing':
      return 'bg-blue-100 text-blue-600';
    case 'pending':
      return 'bg-yellow-100 text-yellow-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const ToBeReview: FC<ToBeReviewProps> = ({ orders = [] }) => {
  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="bg-white rounded-md border p-8 text-center text-gray-500 text-sm">
          No items to review.
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="flex items-start justify-between rounded-md border bg-gray-50 p-4 transition-all hover:shadow-sm"
          >
            <div className="flex gap-4">
              <Image
                src={order.image}
                alt={order.productName}
                width={100}
                height={100}
                className="rounded-md object-cover h-20 w-20 border"
              />
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-800">
                  {order.store}
                  {order.verified && (
                    <span className="text-blue-600 text-xs flex items-center gap-1 font-medium">
                      Verified Seller <CheckCircle className="h-3 w-3" />
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-gray-700 line-clamp-2">{order.productName}</p>
                
                {(order.size || order.color) && (
                  <p className="text-xs text-gray-500 mt-1">
                    {order.size && <span>Size: {order.size}</span>}
                    {order.size && order.color && ' · '}
                    {order.color && <span>Color: {order.color}</span>}
                  </p>
                )}
                
                <p className="mt-1 font-semibold text-blue-600">
                  {typeof order.price === 'number' ? `৳ ${order.price.toLocaleString()}` : order.price}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">Qty {order.qty}</p>
              </div>
            </div>

            <Badge
              className={cn(
                'rounded px-3 py-1 text-xs font-medium border-0',
                getStatusStyles(order.status)
              )}
            >
              {order.status.charAt(0).toUpperCase() + order.status.slice(1).toLowerCase()}
            </Badge>
          </div>
        ))
      )}
    </div>
  );
};

export default ToBeReview;