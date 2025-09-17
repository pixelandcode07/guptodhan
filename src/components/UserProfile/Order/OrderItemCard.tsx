import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import type { OrderSummary } from './types'
import OrderStatusBadge from './OrderStatusBadge'

export default function OrderItemCard({ order }: { order: OrderSummary }) {
  const item = order.items[0]
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
        <div className="text-sm font-medium flex items-center gap-2">
          <span>{order.storeName}</span>
          {order.storeVerified && (
            <span className="text-blue-600 text-xs inline-flex items-center gap-1">
              Verified Seller
              <CheckCircle className="h-3 w-3" />
            </span>
          )}
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      <Link href={`/home/UserProfile/orders/${order.id}`} className="flex gap-4 p-4 items-start hover:bg-gray-50 transition-colors">
        <div className="shrink-0">
          <Image src={item.thumbnailUrl} alt={item.title} width={72} height={72} className="rounded" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium leading-5">{item.title}</div>
          <div className="text-xs text-gray-500">Size: {item.size ?? '—'}, Color: {item.color ?? '—'}</div>
          <div className="text-sm text-blue-600 font-semibold mt-1">{item.priceFormatted}</div>
          <div className="text-xs text-gray-500">Qty {item.quantity}</div>
        </div>
      </Link>
    </div>
  )
}


