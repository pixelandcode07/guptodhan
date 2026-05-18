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
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
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

      {/* ✅ Product List (ড্যাশবোর্ডের মতো সেম ডিজাইন) */}
      <div className="flex flex-col">
        {order.items.map((item, idx) => {
           // 🔥 সঠিক স্লাগ ফেচ করা হচ্ছে (যেটা page.tsx থেকে আসলো)
           const productSlug = (item as any).slug || item.id;
           
           // 🔥 Item Total Price
           const numericPrice = Number(item.priceFormatted.replace(/[^0-9]/g, '')) || 0;
           const itemTotal = numericPrice * (item.quantity || 1);
           const itemTotalFormatted = `৳ ${itemTotal.toLocaleString('en-US')}`;

           return (
             <div key={idx} className="flex gap-4 p-4 items-start border-b border-gray-50 last:border-0 hover:bg-gray-50/80 transition-colors">
                
                {/* ✅ Image Clickable (Using Slug) */}
                <Link href={`/product/${productSlug}`} className="shrink-0 relative border border-gray-200 rounded-md bg-white block overflow-hidden">
                  <Image 
                    src={item.thumbnailUrl || '/img/product/p-1.png'} 
                    alt={item.title || 'Product'} 
                    width={72} height={72} 
                    className="rounded-md object-cover h-[72px] w-[72px] hover:scale-105 transition-transform duration-300" 
                  />
                </Link>
                
                <div className="flex-1 flex flex-col sm:flex-row sm:justify-between gap-3 min-w-0">
                  <div className="space-y-1 min-w-0">
                    {/* ✅ Title Clickable (Using Slug) */}
                    <Link href={`/product/${productSlug}`} className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-[#0097E9] transition-colors pr-2">
                      {item.title || 'Product Name Unavailable'}
                    </Link>

                    {/* ✅ Qty Moved Here (Under Title) */}
                    <div className="text-xs text-gray-500 mt-1">
                      Qty: {item.quantity || 1}
                    </div>
                    
                    {/* Variants */}
                    {(item.size || item.color) && (
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && item.color && <span className="text-gray-300">|</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </div>
                    )}
                  </div>

                  {/* ✅ Right Side: Only Total Item Price */}
                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-sm text-slate-900 font-bold whitespace-nowrap">
                      {itemTotalFormatted}
                    </div>
                  </div>
                </div>
             </div>
           );
        })}
      </div>

      {/* Footer Section */}
      <div className="px-4 py-3 border-t border-gray-100 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-xs font-medium text-gray-500 flex flex-col gap-1">
          <span>{totalItems > 1 ? `${totalQuantity} Items ordered` : '1 Item ordered'}</span>
          {(order.deliveryMethod === 'steadfast' || order.deliveryMethod === 'Steadfast COD') && order.trackingId && (
            <span className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded w-fit mt-1 border border-blue-100">
              <Package className="h-3 w-3" /> Track: {order.trackingId}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 w-full sm:w-auto">
          <div className="text-sm flex items-center gap-2 mr-2">
            <span className="text-gray-600 font-medium">Total Order:</span>
            <span className="text-base font-bold text-[#EF4A23]">{displayTotal}</span>
          </div>

          <div className="flex items-center gap-2">
            {isDelivered && order.items.length > 0 && (
              <Link 
                href={`/product/${(order.items[0] as any).slug || order.items[0].id}#reviews`}
                onClick={(e) => e.stopPropagation()} 
                className="h-8 text-xs font-bold text-[#0097E9] bg-blue-50 hover:bg-[#0097E9] hover:text-white border border-blue-100 hover:border-[#0097E9] px-3 py-2 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap"
              >
                <Star className="w-3.5 h-3.5" /> Write a Review
              </Link>
            )}

            {isDelivered && (
              <Button size="sm" variant="outline" onClick={onReturnClick} className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-1.5 bg-white">
                <RotateCcw className="h-3.5 w-3.5" /> Return
              </Button>
            )}
            
            <Link href={`/home/UserProfile/orders/${order.id}`} className="h-8 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-4 py-2 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap">
              View Order <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}