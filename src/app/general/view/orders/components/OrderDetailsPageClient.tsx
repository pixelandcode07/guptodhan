'use client';

import React, { useCallback, useEffect, useState } from 'react';
import api from '@/lib/axios';
import OrderDetailsView, {
  OrderDetailsData,
} from '@/components/OrderManagement/OrderDetailsView';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import OrderDetailsSkeleton from './OrderDetailsSkeleton';

type ApiOrder = {
  _id: string;
  orderId?: string;
  orderStatus?: string;
  paymentStatus?: string;
  totalAmount?: number;
  deliveryCharge?: number;
  deliveryMethodId?: string;
  trackingId?: string;
  parcelId?: string;
  shippingName?: string;
  shippingPhone?: string;
  shippingEmail?: string;
  userId?:
    | {
        _id?: string;
        name?: string;
        email?: string;
        phoneNumber?: string;
      }
    | string;
  storeId?:
    | {
        _id?: string;
        storeName?: string;
      }
    | string;
};

function mapApiOrderToDetails(order: ApiOrder): OrderDetailsData {
  const user =
    typeof order.userId === 'object' && order.userId !== null ? order.userId : undefined;
  const store =
    typeof order.storeId === 'object' && order.storeId !== null ? order.storeId : undefined;

  return {
    id: order._id,
    orderNo: order.orderId || order._id,
    name: order.shippingName || user?.name || 'Customer',
    phone: order.shippingPhone || user?.phoneNumber || 'N/A',
    email: order.shippingEmail || user?.email,
    total: typeof order.totalAmount === 'number' ? order.totalAmount : 0,
    deliveryCharge: order.deliveryCharge,
    payment: order.paymentStatus || 'Pending',
    status: order.orderStatus || 'Pending',
    deliveryMethod: order.deliveryMethodId || 'COD',
    trackingId: order.trackingId,
    parcelId: order.parcelId,
    customer: {
      name: user?.name,
      email: user?.email,
      phone: user?.phoneNumber,
    },
    store: {
      name: store?.storeName,
      id: store?._id,
    },
  };
}

export default function OrderDetailsPageClient({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<OrderDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  const fetchOrder = useCallback(async () => {
    const userLike = (session?.user ?? {}) as { id?: string; _id?: string };
    const userId = userLike._id || userLike.id;
    const token = (session as { accessToken?: string } | null)?.accessToken;
    const userRole = (session?.user as { role?: string } | undefined)?.role;

    try {
      setLoading(true);
      setError(null);

      if (!userId) {
        throw new Error('User session not found. Please sign in again.');
      }

      const headers: Record<string, string> = { 'x-user-id': userId };
      if (userRole) {
        headers['x-user-role'] = userRole;
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const res = await api.get(`/product-order/${orderId}`, { headers });
      const data = (res.data?.data ?? null) as ApiOrder | null;

      if (!data) {
        setOrder(null);
        setError('Order not found.');
        return;
      }

      setOrder(mapApiOrderToDetails(data));
    } catch (err) {
      console.error('Failed to load order', err);
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Failed to load order details.';
      setError(message);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  }, [orderId, session]);

  useEffect(() => {
    if (status === 'loading') return;
    fetchOrder();
  }, [fetchOrder, status]);

  const handleOrderUpdate = (updates: Partial<OrderDetailsData>) => {
    setOrder((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  if (loading) {
    return <OrderDetailsSkeleton />;
  }

  if (error || !order) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div>
          <p className="text-lg font-semibold text-red-600">Unable to load order</p>
          <p className="text-sm text-gray-500">{error || 'Order not found.'}</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/general/view/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-6">
      <div className="flex items-center justify-between">
        <Button asChild variant="ghost" size="sm" className="-ml-2 text-blue-600 hover:text-blue-700">
          <Link href="/general/view/orders">← Back to Orders</Link>
        </Button>
        <div className="text-sm font-mono text-gray-500">Order #{order.orderNo}</div>
      </div>

      <OrderDetailsView
        order={order}
        backHref="/general/view/orders"
        onOrderUpdate={handleOrderUpdate}
      />
    </div>
  );
}

