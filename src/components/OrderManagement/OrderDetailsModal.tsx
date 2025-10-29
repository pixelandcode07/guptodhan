'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Eye, Truck, CheckCircle2, Package, MapPin } from 'lucide-react';
import api from '@/lib/axios';

interface OrderDetailsModalProps {
  order: {
    id: string;
    orderNo: string;
    name: string;
    phone: string;
    email?: string;
    total: number;
    payment: string;
    status: string;
    deliveryMethod?: string;
    trackingId?: string;
    parcelId?: string;
    customer?: {
      name: string;
      email: string;
      phone: string;
    };
    store?: {
      name: string;
      id: string;
    };
  };
  onStatusUpdate?: () => void;
}

export default function OrderDetailsModal({ order, onStatusUpdate }: OrderDetailsModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState(order.status);
  const [trackingId, setTrackingId] = useState(order.trackingId || '');
  const [parcelId, setParcelId] = useState(order.parcelId || '');
  const [notes, setNotes] = useState('');

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
      setOpen(false);
      onStatusUpdate?.();
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
      
      // Create Steadfast shipment
      const shipmentData = {
        orderDetails: {
          recipient_name: order.name,
          recipient_phone: order.phone,
          recipient_address: 'Customer Address', // You might want to get this from order details
          amount_to_collect: order.total,
          item_quantity: 1,
          item_weight: 0.5,
          item_description: `Order #${order.orderNo}`,
        }
      };

      const response = await api.post('/product-order/steadfast', shipmentData);
      
      if (response.data.success) {
        const { parcelId: newParcelId, trackingId: newTrackingId } = response.data.data;
        setParcelId(newParcelId);
        setTrackingId(newTrackingId);
        setOrderStatus('Shipped');
        
        toast.success('Steadfast shipment created successfully!');
      }
    } catch (error) {
      console.error('Error creating Steadfast shipment:', error);
      toast.error('Failed to create Steadfast shipment');
    } finally {
      setLoading(false);
    }
  };

  const isCOD = order.deliveryMethod?.toLowerCase() === 'cod';
  const canShip = orderStatus === 'Processing' || orderStatus === 'Pending';
  const isShipped = orderStatus === 'Shipped' || orderStatus === 'Delivered';

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-1.5 rounded bg-blue-500/10 text-blue-600 hover:bg-blue-500/20" title="Order details">
          <Eye size={14} />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Order Details - {order.orderNo}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Order Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Order Number</Label>
              <p className="font-mono text-sm">{order.orderNo}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Total Amount</Label>
              <p className="font-semibold text-green-600">৳{order.total.toLocaleString()}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Payment Status</Label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                order.payment.toLowerCase().includes('paid') ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}>
                {order.payment}
              </span>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Delivery Method</Label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                isCOD ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"
              }`}>
                {order.deliveryMethod || 'COD'}
              </span>
            </div>
          </div>

          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">Name</Label>
                <p className="text-sm">{order.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Phone</Label>
                <p className="text-sm font-mono">{order.phone}</p>
              </div>
              {order.email && (
                <div className="col-span-2">
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-sm">{order.email}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Management */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Order Management
            </h3>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Order Status</Label>
                <Select value={orderStatus} onValueChange={setOrderStatus}>
                  <SelectTrigger>
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
                <>
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
                </>
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
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
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
            
            <Button
              onClick={handleStatusUpdate}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4" />
              Update Status
            </Button>
            
            <Button variant="outline" onClick={() => setOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
