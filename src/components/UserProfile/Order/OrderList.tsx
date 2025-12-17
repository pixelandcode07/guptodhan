'use client';

import React, { useState } from 'react';
import type { OrderStatus, OrderSummary } from './types';
import OrderItemCard from './OrderItemCard';
import ReturnRequestModal from './ReturnRequestModal'; // ✅ মোডাল ইম্পোর্ট

interface OrderListProps {
  orders: OrderSummary[];
  filter: OrderStatus;
  onRefresh?: () => void; // ✅ প্যারেন্ট থেকে রিফ্রেশ ফাংশন
}

export default function OrderList({ orders, filter, onRefresh }: OrderListProps) {
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  // ফিল্টার লজিক
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  // বাটন ক্লিকের হ্যান্ডলার
  const handleReturnClick = (orderId: string) => { // এখানে ডাটাবেসের _id বা orderId যেটা API চায় সেটা পাস করবেন
    setSelectedOrderId(orderId); 
    setIsReturnModalOpen(true);
  };

  const handleReturnSuccess = () => {
    if (onRefresh) onRefresh();
  };

  return (
    <div className="space-y-4">
      {filtered.map((order) => (
        <OrderItemCard 
          key={order.id} 
          order={order} 
          onReturnClick={() => handleReturnClick(order.id)} // ✅ কার্ডে ফাংশন পাঠানো হলো
        />
      ))}

      {/* ✅ রিটার্ন মোডাল (লিস্টের বাইরে রেন্ডার হবে) */}
      {selectedOrderId && (
        <ReturnRequestModal 
          isOpen={isReturnModalOpen}
          onClose={() => setIsReturnModalOpen(false)}
          orderId={selectedOrderId}
          onSuccess={handleReturnSuccess}
        />
      )}
    </div>
  );
}