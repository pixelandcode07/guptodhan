import React from 'react'
import type { OrderStatus } from './types'

const statusToStyle: Record<OrderStatus, string> = {
  all: 'bg-gray-100 text-gray-700',
  to_pay: 'bg-orange-100 text-orange-700',
  to_ship: 'bg-blue-100 text-blue-700',
  to_receive: 'bg-purple-100 text-purple-700',
  to_review: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-rose-100 text-rose-700',
  delivered: 'bg-emerald-100 text-emerald-700',
}

export default function OrderStatusBadge({ status, className }: { status: OrderStatus, className?: string }) {
  const label =
    status === 'to_pay' ? 'To Pay' :
    status === 'to_ship' ? 'To Ship' :
    status === 'to_receive' ? 'To Receive' :
    status === 'to_review' ? 'To Review' :
    status === 'cancelled' ? 'Cancelled' :
    status === 'delivered' ? 'Delivered' : 'All'

  return (
    <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${statusToStyle[status]} ${className ?? ''}`}>{label}</span>
  )
}


