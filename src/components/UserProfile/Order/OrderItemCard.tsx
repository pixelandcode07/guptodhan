import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle, Package, ExternalLink } from 'lucide-react'
import type { OrderSummary } from './types'
import OrderStatusBadge from './OrderStatusBadge'

export default function OrderItemCard({ order }: { order: OrderSummary }) {
  const firstItem = order.items[0]
  const totalItems = order.items.length
  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0)
  
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
        <div className="shrink-0 relative">
          <Image 
            src={firstItem?.thumbnailUrl || '/img/product/p-1.png'} 
            alt={firstItem?.title || 'Product'} 
            width={72} 
            height={72} 
            className="rounded" 
          />
          {totalItems > 1 && (
            <div className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              +{totalItems - 1}
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium leading-5">
            {firstItem?.title || 'Product'}
            {totalItems > 1 && (
              <span className="text-xs text-gray-500 ml-2">+ {totalItems - 1} more item{totalItems - 1 > 1 ? 's' : ''}</span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Size: {firstItem?.size ?? '—'}, Color: {firstItem?.color ?? '—'}
          </div>
          <div className="text-sm text-blue-600 font-semibold mt-1">
            {firstItem?.priceFormatted || '৳ 0'}
          </div>
          <div className="text-xs text-gray-500">
            {totalItems > 1 ? `Total Qty: ${totalQuantity}` : `Qty ${firstItem?.quantity || 1}`}
          </div>
          
          {/* Steadfast tracking information */}
          {(order.deliveryMethod === 'steadfast' || order.deliveryMethod === 'Steadfast COD') && order.trackingId && (
            <div className="mt-2 flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 text-xs">
                <Package className="h-3 w-3 text-blue-600" />
                <span className="text-gray-600">Tracking:</span>
                <p className="m-0 font-mono select-text text-blue-700 bg-blue-50 px-2 py-[2px] rounded">
                  {order.trackingId}
                </p>
              </div>
              <Link
                href={`/home/product/tracking?trackingId=${encodeURIComponent(order.trackingId as string)}`}
                className="inline-flex items-center gap-1 text-xs text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded"
              >
                Track Order
                <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}


