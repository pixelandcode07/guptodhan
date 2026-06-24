'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, PackageX, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

// টাইপ ডেফিনিশন আপডেট করা হলো (slug যুক্ত করা হয়েছে লিংকের জন্য)
interface OrderItem {
  id: string;
  slug: string;
  store: string;
  verified: boolean;
  productName: string;
  size: string;
  color: string;
  price: number;
  qty: number;
  image: string;
  status: string;
  orderId: string;
  placedAt: string;
  logisticsMessage?: string;
}

export default function MyReturn() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session, status } = useSession();

  const fetchReturnedOrders = useCallback(async () => {
    if (status === 'loading') return;
    if (status === 'unauthenticated') {
      setLoading(false);
      return;
    }

    try {
      const userLike = (session?.user ?? {}) as { id?: string; _id?: string };
      const userId = userLike._id || userLike.id;
      const token = (session as { accessToken?: string })?.accessToken;

      if (!userId) {
        setOrders([]);
        setLoading(false);
        return;
      }

      // ✅ API Call
      const response = await axios.get(`/api/v1/product-order/return/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const apiOrders = (response.data?.data ?? []) as any[];
      const mappedItems: OrderItem[] = [];

      apiOrders.forEach((order) => {
        if (order.orderDetails && Array.isArray(order.orderDetails)) {
          order.orderDetails.forEach((detail: any, index: number) => {
            
            // 🔥 প্রোডাক্ট ফেচিং লজিক স্ট্রং করা হলো
            let product: any = null;
            if (detail.productId && typeof detail.productId === 'object') {
              product = detail.productId;
            } else if (detail.product && typeof detail.product === 'object') {
              product = detail.product;
            }

            // 🔥 ইমেজ হ্যান্ডলিং (যেকোনো জায়গা থেকে ইমেজ খুঁজবে)
            let productImage = '/img/product/p-1.png';
            if (product?.thumbnailImage) {
              productImage = product.thumbnailImage;
            } else if (Array.isArray(product?.photoGallery) && product.photoGallery.length > 0) {
              productImage = product.photoGallery[0];
            } else if (detail.thumbnailImage || detail.productImage) {
              productImage = detail.thumbnailImage || detail.productImage;
            }

            // 🔥 প্রোডাক্ট নেম (ভুল করেও যেন ইউজারের নাম না দেখায়)
            const productName = product?.productTitle || product?.name || detail.productName || 'Returned Product';
            const productSlug = product?.slug || product?._id || detail.productId || '';

            // 🔥 সাইজ এবং কালার ক্লিনিং
            const size = detail.size?.trim() && detail.size !== '—' ? detail.size : '';
            const color = detail.color?.trim() && detail.color !== '—' ? detail.color : '';

            // 🔥 প্রাইস ক্যালকুলেশন
            const unitPrice = detail.unitPrice || 
                              (detail.totalPrice && detail.quantity ? detail.totalPrice / detail.quantity : 0) || 
                              product?.productPrice || 0;

            mappedItems.push({
              id: detail._id || `${order._id}_${index}`,
              slug: productSlug,
              store: order.storeId?.storeName || order.storeName || 'Store',
              verified: true, 
              productName: productName,
              size: size,
              color: color,
              price: unitPrice,
              qty: detail.quantity || 1,
              image: productImage,
              status: order.orderStatus || 'Returned',
              orderId: order.orderId,
              placedAt: new Date(order.createdAt).toLocaleString(),
              logisticsMessage: 'Return processed',
            });
          });
        }
      });

      setOrders(mappedItems);
    } catch (error) {
      console.error('Error fetching returned orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [session, status]);

  useEffect(() => {
    fetchReturnedOrders();
  }, [fetchReturnedOrders]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <PackageX className="w-8 h-8 text-gray-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">No Returned Orders</h3>
        <p className="text-gray-500 mt-1">You haven't returned any items yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order.id} className="space-y-3">
          {/* Product row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-[#fafafa] rounded-sm px-4 py-4 border border-gray-100 gap-4">
            
            <div className="flex gap-4 items-start w-full">
              {/* ✅ Image with fallback and Link */}
              <Link href={`/product/${order.slug}`} className="w-[90px] h-[90px] flex-shrink-0 bg-white rounded border border-gray-200 overflow-hidden block">
                <Image
                  src={order.image}
                  alt={order.productName}
                  width={90}
                  height={90}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/img/product/p-1.png'; // Fallback image if broken
                  }}
                />
              </Link>

              <div className="flex-1 min-w-0">
                {/* Store Name */}
                <div className="flex items-center gap-2 text-[14px] font-semibold text-gray-900">
                  {order.store}
                  {order.verified && (
                    <span className="flex items-center gap-1 text-[12px] font-normal text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                      Verified Seller <CheckCircle className="h-3 w-3" />
                    </span>
                  )}
                </div>
                
                {/* ✅ Product Name Clickable */}
                <Link href={`/product/${order.slug}`} className="mt-1 block text-[15px] text-gray-800 font-medium line-clamp-2 hover:text-[#0097E9] transition-colors pr-4">
                  {order.productName}
                </Link>

                {/* ✅ Clean Size & Color Display */}
                {(order.size || order.color) && (
                  <div className="text-[13px] text-gray-500 mt-1.5 flex items-center gap-2">
                    {order.color && <span>Color: <span className="font-medium text-gray-700">{order.color}</span></span>}
                    {order.size && order.color && <span className="text-gray-300">|</span>}
                    {order.size && <span>Size: <span className="font-medium text-gray-700">{order.size}</span></span>}
                  </div>
                )}
                
                {/* Price and Qty */}
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-[15px] font-bold text-[#EF4A23]">
                    ৳ {order.price.toLocaleString('en-US')}
                  </p>
                  <p className="text-[13px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    Qty: {order.qty}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="shrink-0 self-start sm:self-center w-full sm:w-auto flex justify-end">
              <Badge
                className={cn(
                  'rounded-md px-3 py-1.5 text-[12px] font-medium border border-transparent shadow-sm whitespace-nowrap',
                  order.status.toLowerCase().includes('return') 
                    ? 'bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-100'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}>
                {order.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Order info row */}
          <div className="flex items-center justify-between bg-white border border-gray-100 rounded-sm px-4 py-3 text-[13px]">
            <div>
              <p className="text-gray-800 font-semibold mb-0.5">Order #{order.orderId}</p>
              <p className="text-[12px] text-gray-500">
                Placed on {order.placedAt}
              </p>
            </div>

            {order.logisticsMessage && (
              <div className="flex items-center gap-2 text-[12px] font-medium text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-md">
                {order.logisticsMessage}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}