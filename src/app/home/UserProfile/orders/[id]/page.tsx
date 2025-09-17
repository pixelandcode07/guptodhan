"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { CheckCircle } from 'lucide-react'
import type { OrderStatus, OrderSummary } from '@/components/UserProfile/Order/types'
import OrderStatusBadge from '@/components/UserProfile/Order/OrderStatusBadge'

type PageProps = { params: { id: string } }

const demoOrders: OrderSummary[] = [
  {
    id: 'o_1',
    storeName: 'TechStore Pro',
    storeVerified: true,
    status: 'cancelled',
    createdAt: '2025-03-23 14:52:59',
    items: [
      {
        id: 'i_1',
        title: 'Braun Silk-épil 9 Cordless Epilator',
        thumbnailUrl: '/img/product/p-1.png',
        priceFormatted: '৳ 7,200',
        size: 'XL',
        color: 'Green',
        quantity: 1,
      },
    ],
  },
  {
    id: 'o_2',
    storeName: 'TechStore Pro',
    storeVerified: true,
    status: 'delivered',
    createdAt: '2025-03-23 14:52:59',
    items: [
      {
        id: 'i_2',
        title: 'Braun Silk-épil 9 Cordless Epilator',
        thumbnailUrl: '/img/product/p-2.png',
        priceFormatted: '৳ 7,200',
        size: 'XL',
        color: 'Green',
        quantity: 1,
      },
    ],
  },
]

export default function OrderDetailsPage({ params }: PageProps) {
  const order = React.useMemo(() => demoOrders.find(o => o.id === params.id) ?? demoOrders[0], [params.id])
  const item = order.items[0]
  const { data: session } = useSession()
  const user = session?.user as (typeof session extends undefined ? undefined : (Record<string, any> & { name?: string }))
  const userName = user?.name ?? 'Guest User'
  const userAddress = (user as any)?.address ?? 'Banasree, C block, Main road, Bangladesh'
  const userPhone = (user as any)?.phone ?? '—'

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold px-4 mt-1 mb-4">Order Details</h1>

      <div className="bg-white border rounded-md">
        {/* Header row: store + status */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
          <div className="text-sm font-medium flex items-center gap-2">
            <span>{order.storeName}</span>
            {order.storeVerified && (
              <span className="text-blue-600 text-xs inline-flex items-center gap-1">
                Verified Seller
                <CheckCircle className="h-3 w-3" />
              </span>
            )}
          </div>
          <OrderStatusBadge status={order.status as OrderStatus} />
        </div>

        {/* Product summary row */}
        <div className="p-4 flex items-start gap-4">
          <Image src={item.thumbnailUrl} alt={item.title} width={88} height={88} className="rounded" />
          <div className="flex-1 text-sm">
            <div className="font-medium leading-5">{item.title}</div>
            <div className="text-gray-600">Size: {item.size ?? '—'}, Color: {item.color ?? '—'}</div>
            <div className="text-blue-600 font-semibold">{item.priceFormatted}</div>
            <div className="text-xs text-gray-500">Qty {item.quantity}</div>
          </div>
          {order.status === 'delivered' && (
            <Link href="#" className="text-xs text-blue-600 font-medium underline-offset-4 hover:underline">
              WRITE A REVIEW
            </Link>
          )}
        </div>

        {/* Meta + totals grid */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Order meta and address */}
          <div className="border-t md:border-t-0 md:border-r">
            <div className="px-4 py-3 bg-gray-50 border-t md:border-t-0"> 
              <div className="text-xs text-gray-700">Order {order.id.replace('o_', '')}</div>
              <div className="text-xs text-gray-500">Placed on {order.createdAt}</div>
            </div>
            <div className="px-4 py-3 text-sm">
              <div className="font-medium mb-1">{userName}</div>
              <div className="text-gray-600">{userAddress}</div>
              <div className="text-gray-600">{userPhone}</div>
            </div>
          </div>

          {/* Right: Totals */}
          <div className="border-t md:border-t-0">
            <div className="px-4 py-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Items (02)</span>
                <span className="text-blue-600">৳ 7,200</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Discount</span>
                <span className="text-blue-600">৳ 200</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Shipping:</span>
                <span className="text-blue-600">FREE</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="font-medium">Total:</span>
                <span className="text-blue-600">৳ 7,200</span>
              </div>
              {order.status === 'delivered' && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Paid by Cash on Delivery</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


