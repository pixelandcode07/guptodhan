'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Truck, CheckCircle2, Package, Download, ArrowLeft } from 'lucide-react';
import api from '@/lib/axios';
import { generateInvoice } from './utils/invoiceGenerator';
import Link from 'next/link';

export interface OrderDetailsData {
  id: string;
  orderNo: string;
  name: string;
  phone: string;
  email?: string;
  total: number;
  deliveryCharge?: number;
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
  const canShip = useMemo(
    () => orderStatus === 'Processing' || orderStatus === 'Pending',
    [orderStatus]
  );
  const isShipped = useMemo(
    () => orderStatus === 'Shipped' || orderStatus === 'Delivered',
    [orderStatus]
  );

  const handleStatusUpdate = async () => {
    try {
      setLoading(true);

      const updateData = {
        orderStatus: orderStatus,
        trackingId: trackingId || undefined,
        parcelId: parcelId || undefined,
      };

      await api.patch(`/product-order/${order.id}`, updateData);

      toast.success('Order status updated successfully!');
      onOrderUpdate?.({
        status: orderStatus,
        trackingId: trackingId || undefined,
        parcelId: parcelId || undefined,
      });
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSteadfastShipment = async () => {
    try {
      setLoading(true);

      const shipmentData = {
        orderDetails: {
          recipient_name: order.name,
          recipient_phone: order.phone,
          recipient_address: 'Customer Address',
          amount_to_collect: order.total,
          item_quantity: 1,
          item_weight: 0.5,
          item_description: `Order #${order.orderNo}`,
        },
      };

      const response = await api.post('/product-order/steadfast', shipmentData);

      if (response.data.success) {
        const { parcelId: newParcelId, trackingId: newTrackingId } = response.data.data || {};
        setParcelId(newParcelId || '');
        setTrackingId(newTrackingId || '');
        setOrderStatus('Shipped');

        toast.success('Steadfast shipment created successfully!');
        onOrderUpdate?.({
          parcelId: newParcelId,
          trackingId: newTrackingId,
          status: 'Shipped',
        });
      }
    } catch (error) {
      console.error('Error creating Steadfast shipment:', error);
      toast.error('Failed to create Steadfast shipment');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    try {
      generateInvoice({
        id: order.id,
        orderNo: order.orderNo,
        name: order.name,
        phone: order.phone,
        email: order.email,
        total: order.total,
        deliveryCharge: order.deliveryCharge,
        payment: order.payment,
        status: orderStatus,
        deliveryMethod: order.deliveryMethod,
        trackingId: trackingId || order.trackingId,
        parcelId: parcelId || order.parcelId,
        customer: order.customer,
        store: order.store,
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
      toast.error('Failed to generate invoice');
    }
  };

  return (
    <div className="space-y-6">
      {headerContent}

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-4 py-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Order Details</h2>
              <p className="text-sm text-gray-500 font-mono">Order #{order.orderNo}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="font-medium">Payment:</span>
              <span
                className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${
                  order.payment.toLowerCase().includes('paid')
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {order.payment}
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 px-4 py-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Customer</Label>
              <p className="text-sm font-medium">{order.name}</p>
              <p className="text-sm font-mono text-gray-600">{order.phone}</p>
              {order.email && <p className="text-sm text-gray-600">{order.email}</p>}
            </div>
            {order.store?.name && (
              <div>
                <Label className="text-sm font-medium text-gray-600">Store</Label>
                <p className="text-sm">{order.store.name}</p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Total Amount</Label>
              <p className="text-xl font-semibold text-green-600">
                ৳{order.total.toLocaleString('en-US')}
              </p>
              {typeof order.deliveryCharge === 'number' && (
                <p className="text-xs text-gray-500">
                  Delivery Charge: ৳{order.deliveryCharge.toLocaleString('en-US')}
                </p>
              )}
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Delivery Method</Label>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  isCOD ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                }`}
              >
                {order.deliveryMethod || 'COD'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-4 py-3 flex items-center gap-2">
          <Truck className="h-4 w-4 text-gray-500" />
          <h3 className="text-base font-semibold">Order Management</h3>
        </div>

        <div className="space-y-4 px-4 py-6">
          <div>
            <Label htmlFor="status">Order Status</Label>
            <Select value={orderStatus} onValueChange={setOrderStatus}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Processing">Processing</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isShipped && (
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="trackingId">Tracking ID</Label>
                <Input
                  id="trackingId"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Enter tracking ID"
                />
              </div>
              <div>
                <Label htmlFor="parcelId">Parcel ID</Label>
                <Input
                  id="parcelId"
                  value={parcelId}
                  onChange={(e) => setParcelId(e.target.value)}
                  placeholder="Enter parcel ID"
                />
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add any notes about this order"
              rows={3}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 px-4 py-4 border-t border-gray-200">
          <Button
            onClick={handleDownloadInvoice}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Invoice
          </Button>

          {canShip && isCOD && (
            <Button
              onClick={handleCreateSteadfastShipment}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <Truck className="h-4 w-4" />
              Create Steadfast Shipment
            </Button>
          )}

          <Button onClick={handleStatusUpdate} disabled={loading} className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Update Status
          </Button>

          {backHref && !onClose && (
            <Button asChild variant="outline" className="ml-auto">
              <Link href={backHref} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
          )}

          {onClose && (
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

