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

// ✅ টাইপ মিসম্যাচ এরর ফিক্স করতে ইন্টারফেস আপডেট
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
  // ✅ প্রোডাক্ট লিস্ট ভিউর জন্য নতুন প্রপার্টি
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
  const [notes, setNotes] = useState('');

  useEffect(() => {
    setOrderStatus(order.status);
    setTrackingId(order.trackingId || '');
    setParcelId(order.parcelId || '');
  }, [order]);

  const isShipped = useMemo(() => orderStatus === 'Shipped' || orderStatus === 'Delivered', [orderStatus]);
  const isCOD = useMemo(() => order.deliveryMethod?.toLowerCase() === 'cod' || order.deliveryMethod?.toLowerCase() === 'standard', [order.deliveryMethod]);
  const canShip = useMemo(() => orderStatus === 'Processing' || orderStatus === 'Pending', [orderStatus]);

  // ১. সাধারণ স্ট্যাটাস আপডেট লজিক
  const handleStatusUpdate = async () => {
    try {
      setLoading(true);
      const updateData = { orderStatus, trackingId: trackingId || undefined, parcelId: parcelId || undefined };
      await api.patch(`/product-order/${order.id}`, updateData);
      toast.success('Order updated successfully!');
      onOrderUpdate?.({ status: orderStatus, trackingId, parcelId });
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  // ✅ ২. সলভড Steadfast Shipment লজিক (Payload Mismatch ফিক্সড)
  const handleCreateSteadfastShipment = async () => {
    try {
      setLoading(true);
      toast.loading('Syncing with Steadfast & Sending Guptodhan SMS...');
      
      // ব্যাকএন্ড রুট অনুযায়ী সরাসরি orderId পাঠানো হচ্ছে
      const response = await api.post('/product-order/steadfast', { 
        orderId: order.id 
      });

      if (response.data.success) {
        const updatedData = response.data.data;
        setParcelId(updatedData.parcelId);
        setTrackingId(updatedData.trackingId);
        setOrderStatus('Shipped');
        toast.dismiss();
        toast.success('Shipment created and Customer notified via SMS!');
        
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

  // ৩. ইনভয়েস ডাউনলোড (টাইপ ফিক্সসহ)
  const handleInvoiceDownload = async () => {
    try {
      toast.loading('Generating Professional Invoice...');
      await generateInvoice(order as OrderInvoiceData);
      toast.dismiss();
      toast.success('Invoice Ready!');
    } catch (error) {
      toast.dismiss();
      toast.error('Invoice failed');
    }
  };

  return (
    <div className="space-y-6">
      {headerContent}

      {/* কাস্টমার ও শিপিং সামারি কার্ড */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-gray-200 px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Order Details</h2>
            <p className="text-xs font-mono text-slate-500 mt-0.5">Invoice No: {order.orderNo}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${order.payment.toLowerCase().includes('paid') ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
              Payment: {order.payment}
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-wider">
              {order.deliveryMethod || 'Standard'}
            </span>
          </div>
        </div>
        
        <div className="grid gap-8 p-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-[10px] uppercase text-slate-400 font-black tracking-widest">Recipient Info</Label>
            <p className="text-base font-bold text-slate-900">{order.name}</p>
            <p className="text-sm font-medium text-slate-600">{order.phone}</p>
            <div className="flex gap-2 mt-2">
              <div className="text-xs text-slate-500 bg-slate-50 p-2 rounded-md border border-slate-100 flex-1 italic leading-relaxed">
                <strong>Address:</strong> {order.address || 'Address not provided'}
              </div>
            </div>
          </div>
          <div className="space-y-2 md:text-right">
            <Label className="text-[10px] uppercase text-slate-400 font-black tracking-widest">Billing Summary</Label>
            <p className="text-3xl font-black text-blue-600">৳{order.total.toLocaleString()}</p>
            <p className="text-sm text-slate-500 font-medium">Delivery Charge: ৳{order.deliveryCharge}</p>
            <p className="text-xs text-slate-400 mt-1">Status: <span className="font-bold text-slate-700">{orderStatus}</span></p>
          </div>
        </div>
      </div>

      {/* ✅ প্রফেশনাল প্রোডাক্ট টেবিল */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="bg-slate-50 border-b border-gray-200 px-5 py-3 flex items-center gap-2">
          <ShoppingBag className="h-4 w-4 text-slate-600" />
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Ordered Products</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest border-b">
              <tr>
                <th className="px-6 py-4">Item Detail</th>
                <th className="px-6 py-4">Variant</th>
                <th className="px-6 py-4 text-center">Quantity</th>
                <th className="px-6 py-4 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-14 w-14 rounded-lg border border-slate-200 overflow-hidden flex-shrink-0 shadow-sm bg-white">
                        <Image 
                          src={item.thumbnailImage || '/img/placeholder.png'} 
                          alt={item.productTitle} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                      <div className="max-w-[240px]">
                        <p className="font-bold text-slate-800 text-xs line-clamp-2 leading-snug">{item.productTitle}</p>
                        <p className="text-[10px] text-slate-400 mt-1 font-mono">ID: {item.id.slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {item.size && item.size !== '—' ? <span className="bg-slate-100 px-2 py-0.5 rounded text-[9px] font-bold text-slate-600 uppercase border border-slate-200">Size: {item.size}</span> : null}
                      {item.color && item.color !== '—' ? <span className="bg-slate-100 px-2 py-0.5 rounded text-[9px] font-bold text-slate-600 uppercase border border-slate-200">Color: {item.color}</span> : null}
                      {!item.size && !item.color && <span className="text-[10px] text-slate-400">N/A</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-black">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="font-black text-slate-900 text-sm">৳{item.totalPrice.toLocaleString()}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">৳{item.unitPrice.toLocaleString()} / unit</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ম্যানেজমেন্ট এবং শিপিং সেকশন */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 mb-5 border-b border-slate-100 pb-3">
          <Truck className="h-4 w-4 text-slate-400" />
          <h3 className="text-xs font-black uppercase text-slate-500 tracking-tighter">Logistics & Status Control</h3>
        </div>
        
        <div className="grid gap-5 md:grid-cols-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-slate-400">Set Order Status</Label>
            <Select value={orderStatus} onValueChange={setOrderStatus}>
              <SelectTrigger className="h-10 text-xs font-bold ring-offset-white focus:ring-blue-500"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
             <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter">Tracking Code (Auto-Gen)</Label>
             <Input className="h-10 text-xs bg-slate-50 font-mono focus:ring-0 cursor-default" value={trackingId} readOnly placeholder="Await Shipment" />
          </div>
          <div className="space-y-1.5">
             <Label className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter">Parcel ID (System)</Label>
             <Input className="h-10 text-xs bg-slate-50 font-mono focus:ring-0 cursor-default" value={parcelId} readOnly placeholder="Await Shipment" />
          </div>
        </div>
        
        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-slate-50 pt-5">
          <Button onClick={handleStatusUpdate} disabled={loading} size="sm" className="bg-slate-900 hover:bg-black text-white font-bold px-6 h-10 shadow-md">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Save Status
          </Button>
          
          <Button onClick={handleInvoiceDownload} variant="outline" size="sm" className="font-bold border-slate-300 h-10 px-6">
            <Download className="mr-2 h-4 w-4" /> Print Invoice
          </Button>
          
          {/* ✅ Steadfast বাটন (Best Practice: শিপমেন্ট হয়ে গেলে ডিজেবল থাকবে) */}
          {canShip && isCOD && (
            <Button 
              onClick={handleCreateSteadfastShipment} 
              disabled={loading || !!parcelId} 
              size="sm" 
              className="font-bold bg-orange-600 hover:bg-orange-700 text-white h-10 px-6 shadow-md shadow-orange-100"
            >
              <Package className="mr-2 h-4 w-4" /> 
              {parcelId ? 'Shipment Synced' : 'Create Steadfast Entry'}
            </Button>
          )}
          
          {backHref && (
            <Button asChild variant="ghost" size="sm" className="ml-auto font-bold text-slate-500 hover:text-slate-800">
              <Link href={backHref} className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" /> Return to List
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}