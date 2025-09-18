'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, Send } from 'lucide-react';

type OrderStatus = 'Processing' | 'Refunded';

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
  orderId: string;
  placedAt: string;
  logisticsMessage?: string;
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
    image: '/img/product/p-5.png',
    status: 'Processing',
    orderId: '672966591568893',
    placedAt: '23 Mar 2025 14:52:59',
    logisticsMessage: 'Your Package has been send to Logistics',
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
    image: '/img/product/p-5.png',
    status: 'Refunded',
    orderId: '672986591568892',
    placedAt: '24 Mar 2025 10:20:00',
  },
];

const statusStyles: Record<OrderStatus, string> = {
  Processing: 'bg-blue-100 text-blue-500',
  Refunded: 'bg-green-100 text-green-500',
};

export default function MyReturn() {
  return (
    <div className="space-y-6">
      {orders.map(order => (
        <div key={order.id} className="space-y-3">
          {/* Product row */}
          <div className="flex items-start justify-between bg-[#fafafa] rounded-sm px-4 py-3">
            <div className="flex gap-4">
              <Image
                src={order.image}
                alt={order.productName}
                width={90}
                height={90}
                className="rounded object-cover border"
              />
              <div>
                <div className="flex items-center gap-2 text-[15px] font-semibold">
                  {order.store}
                  {order.verified && (
                    <span className="flex items-center gap-1 text-[13px] font-normal text-blue-500">
                      Verified Saller
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[14px] text-gray-800">
                  {order.productName}
                </p>
                <p className="text-[13px] text-gray-600">
                  Size: {order.size} , Color: {order.color}
                </p>
                <p className="mt-1 text-[15px] font-semibold text-blue-600">
                  ৳ {order.price.toLocaleString()}
                </p>
                <p className="text-[12px] text-gray-500">Qty 0{order.qty}</p>
              </div>
            </div>

            <Badge
              className={cn(
                'rounded-sm px-3 py-1 text-[12px] font-medium',
                statusStyles[order.status]
              )}>
              {order.status}
            </Badge>
          </div>

          {/* Order info row */}
          <div className="flex items-center justify-between bg-[#fafafa] rounded-sm px-4 py-2 text-[13px] text-gray-700">
            <div>
              <p>Order {order.orderId}</p>
              <p className="text-[12px] text-gray-500">
                Placed on {order.placedAt}
              </p>
            </div>

            {order.logisticsMessage && (
              <div className="flex items-center gap-2 text-[13px] font-medium text-gray-700">
                <Send className="h-4 w-4 text-blue-500" />
                {order.logisticsMessage}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
