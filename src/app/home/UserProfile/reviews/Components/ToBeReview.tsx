'use client';

import { FC, useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { CheckCircle, Loader2, Package } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import axios from 'axios';

interface PendingReviewItem {
  id: string;
  orderId: string;
  productId: string;
  slug?: string;
  store: string;
  verified: boolean;
  productName: string;
  size?: string;
  color?: string;
  price: number;
  qty: number;
  image: string;
  status: string;
}

const getStatusStyles = (status: string) => {
  const s = status.toLowerCase();
  switch (s) {
    case 'delivered':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

const ToBeReview: FC = () => {
  const { data: session } = useSession();
  const [itemsToReview, setItemsToReview] = useState<PendingReviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchToBeReviewed = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      const user = session.user as any;
      const userId = user.id || user._id;

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const headers = user.accessToken ? { Authorization: `Bearer ${user.accessToken}` } : {};

        // 1. Fetch Orders
        const ordersRes = await axios.get(`/api/v1/product-order?userId=${userId}`, { headers });
        
        // 2. Fetch User Reviews (to filter out already reviewed items)
        const reviewsRes = await axios.get(`/api/v1/product-review/product-review-user/${userId}`, { headers });

        if (ordersRes.data?.success) {
          const allOrders = Array.isArray(ordersRes.data.data) ? ordersRes.data.data : ordersRes.data.data?.data || [];
          
          // Get only "Delivered" orders
          const deliveredOrders = allOrders.filter((o: any) => o.orderStatus === 'Delivered');

          // Get product IDs that have already been reviewed
          const reviewedProductIds = new Set(
            (reviewsRes.data?.data || []).map((r: any) => r.productId?._id?.toString() || r.productId?.toString())
          );

          const pendingItems: PendingReviewItem[] = [];

          deliveredOrders.forEach((order: any) => {
            order.orderDetails?.forEach((detail: any) => {
              const prodId = detail.productId?._id || detail.productId;
              
              // If product is NOT in reviewed list, add it to pending reviews
              if (!reviewedProductIds.has(prodId?.toString())) {
                pendingItems.push({
                  id: detail._id || prodId,
                  orderId: order.orderId || order._id,
                  productId: prodId,
                  slug: detail.productId?.slug,
                  store: order.storeId?.storeName || order.storeName || 'Store',
                  verified: order.storeVerified || false,
                  productName: detail.productId?.productTitle || order.shippingName || 'Product',
                  size: detail.size,
                  color: detail.color,
                  price: detail.unitPrice || detail.totalPrice || 0,
                  qty: detail.quantity || 1,
                  image: detail.productId?.thumbnailImage || '/img/product/p-1.png',
                  status: order.orderStatus,
                });
              }
            });
          });

          setItemsToReview(pendingItems);
        }
      } catch (error) {
        console.error('Error fetching to-be-reviewed items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchToBeReviewed();
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-500 font-medium">Finding products to review...</span>
      </div>
    );
  }

  return (
    <div className="space-y-4 mt-2">
      {itemsToReview.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center text-gray-500 flex flex-col items-center">
          <Package className="w-16 h-16 text-gray-300 mb-3" />
          <p className="font-medium text-gray-600">No items to review right now.</p>
          <p className="text-xs text-gray-400 mt-1">Purchase and receive items to write reviews.</p>
        </div>
      ) : (
        itemsToReview.map((order, idx) => (
          <div
            key={`${order.id}-${idx}`}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border bg-white p-5 transition-all hover:shadow-md"
          >
            <div className="flex gap-4 items-start">
              <div className="shrink-0 rounded-md border border-gray-100 overflow-hidden bg-white">
                <Image
                  src={order.image}
                  alt={order.productName}
                  width={80}
                  height={80}
                  className="object-cover h-20 w-20"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1">
                  {order.store}
                  {order.verified && (
                    <span className="text-blue-600 flex items-center gap-0.5">
                      <CheckCircle className="h-3 w-3" />
                    </span>
                  )}
                </div>
                <p className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug">{order.productName}</p>
                
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  <span className="font-semibold text-blue-600">৳ {order.price.toLocaleString()}</span>
                  <span>Qty: {order.qty}</span>
                  {(order.size || order.color) && (
                    <span>
                      {order.color && `Color: ${order.color}`}
                      {order.size && order.color && ' | '}
                      {order.size && `Size: ${order.size}`}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 w-full sm:w-auto shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
              <Badge className={cn('rounded px-2.5 py-0.5 text-[10px] font-bold border-0', getStatusStyles(order.status))}>
                {order.status.toUpperCase()}
              </Badge>
              
              <Link 
                href={order.slug ? `/product/${order.slug}#reviews` : '#'}
                className="text-xs font-bold bg-[#EF4A23] hover:bg-[#d43d1a] text-white px-4 py-2 rounded-md transition-colors shadow-sm"
              >
                Review Now
              </Link>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ToBeReview;