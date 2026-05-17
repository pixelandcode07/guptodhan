'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Package, RotateCcw, Star } from 'lucide-react'; // ✅ Star আইকন যোগ করা হলো
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
  
  // স্ট্যাটাস চেকিং (Case Insensitive)
  const status = order.status.toLowerCase();
  const isDelivered = status === 'delivered';
  const isReturnRequested = status === 'return_refund' || status === 'return request';

  // 🔥 সর্বমোট বিল (Total Order Price) হিসাব করার লজিক (Fallback সহ)
  const computedSubtotal = order.items.reduce((sum, item) => {
    const numericPrice = Number(item.priceFormatted.replace(/[^0-9]/g, '')) || 0;
    return sum + (numericPrice * item.quantity);
  }, 0);

  // API থেকে totalAmount থাকলে সেটা দেখাবে, না থাকলে হিসাব করা টোটাল দেখাবে
  const displayTotal = (order as any).totalAmount 
    ? `৳ ${(order as any).totalAmount.toLocaleString('en-US')}` 
    : `৳ ${computedSubtotal.toLocaleString('en-US')}`;

  return (
    <div className="border rounded-md overflow-hidden bg-white shadow-sm transition-shadow hover:shadow-md">
      
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
        <div className="text-sm font-medium flex items-center gap-2">
          <span className="text-gray-900">{order.storeName}</span>
          {order.storeVerified && (
            <span className="text-blue-600 text-xs inline-flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
              Verified <CheckCircle className="h-3 w-3" />
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
           {/* রিটার্ন রিকোয়েস্ট করা থাকলে ব্যাজ দেখাবে */}
           {isReturnRequested && (
              <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                Return Requested
              </span>
           )}
           <OrderStatusBadge status={order.status} />
        </div>
      </div>

      {/* Body Section - Clickable Link */}
      <Link href={`/home/UserProfile/orders/${order.id}`} className="flex gap-4 p-4 items-start hover:bg-gray-50/50 transition-colors">
        <div className="shrink-0 relative border rounded bg-gray-100">
          <Image 
            src={firstItem?.thumbnailUrl || '/img/product/p-1.png'} 
            alt={firstItem?.title || 'Product'} 
            width={72} 
            height={72} 
            className="rounded object-cover h-[72px] w-[72px]" 
          />
          {totalItems > 1 && (
            <div className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
              +{totalItems - 1}
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="text-sm font-medium text-gray-900 line-clamp-1">
              {firstItem?.title || 'Product Name Unavailable'}
            </div>
            <div className="text-sm text-slate-900 font-semibold whitespace-nowrap ml-2">
              {firstItem?.priceFormatted || '৳ 0'}
            </div>
          </div>
          
          {(firstItem?.size || firstItem?.color) && (
            <div className="text-xs text-gray-500 mt-1">
              {firstItem?.size && <span>Size: <span className="text-gray-700">{firstItem.size}</span></span>}
              {firstItem?.size && firstItem?.color && ' · '}
              {firstItem?.color && <span>Color: <span className="text-gray-700">{firstItem.color}</span></span>}
            </div>
          )}
          
          <div className="flex justify-between items-end mt-2">
            <div className="text-xs text-gray-500">
              {totalItems > 1 ? `Total Items: ${totalQuantity}` : `Qty: ${firstItem?.quantity || 1}`}
            </div>
            
            {/* Tracking Info (if available) */}
            {(order.deliveryMethod === 'steadfast' || order.deliveryMethod === 'Steadfast COD') && order.trackingId && (
               <div className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded">
                 <Package className="h-3 w-3" />
                 <span>Track: {order.trackingId}</span>
               </div>
            )}
          </div>
        </div>
      </Link>

      {/* ── ✅ Footer Section: Total Price & Actions ── */}
      <div className="px-4 py-3 border-t bg-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="text-xs font-medium text-gray-500">
          {totalItems > 1 ? `${totalQuantity} Items ordered` : '1 Item ordered'}
        </div>

        <div className="flex flex-wrap items-center justify-end gap-3 w-full sm:w-auto">
          {/* 💰 টোটাল প্রাইস ডিসপ্লে */}
          <div className="text-sm flex items-center gap-2 mr-1">
            <span className="text-gray-600 font-medium">Total Order:</span>
            <span className="text-base font-bold text-[#EF4A23]">{displayTotal}</span>
          </div>

          {/* 🛠️ অ্যাকশন বাটনসমূহ: শুধুমাত্র Delivered হলেই রিভিউ এবং রিটার্ন বাটন আসবে */}
          {isDelivered && (
            <div className="flex items-center gap-2">
              {/* 🌟 Write a Review Button */}
              <Link 
                href={`/product/${(order as any).productSlug || (firstItem as any).productSlug || 'slug'}#reviews`}
                onClick={(e) => e.stopPropagation()} // বুদবুদ হওয়া আটকাবে যাতে মূল লিংকে ক্লিক না পড়ে
                className="h-8 text-xs font-bold text-[#0097E9] bg-blue-50 hover:bg-[#0097E9] hover:text-white border border-blue-100 hover:border-[#0097E9] px-3 py-2 rounded-md transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap"
              >
                <Star className="w-3.5 h-3.5" />
                Write a Review
              </Link>

              {/* Return Item Button */}
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-1.5 bg-white"
                onClick={(e) => {
                  e.preventDefault(); 
                  e.stopPropagation();
                  onReturnClick();
                }}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Return Item
              </Button>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}