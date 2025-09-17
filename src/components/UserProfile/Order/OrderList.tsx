import React from 'react'
import type { OrderStatus, OrderSummary } from './types'
import OrderItemCard from './OrderItemCard'

export default function OrderList({ orders, filter }: { orders: OrderSummary[], filter: OrderStatus }) {
  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter)
  return (
    <div className="space-y-4">
      {filtered.map(o => (
        <OrderItemCard key={o.id} order={o} />
      ))}
    </div>
  )
}


