'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  store?: {
    name?: string;
    id?: string;
  };
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

  // ১. স্ট্যাটাস আপডেট
  const handleStatusUpdate = async () => {
    try {
      setLoading(true);
      const updateData = { orderStatus, trackingId: trackingId || undefined, parcelId: parcelId || undefined };
      await api.patch(`/product-order/${order.id}`, updateData);
      toast.success('Order status updated!');
      onOrderUpdate?.({ status: orderStatus, trackingId, parcelId });
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  // ২. Steadfast Shipment (Automated)
  const handleCreateSteadfastShipment = async () => {
    try {
      setLoading(true);
      toast.loading('Syncing with Steadfast...');
      
      const response = await api.post('/product-order/steadfast', { 
        orderId: order.id 
      });

      if (response.data.success) {
        const updatedData = response.data.data;
        setParcelId(updatedData.parcelId);
        setTrackingId(updatedData.trackingId);
        setOrderStatus('Shipped');
        toast.dismiss();
        toast.success('Shipment created successfully!');
        
        onOrderUpdate?.({
          parcelId: updatedData.parcelId,
          trackingId: updatedData.trackingId,
          status: 'Shipped',
        });
      }
    } catch (error: any) {
      toast.dismiss();
      const msg = error.response?.data?.message || 'Shipment process failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // ৩. ইনভয়েস ডাউনলোড
  const handleInvoiceDownload = async () => {
    try {
      toast.loading('Downloading Invoice...');
      await generateInvoice(order as OrderInvoiceData);
      toast.dismiss();
      toast.success('Done!');
    } catch (error) {
      toast.dismiss();
      toast.error('Invoice generation failed');
    }
  };

  return (
    <div className="space-y-6">
      {headerContent}

      {/* কাস্টমার ইনফো কার্ড */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-gray-200 px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Order Details</h2>
            <p className="text-xs font-mono text-slate-500 mt-0.5">#{order.orderNo}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${order.payment.toLowerCase().includes('paid') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              {order.payment}
            </span>
          </div>
        </div>
        
        <div className="grid gap-8 p-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase text-slate-400 font-black tracking-widest">Shipping To</Label>
            <p className="text-base font-bold text-slate-900">{order.name}</p>
            <p className="text-sm font-medium text-slate-600">{order.phone}</p>
            <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-md border border-slate-100 italic leading-relaxed">
              {order.address || 'No address provided'}
            </div>
          </div>
          <div className="space-y-2 md:text-right">
            <Label className="text-[10px] uppercase text-slate-400 font-black tracking-widest">Total Amount</Label>
            <p className="text-3xl font-black text-blue-600">৳{order.total.toLocaleString()}</p>
            <p className="text-sm text-slate-500 font-medium">Delivery: ৳{order.deliveryCharge}</p>
          </div>
        </div>
      </div>

      {/* প্রোডাক্ট টেবিল (Smart Rendering) */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-gray-200 px-5 py-3 flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Ordered Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Spec</th>
                <th className="px-6 py-4 text-center">Qty</th>
                <th className="px-6 py-4 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-lg border border-slate-200 overflow-hidden flex-shrink-0 bg-white">
                        <Image src={item.thumbnailImage || '/img/placeholder.png'} alt={item.productTitle} fill className="object-cover" />
                      </div>
                      <p className="font-bold text-slate-800 text-xs line-clamp-2 max-w-[200px]">{item.productTitle}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {item.size && item.size !== '—' && (
                        <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-600 border border-slate-200">Size: {item.size}</span>
                      )}
                      {item.color && item.color !== '—' && (
                        <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-bold text-slate-600 border border-slate-200">Color: {item.color}</span>
                      )}
                      {!item.size && !item.color && <span className="text-[10px] text-slate-400 italic">Standard</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-slate-700">{item.quantity}</td>
                  <td className="px-6 py-4 text-right font-black text-slate-900">৳{item.totalPrice.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* অ্যাকশন সেকশন */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-slate-400">Status</Label>
            <Select value={orderStatus} onValueChange={setOrderStatus}>
              <SelectTrigger className="h-10 text-xs font-bold"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
             <Label className="text-[10px] font-bold uppercase text-slate-400">Tracking Code</Label>
             <Input className="h-10 text-xs bg-slate-50 font-mono" value={trackingId} readOnly placeholder="N/A" />
          </div>
          <div className="space-y-1.5">
             <Label className="text-[10px] font-bold uppercase text-slate-400">Parcel ID</Label>
             <Input className="h-10 text-xs bg-slate-50 font-mono" value={parcelId} readOnly placeholder="N/A" />
          </div>
        </div>
        
        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-slate-50 pt-5">
          <Button onClick={handleStatusUpdate} disabled={loading} size="sm" className="bg-slate-900 text-white font-bold h-10 px-6">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Save
          </Button>
          
          <Button onClick={handleInvoiceDownload} variant="outline" size="sm" className="font-bold border-slate-300 h-10 px-6">
            <Download className="mr-2 h-4 w-4" /> Invoice
          </Button>
          
          {canShip && isCOD && (
            <Button 
              onClick={handleCreateSteadfastShipment} 
              disabled={loading || !!parcelId} 
              size="sm" 
              className="font-bold bg-orange-600 hover:bg-orange-700 text-white h-10 px-6"
            >
              <Package className="mr-2 h-4 w-4" /> 
              {parcelId ? 'Shipment Ready' : 'Create Steadfast'}
            </Button>
          )}
          
          {backHref && (
            <Button asChild variant="ghost" size="sm" className="ml-auto font-bold text-slate-500">
              <Link href={backHref} className="flex items-center"><ArrowLeft className="mr-2 h-4 w-4" /> Back</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}