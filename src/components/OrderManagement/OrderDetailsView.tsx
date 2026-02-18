'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Truck, CheckCircle2, Package, Download, ArrowLeft, ShoppingBag } from 'lucide-react';
import api from '@/lib/axios';
import { generateInvoice } from './utils/invoiceGenerator';
import Link from 'next/link';
import Image from 'next/image';

// ✅ ইন্টারফেস আপডেট করা হয়েছে 'items' সহ
export interface OrderDetailsData {
  id: string;
  orderNo: string;
  name: string;
  phone: string;
  email?: string;
  total: number;
  deliveryCharge: number;
  payment: string;
  status: string;
  deliveryMethod?: string;
  trackingId?: string;
  parcelId?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  store?: {
    name?: string;
    id?: string;
  };
  // ✅ এই অ্যারেটি প্রোডাক্ট দেখাবে
  items: Array<{
    id: string;
    productId: string;
    productTitle: string;
    thumbnailImage: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    size?: string;
    color?: string;
  }>;
}

interface OrderDetailsViewProps {
  order: OrderDetailsData;
  onOrderUpdate?: (updates: Partial<OrderDetailsData>) => void;
  onClose?: () => void;
  backHref?: string;
  headerContent?: React.ReactNode;
}

export default function OrderDetailsView({
  order,
  onOrderUpdate,
  onClose,
  backHref,
  headerContent,
}: OrderDetailsViewProps) {
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(order.status);
  const [trackingId, setTrackingId] = useState(order.trackingId || '');
  const [parcelId, setParcelId] = useState(order.parcelId || '');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setOrderStatus(order.status);
    setTrackingId(order.trackingId || '');
    setParcelId(order.parcelId || '');
  }, [order]);

  const isCOD = useMemo(() => order.deliveryMethod?.toLowerCase() === 'cod', [order.deliveryMethod]);
  const isShipped = useMemo(() => orderStatus === 'Shipped' || orderStatus === 'Delivered', [orderStatus]);

  const handleStatusUpdate = async () => {
    try {
      setLoading(true);
      const updateData = { orderStatus, trackingId: trackingId || undefined, parcelId: parcelId || undefined };
      await api.patch(`/product-order/${order.id}`, updateData);
      toast.success('Order status updated successfully!');
      onOrderUpdate?.({ status: orderStatus, trackingId, parcelId });
    } catch (error) {
      toast.error('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    try {
      generateInvoice(order);
      toast.success('Invoice generation started...');
    } catch (error) {
      toast.error('Failed to generate invoice');
    }
  };

  return (
    <div className="space-y-6">
      {headerContent}

      {/* ১. কাস্টমার ও অর্ডার বেসিক ইনফো */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex flex-wrap justify-between items-center gap-2">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Order Information</h2>
            <p className="text-xs font-mono text-gray-500">Order ID: {order.orderNo}</p>
          </div>
          <div className="flex gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.payment.toLowerCase().includes('paid') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              Payment: {order.payment}
            </span>
          </div>
        </div>
        
        <div className="grid gap-6 p-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-xs uppercase text-gray-400 font-bold">Shipping Details</Label>
            <p className="text-sm font-bold">{order.name}</p>
            <p className="text-sm text-gray-600">{order.phone}</p>
            {order.email && <p className="text-sm text-gray-600">{order.email}</p>}
          </div>
          <div className="space-y-2">
            <Label className="text-xs uppercase text-gray-400 font-bold">Order Summary</Label>
            <p className="text-xl font-black text-blue-600">৳{order.total.toLocaleString()}</p>
            <p className="text-xs text-gray-500 font-medium">Delivery Charge: ৳{order.deliveryCharge}</p>
            <p className="text-xs text-gray-500 font-medium font-mono">Method: {order.deliveryMethod}</p>
          </div>
        </div>
      </div>

      {/* ✅ ২. প্রোডাক্ট লিস্ট টেবিল (নতুন যোগ করা হয়েছে) */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-gray-600" />
          <h3 className="text-base font-bold text-gray-800">Ordered Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-bold">
              <tr>
                <th className="px-4 py-3 border-b">Product</th>
                <th className="px-4 py-3 border-b">Variant</th>
                <th className="px-4 py-3 border-b text-center">Qty</th>
                <th className="px-4 py-3 border-b text-right">Unit Price</th>
                <th className="px-4 py-3 border-b text-right">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {order.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded border border-gray-200">
                        <Image
                          src={item.thumbnailImage || '/img/placeholder.png'}
                          alt={item.productTitle}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="font-bold text-gray-800 line-clamp-2 max-w-[200px]">
                        {item.productTitle}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs space-y-1">
                      {item.size && <p><span className="text-gray-400">Size:</span> {item.size}</p>}
                      {item.color && <p><span className="text-gray-400">Color:</span> {item.color}</p>}
                      {!item.size && !item.color && <span className="text-gray-400">N/A</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center font-medium">{item.quantity}</td>
                  <td className="px-4 py-3 text-right text-gray-600">৳{item.unitPrice.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900">৳{item.totalPrice.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ৩. অর্ডার ম্যানেজমেন্ট (স্ট্যাটাস আপডেট) */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-4 py-3 flex items-center gap-2">
          <Truck className="h-4 w-4 text-gray-500" />
          <h3 className="text-base font-bold">Action & Management</h3>
        </div>

        <div className="space-y-4 px-4 py-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status" className="font-bold">Change Order Status</Label>
              <Select value={orderStatus} onValueChange={setOrderStatus}>
                <SelectTrigger id="status"><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Shipped">Shipped</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isShipped && (
            <div className="grid gap-4 md:grid-cols-2">
              <div><Label htmlFor="trackingId">Tracking ID</Label><Input id="trackingId" value={trackingId} onChange={(e) => setTrackingId(e.target.value)} /></div>
              <div><Label htmlFor="parcelId">Parcel ID</Label><Input id="parcelId" value={parcelId} onChange={(e) => setParcelId(e.target.value)} /></div>
            </div>
          )}

          <div><Label htmlFor="notes">Admin Notes</Label><Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} /></div>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-4 py-4 border-t border-gray-200 bg-gray-50/50">
          <Button onClick={handleDownloadInvoice} variant="outline" size="sm" className="gap-2 font-bold"><Download className="h-4 w-4" /> Invoice</Button>
          <Button onClick={handleStatusUpdate} disabled={loading} size="sm" className="gap-2 font-bold bg-blue-600 hover:bg-blue-700"><CheckCircle2 className="h-4 w-4" /> Save Changes</Button>
          {backHref && <Button asChild variant="ghost" size="sm" className="ml-auto font-bold"><Link href={backHref} className="gap-2"><ArrowLeft className="h-4 w-4" /> Back</Link></Button>}
        </div>
      </div>
    </div>
  );
}