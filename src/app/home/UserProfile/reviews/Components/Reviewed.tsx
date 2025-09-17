'use client';

import { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';

type OrderStatus = 'Canceled' | 'Delivered' | 'Pending';

interface OrderItem {
  id: number;
  store: string;
  verified: boolean;
  productName: string;
  size: string;
  color: string;
  price: number;
  qty: number;
  image: string;
  status: OrderStatus;
}

const orders: OrderItem[] = [
  {
    id: 1,
    store: 'TechStore Pro',
    verified: true,
    productName: 'Braun Silk-épil 9 Cordless Epilator',
    size: 'XL',
    color: 'Green',
    price: 7200,
    qty: 1,
    image: '/img/product/p-2.png', // replace with your image path
    status: 'Canceled',
  },
  {
    id: 2,
    store: 'TechStore Pro',
    verified: true,
    productName: 'Braun Silk-épil 9 Cordless Epilator',
    size: 'XL',
    color: 'Green',
    price: 7200,
    qty: 1,
    image: '/img/product/p-4.png',
    status: 'Delivered',
  },
  {
    id: 3,
    store: 'TechStore Pro',
    verified: true,
    productName: 'Braun Silk-épil 9 Cordless Epilator',
    size: 'XL',
    color: 'Green',
    price: 7200,
    qty: 1,
    image: '/img/product/p-3.png',
    status: 'Canceled',
  },
];

const statusStyles: Record<OrderStatus, string> = {
  Canceled: 'bg-red-100 text-red-600',
  Delivered: 'bg-green-100 text-green-600',
  Pending: 'bg-yellow-100 text-yellow-600',
};

const Reviewed: FC = () => {
  return (
    <div className="space-y-4">
      {orders.map(order => (
        <div
          key={order.id}
          className="flex items-start justify-between rounded-md border bg-gray-50 p-4">
          <div className="flex gap-4">
            <Image
              src={order.image}
              alt={order.productName}
              width={100}
              height={100}
              className="rounded-md object-cover"
            />
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold">
                {order.store}
                {order.verified && (
                  <span className="text-blue-500 text-sm font-medium">
                    Verified Seller ✅
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-700">{order.productName}</p>
              <p className="text-sm text-gray-500">
                Size: {order.size}, Color: {order.color}
              </p>
              <p className="mt-1 font-semibold text-blue-600">
                ৳ {order.price.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">Qty {order.qty}</p>
            </div>
          </div>

          <Badge
            className={cn(
              'rounded px-3 py-1 text-xs font-medium',
              statusStyles[order.status]
            )}>
            {order.status}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default Reviewed;
