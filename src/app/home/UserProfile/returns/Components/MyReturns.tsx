'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CheckCircle, PackageX, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

// টাইপ ডেফিনিশন
interface OrderItem {
  id: string;
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

      // ✅ Data Mapping
      // ফ্ল্যাট লিস্ট তৈরি করা হচ্ছে (প্রতিটি প্রোডাক্ট আলাদা রো হিসেবে দেখানোর জন্য)
      const mappedItems: OrderItem[] = [];

      apiOrders.forEach((order) => {
        if (order.orderDetails && Array.isArray(order.orderDetails)) {
          order.orderDetails.forEach((detail: any, index: number) => {
            let product = null;
            if (detail.productId && typeof detail.productId === 'object') {
              product = detail.productId;
            }

            // ইমেজ হ্যান্ডলিং
            let productImage = '/img/product/p-1.png';
            if (product) {
              if (product.thumbnailImage) {
                productImage = product.thumbnailImage;
              } else if (product.photoGallery && product.photoGallery.length > 0) {
                productImage = product.photoGallery[0];
              }
            }

            mappedItems.push({
              id: detail._id || `${order._id}_${index}`,
              store: order.storeId?.storeName || 'Store',
              verified: true, // ডাটাবেস থেকে আসলে ডায়নামিক করবেন
              productName: product?.productTitle || order.shippingName || 'Unknown Product',
              size: detail.size || 'Standard',
              color: detail.color || 'Default',
              price: detail.unitPrice || product?.productPrice || 0,
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
          <div className="flex items-start justify-between bg-[#fafafa] rounded-sm px-4 py-3 border border-gray-100">
            <div className="flex gap-4">
              <div className="w-[90px] h-[90px] flex-shrink-0 bg-white rounded border overflow-hidden">
                <Image
                  src={order.image}
                  alt={order.productName}
                  width={90}
                  height={90}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2 text-[15px] font-semibold text-gray-900">
                  {order.store}
                  {order.verified && (
                    <span className="flex items-center gap-1 text-[13px] font-normal text-blue-500">
                      Verified Seller
                      <CheckCircle className="h-3 w-3" />
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[14px] text-gray-800 font-medium line-clamp-1">
                  {order.productName}
                </p>
                <p className="text-[13px] text-gray-500 mt-1">
                  Size: {order.size} , Color: {order.color}
                </p>
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-[15px] font-bold text-blue-600">
                    ৳ {order.price.toLocaleString()}
                  </p>
                  <p className="text-[12px] text-gray-500">Qty: {order.qty}</p>
                </div>
              </div>
            </div>

            <Badge
              className={cn(
                'rounded-sm px-3 py-1 text-[12px] font-medium border-0',
                order.status.toLowerCase() === 'returned' 
                  ? 'bg-red-100 text-red-600 hover:bg-red-100'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-100'
              )}>
              {order.status}
            </Badge>
          </div>

          {/* Order info row */}
          <div className="flex items-center justify-between bg-white border border-gray-100 rounded-sm px-4 py-2 text-[13px]">
            <div>
              <p className="text-gray-700 font-medium">Order #{order.orderId}</p>
              <p className="text-[12px] text-gray-400">
                Placed on {order.placedAt}
              </p>
            </div>

            {order.logisticsMessage && (
              <div className="hidden sm:flex items-center gap-2 text-[12px] font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded">
                {order.logisticsMessage}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}