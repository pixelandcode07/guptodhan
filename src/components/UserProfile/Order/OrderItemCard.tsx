'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Package, RotateCcw, Star, ArrowRight } from 'lucide-react';
import type { OrderSummary } from './types';
import OrderStatusBadge from './OrderStatusBadge';
import { Button } from '@/components/ui/button';

interface OrderItemCardProps {
  order: OrderSummary;
  onReturnClick: () => void;
}

export default function OrderItemCard({ order, onReturnClick }: OrderItemCardProps) {
  const firstItem = order.items[0];
  const totalItems = order.items.length;
  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);
  
  const status = order.status.toLowerCase();
  const isDelivered = status === 'delivered';
  const isReturnRequested = status === 'return_refund' || status === 'return request';

  const computedSubtotal = order.items.reduce((sum, item) => {
    const numericPrice = Number(item.priceFormatted.replace(/[^0-9]/g, '')) || 0;
    return sum + (numericPrice * item.quantity);
  }, 0);

  const displayTotal = (order as any).totalAmount 
    ? `৳ ${(order as any).totalAmount.toLocaleString('en-US')}` 
    : `৳ ${computedSubtotal.toLocaleString('en-US')}`;

  return (
    <div className="border rounded-md overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md">
      
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
        <div className="text-sm font-medium flex items-center gap-2">
          <span className="text-gray-900">{order.storeName}</span>
          {order.storeVerified && (
            <span className="text-blue-600 text-xs inline-flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
              Verified <CheckCircle className="h-3 w-3" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
           {isReturnRequested && (
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                Return Requested
              </span>
           )}
           <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Product Items List */}
      <div className="flex flex-col">
        {order.items.map((item, idx) => (
           <div key={idx} className="flex gap-4 p-4 items-start border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
              <Link href={`/product/${(item as any).productSlug || item.id}`} className="shrink-0 relative border rounded bg-white block">
                <Image 
                  src={item.thumbnailUrl || '/img/product/p-1.png'} 
                  alt={item.title || 'Product'} 
                  width={72} height={72} 
                  className="rounded object-cover h-[72px] w-[72px] hover:opacity-80 transition-opacity" 
                />
              </Link>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <Link href={`/product/${(item as any).productSlug || item.id}`} className="text-sm font-medium text-gray-900 line-clamp-2 hover:text-[#0097E9] transition-colors pr-2">
                    {item.title || 'Product Name Unavailable'}
                  </Link>
                  <div className="text-sm text-slate-900 font-semibold whitespace-nowrap ml-2">
                    {item.priceFormatted || '৳ 0'}
                  </div>
                </div>
                
                {(item.size || item.color) && (
                  <div className="text-xs text-gray-500 mt-1">
                    {item.size && <span>Size: <span className="text-gray-700">{item.size}</span></span>}
                    {item.size && item.color && ' · '}
                    {item.color && <span>Color: <span className="text-gray-700">{item.color}</span></span>}
                  </div>
                )}
                
                <div className="flex justify-between items-end mt-3">
                  <div className="text-xs text-gray-500 font-medium">
                    Qty: {item.quantity || 1}
                  </div>
                </div>
              </div>
           </div>
        ))}
      </div>

      {/* Footer Section */}
      <div className="px-4 py-3 border-t bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-xs font-medium text-gray-500 flex flex-col gap-1">
          <span>{totalItems > 1 ? `${totalQuantity} Items ordered` : '1 Item ordered'}</span>
          {(order.deliveryMethod === 'steadfast' || order.deliveryMethod === 'Steadfast COD') && order.trackingId && (
            <span className="flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded w-fit mt-1">
              <Package className="h-3 w-3" /> Track: {order.trackingId}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 w-full sm:w-auto">
          <div className="text-sm flex items-center gap-2 mr-2">
            <span className="text-gray-600 font-medium">Total:</span>
            <span className="text-base font-bold text-[#EF4A23]">{displayTotal}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* ✅ Write a Review Button (আগের মতো নিচে আনা হয়েছে) */}
            {isDelivered && (
              <Link 
                href={`/product/${(firstItem as any).productSlug || firstItem.id}#reviews`}
                onClick={(e) => e.stopPropagation()} 
                className="h-8 text-xs font-bold text-[#0097E9] bg-blue-50 hover:bg-[#0097E9] hover:text-white border border-blue-100 px-3 py-2 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <Star className="w-3.5 h-3.5" /> Write a Review
              </Link>
            )}

            {isDelivered && (
              <Button size="sm" variant="outline" onClick={onReturnClick} className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-1.5 bg-white">
                <RotateCcw className="h-3.5 w-3.5" /> Return
              </Button>
            )}
            
            <Link href={`/home/UserProfile/orders/${order.id}`} className="h-8 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-md transition-all flex items-center gap-1.5">
              View Order <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}