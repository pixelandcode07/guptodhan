'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Truck,
  Loader2,
  CheckCircle2,
  CircleX,
  Clock,
  ShoppingBag,
  Store,
  Tag,
} from 'lucide-react';

// ================================================================
// Types — service এর exact response অনুযায়ী
// ================================================================
interface ProductId {
  _id: string;
  productTitle?: string;
  thumbnailImage?: string;
  productPrice?: number;
  discountPrice?: number;
  productSlug?: string;
}

interface OrderDetail {
  _id: string;
  orderDetailsId: string;
  productId: ProductId | string;
  quantity: number;
  unitPrice: number;
  discountPrice?: number;
  totalPrice: number;
  size?: string;
  color?: string;
}

interface UserId {
  _id?: string;
  name?: string;
  email?: string;
  phoneNumber?: string;
}

interface StoreId {
  _id?: string;
  storeName?: string;
}

interface CouponId {
  _id?: string;
  code?: string;
  value?: number;
}

interface OrderData {
  _id: string;
  orderId: string;
  userId?: UserId;
  storeId?: StoreId;
  deliveryMethodId?: string;
  paymentMethod?: string;
  shippingName: string;
  shippingPhone: string;
  shippingEmail?: string;
  shippingStreetAddress?: string;
  shippingCity?: string;
  shippingDistrict?: string;
  shippingPostalCode?: string;
  shippingCountry?: string;
  addressDetails?: string;
  deliveryCharge?: number;
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  orderDate?: string;
  createdAt: string;
  trackingId?: string;
  parcelId?: string;
  transactionId?: string;
  couponId?: CouponId;
  orderDetails: OrderDetail[];
}

// ================================================================
// Status Config
// ================================================================
const statusConfig: Record<string, { color: string; icon: React.ReactNode }> =
  {
    Pending: {
      color: 'bg-amber-100 text-amber-700 border-amber-200',
      icon: <Clock size={14} />,
    },
    Processing: {
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      icon: <Package size={14} />,
    },
    Shipped: {
      color: 'bg-purple-100 text-purple-700 border-purple-200',
      icon: <Truck size={14} />,
    },
    Delivered: {
      color: 'bg-green-100 text-green-700 border-green-200',
      icon: <CheckCircle2 size={14} />,
    },
    Cancelled: {
      color: 'bg-red-100 text-red-700 border-red-200',
      icon: <CircleX size={14} />,
    },
  };

// ================================================================
// Main Component
// ================================================================
export default function VendorOrderDetailsClient({
  order,
}: {
  order: OrderData;
}) {
  const [loading, setLoading] = useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = useState(order.orderStatus);

  const updateStatus = async (newStatus: string) => {
    try {
      setLoading(newStatus);
      const res = await axios.patch(`/api/v1/product-order/${order._id}`, {
        orderStatus: newStatus,
      });
      if (res.data.success) {
        setCurrentStatus(newStatus);
        toast.success(`Status updated to ${newStatus}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(null);
    }
  };

  const status = statusConfig[currentStatus] || statusConfig['Pending'];
  const subtotal = order.orderDetails.reduce(
    (sum, item) => sum + (item.totalPrice ?? 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-32">
      <div className="max-w-5xl mx-auto space-y-5">

        {/* ===== Header ===== */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/vendor/orders"
              className="p-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all shadow-sm"
            >
              <ArrowLeft size={16} className="text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Order Details
              </h1>
              <p className="text-sm text-blue-600 font-mono mt-0.5">
                {order.orderId}
              </p>
            </div>
          </div>

          <Badge
            variant="outline"
            className={`${status.color} flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-xl`}
          >
            {status.icon}
            {currentStatus}
          </Badge>
        </div>

        {/* ===== Action Buttons ===== */}
        {currentStatus !== 'Delivered' && currentStatus !== 'Cancelled' && (
          <div className="flex flex-wrap items-center gap-2 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-sm font-medium text-gray-600 mr-1">
              Update Status:
            </span>

            {(currentStatus === 'Pending' ||
              currentStatus === 'Processing') && (
              <Button
                size="sm"
                onClick={() => updateStatus('Shipped')}
                disabled={!!loading}
                className="bg-teal-600 hover:bg-teal-700 text-white gap-1.5"
              >
                {loading === 'Shipped' ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Truck size={14} />
                )}
                Mark as Shipped
              </Button>
            )}

            {currentStatus === 'Shipped' && (
              <Button
                size="sm"
                onClick={() => updateStatus('Delivered')}
                disabled={!!loading}
                className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
              >
                {loading === 'Delivered' ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={14} />
                )}
                Mark as Delivered
              </Button>
            )}

            <Button
              size="sm"
              variant="destructive"
              onClick={() =>
                window.confirm('Cancel this order?') &&
                updateStatus('Cancelled')
              }
              disabled={!!loading}
              className="gap-1.5"
            >
              {loading === 'Cancelled' ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <CircleX size={14} />
              )}
              Cancel Order
            </Button>
          </div>
        )}

        {/* ===== Content Grid ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* ===== Left (2/3) ===== */}
          <div className="lg:col-span-2 space-y-5">

            {/* Order Items */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <ShoppingBag size={16} className="text-blue-600" />
                <h2 className="font-semibold text-gray-800">
                  Order Items ({order.orderDetails.length})
                </h2>
              </div>

              <div className="divide-y divide-gray-100">
                {order.orderDetails.map((item) => {
                  const product =
                    typeof item.productId === 'object'
                      ? (item.productId as ProductId)
                      : null;

                  return (
                    <div
                      key={item._id}
                      className="px-5 py-4 flex items-start justify-between gap-4"
                    >
                      <div className="flex items-start gap-3">
                        {/* Product Image */}
                        <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 shrink-0">
                          {product?.thumbnailImage ? (
                            <Image
                              src={product.thumbnailImage}
                              alt={product.productTitle || 'Product'}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package
                                size={18}
                                className="text-gray-400"
                              />
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {product?.productTitle || 'Product'}
                          </p>
                          <p className="text-xs text-gray-400 font-mono mt-0.5">
                            ID: {item.orderDetailsId}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            {item.size && item.size !== '—' && (
                              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                Size: {item.size}
                              </span>
                            )}
                            {item.color && item.color !== '—' && (
                              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                Color: {item.color}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-gray-900">
                          ৳{(item.totalPrice ?? 0).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.quantity} ×{' '}
                          ৳{(item.unitPrice ?? 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Price Summary */}
              <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Delivery Charge</span>
                  <span>
                    ৳{(order.deliveryCharge ?? 0).toLocaleString()}
                  </span>
                </div>
                {order.couponId?.code && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="flex items-center gap-1">
                      <Tag size={12} />
                      Coupon ({order.couponId.code})
                    </span>
                    <span>-৳{(order.couponId.value ?? 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-green-600">
                    ৳{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <MapPin size={16} className="text-blue-600" />
                <h2 className="font-semibold text-gray-800">
                  Shipping Address
                </h2>
              </div>
              <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoRow label="Name" value={order.shippingName} />
                <InfoRow label="Phone" value={order.shippingPhone} />
                <InfoRow
                  label="Email"
                  value={order.shippingEmail || 'N/A'}
                />
                <InfoRow
                  label="Address"
                  value={order.shippingStreetAddress || 'N/A'}
                />
                <InfoRow
                  label="City"
                  value={order.shippingCity || 'N/A'}
                />
                <InfoRow
                  label="District"
                  value={order.shippingDistrict || 'N/A'}
                />
                <InfoRow
                  label="Postal Code"
                  value={order.shippingPostalCode || 'N/A'}
                />
                <InfoRow
                  label="Country"
                  value={order.shippingCountry || 'Bangladesh'}
                />
                {order.addressDetails && (
                  <div className="sm:col-span-2">
                    <InfoRow
                      label="Address Details"
                      value={order.addressDetails}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ===== Right (1/3) ===== */}
          <div className="space-y-5">

            {/* Customer Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <User size={16} className="text-blue-600" />
                <h2 className="font-semibold text-gray-800">Customer</h2>
              </div>
              <div className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm shrink-0">
                    {(
                      order.userId?.name ||
                      order.shippingName ||
                      'G'
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      {order.userId?.name || order.shippingName || 'Guest'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.userId?.email || 'N/A'}
                    </p>
                    {order.userId?.phoneNumber && (
                      <p className="text-xs text-gray-400">
                        {order.userId.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Store Info */}
            {order.storeId?.storeName && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                  <Store size={16} className="text-blue-600" />
                  <h2 className="font-semibold text-gray-800">Store</h2>
                </div>
                <div className="px-5 py-4">
                  <p className="text-sm font-semibold text-gray-800">
                    {order.storeId.storeName}
                  </p>
                </div>
              </div>
            )}

            {/* Payment Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <CreditCard size={16} className="text-blue-600" />
                <h2 className="font-semibold text-gray-800">Payment</h2>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Status</span>
                  <Badge
                    variant="outline"
                    className={
                      order.paymentStatus === 'Paid'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-amber-100 text-amber-700 border-amber-200'
                    }
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Method</span>
                  <span className="text-sm font-medium text-gray-700">
                    {order.paymentMethod || 'N/A'}
                  </span>
                </div>
                {order.transactionId && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-400 mb-1">
                      Transaction ID
                    </p>
                    <p className="text-xs font-mono text-blue-600 break-all">
                      {order.transactionId}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                <Truck size={16} className="text-blue-600" />
                <h2 className="font-semibold text-gray-800">Delivery</h2>
              </div>
              <div className="px-5 py-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Method</span>
                  <span className="text-sm font-medium text-gray-700">
                    {order.deliveryMethodId || 'Standard'}
                  </span>
                </div>
                {order.trackingId ? (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Tracking ID</p>
                    <p className="text-xs font-mono text-blue-600 break-all">
                      {order.trackingId}
                    </p>
                  </div>
                ) : null}
                {order.parcelId ? (
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Parcel ID</p>
                    <p className="text-xs font-mono text-green-600 break-all">
                      {order.parcelId}
                    </p>
                  </div>
                ) : null}
                {!order.trackingId && !order.parcelId && (
                  <p className="text-sm text-gray-400 italic">
                    No tracking info yet
                  </p>
                )}
              </div>
            </div>

            {/* Order Meta */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-800">Order Info</h2>
              </div>
              <div className="px-5 py-4 space-y-3">
                <InfoRow label="Order ID" value={order.orderId} mono />
                <InfoRow
                  label="Placed On"
                  value={new Date(order.createdAt).toLocaleString('en-GB')}
                />
                {order.orderDate && (
                  <InfoRow
                    label="Order Date"
                    value={new Date(order.orderDate).toLocaleString('en-GB')}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ================================================================
// Helper
// ================================================================
function InfoRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] text-gray-400 uppercase tracking-wide">
        {label}
      </span>
      <span
        className={`text-sm text-gray-700 ${mono ? 'font-mono text-blue-600 text-xs' : 'font-medium'}`}
      >
        {value || 'N/A'}
      </span>
    </div>
  );
}