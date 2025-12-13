'use client';

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Package } from 'lucide-react';
import OrderDetailsView, { OrderDetailsData } from './OrderDetailsView';

interface OrderDetailsModalProps {
  order: OrderDetailsData;
  onStatusUpdate?: () => void;
}

export default function OrderDetailsModal({ order, onStatusUpdate }: OrderDetailsModalProps) {
  const [open, setOpen] = useState(false);

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
        <OrderDetailsView
          order={order}
          onOrderUpdate={(updates) => {
            void updates;
            onStatusUpdate?.();
          }}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
