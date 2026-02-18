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
import { generateInvoice, OrderInvoiceData } from './utils/invoiceGenerator';
import Link from 'next/link';
import Image from 'next/image';

export interface OrderDetailsData {
  id: string;
  orderNo: string;
  name: string;
  phone: string;
  email?: string;
  address?: string; 
  total: number;
  deliveryCharge: number;
  payment: string;
  status: string;
  deliveryMethod?: string;
  trackingId?: string;
  parcelId?: string;
  customer?: { name?: string; email?: string; phone?: string; };
  store?: { name?: string; id?: string; };
  items: Array<{
    id: string;
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

  useEffect(() => {
    setOrderStatus(order.status);
    setTrackingId(order.trackingId || '');
    setParcelId(order.parcelId || '');
  }, [order]);

  const isShipped = useMemo(() => orderStatus === 'Shipped' || orderStatus === 'Delivered', [orderStatus]);
  const isCOD = useMemo(() => order.deliveryMethod?.toLowerCase() === 'cod' || order.deliveryMethod?.toLowerCase() === 'standard', [order.deliveryMethod]);
  const canShip = useMemo(() => orderStatus === 'Processing' || orderStatus === 'Pending', [orderStatus]);

  const handleStatusUpdate = async () => {
    try {
      setLoading(true);
      const updateData = { orderStatus, trackingId, parcelId };
      await api.patch(`/product-order/${order.id}`, updateData);
      toast.success('Order status updated!');
      onOrderUpdate?.({ status: orderStatus, trackingId, parcelId });
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  // ✅ ৪০০ এরর ফিক্স: এখন সরাসরি 'orderId' পাঠানো হচ্ছে
  const handleCreateSteadfastShipment = async () => {
    try {
      setLoading(true);
      toast.loading('Syncing with Steadfast & Sending SMS...');
      
      const response = await api.post('/product-order/steadfast', { 
        orderId: order.id // সরাসরি রুট প্রপার্টিতে orderId পাঠানো হচ্ছে
      });

      if (response.data.success) {
        const updatedOrder = response.data.data;
        setParcelId(updatedOrder.parcelId);
        setTrackingId(updatedOrder.trackingId);
        setOrderStatus('Shipped');
        toast.dismiss();
        toast.success('Shipment created & Customer notified via SMS!');
        onOrderUpdate?.({ parcelId: updatedOrder.parcelId, trackingId: updatedOrder.trackingId, status: 'Shipped' });
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.response?.data?.message || 'Shipment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {headerContent}
      {/* অর্ডার ডিটেইলস কার্ড */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-bold">Order Details - #{order.orderNo}</h2>
          <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${order.payment.toLowerCase().includes('paid') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {order.payment}
          </span>
        </div>
        <div className="grid gap-6 p-4 md:grid-cols-2">
          <div><Label className="text-[10px] font-bold text-gray-400">CUSTOMER INFO</Label><p className="font-bold">{order.name}</p><p className="text-sm">{order.phone}</p><p className="text-xs text-gray-500">{order.address}</p></div>
          <div className="md:text-right"><Label className="text-[10px] font-bold text-gray-400">BILLING</Label><p className="text-2xl font-black text-green-600">৳{order.total.toLocaleString()}</p></div>
        </div>
      </div>

      {/* প্রোডাক্ট লিস্ট টেবিল */}
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center gap-2"><ShoppingBag className="h-4 w-4" /><h3 className="text-sm font-bold">Items</h3></div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] uppercase font-black border-b"><tr><th className="px-4 py-3">Item</th><th className="px-4 py-3">Qty</th><th className="px-4 py-3 text-right">Total</th></tr></thead>
            <tbody className="divide-y text-sm">
              {order.items?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><div className="relative h-10 w-10 overflow-hidden rounded border"><Image src={item.thumbnailImage || '/img/placeholder.png'} alt="p" fill className="object-cover" /></div><span className="font-bold text-xs">{item.productTitle}</span></div></td>
                  <td className="px-4 py-3 text-center">{item.quantity}</td>
                  <td className="px-4 py-3 text-right font-bold">৳{item.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* অ্যাকশন বাটন */}
      <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-1"><Label className="text-xs font-bold">Status</Label><Select value={orderStatus} onValueChange={setOrderStatus}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
          <div className="space-y-1"><Label className="text-xs font-bold text-gray-400">Tracking Code (Auto)</Label><Input value={trackingId} readOnly className="bg-gray-50 text-xs" /></div>
          <div className="space-y-1"><Label className="text-xs font-bold text-gray-400">Parcel ID (Auto)</Label><Input value={parcelId} readOnly className="bg-gray-50 text-xs" /></div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 border-t pt-4">
          <Button onClick={handleStatusUpdate} disabled={loading} size="sm" className="bg-blue-600 font-bold"><CheckCircle2 className="mr-2 h-4 w-4" /> Save</Button>
          <Button onClick={() => generateInvoice(order as OrderInvoiceData)} variant="outline" size="sm" className="font-bold"><Download className="mr-2 h-4 w-4" /> Invoice</Button>
          {canShip && isCOD && (
            <Button onClick={handleCreateSteadfastShipment} disabled={loading || !!parcelId} size="sm" variant="secondary" className="font-bold bg-orange-100 text-orange-700">
              <Package className="mr-2 h-4 w-4" /> {parcelId ? 'Shipment Processed' : 'Create Steadfast'}
            </Button>
          )}
          {backHref && <Button asChild variant="ghost" size="sm" className="ml-auto"><Link href={backHref} className="font-bold"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link></Button>}
        </div>
      </div>
    </div>
  );
}