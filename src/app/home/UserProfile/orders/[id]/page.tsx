"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import { CheckCircle } from 'lucide-react'
import type { OrderStatus, OrderSummary } from '@/components/UserProfile/Order/types'
import OrderStatusBadge from '@/components/UserProfile/Order/OrderStatusBadge'

type PageProps = { params: { id: string } }

function mapOrderStatusToUI(status: string): OrderStatus {
  const s = status.toLowerCase()
  if (s === 'delivered') return 'delivered'
  if (s === 'cancelled' || s === 'canceled') return 'cancelled'
  if (s === 'shipped') return 'to_receive'
  if (s === 'processing') return 'to_ship'
  return 'to_pay'
}

function formatCurrency(amount: number | undefined): string {
  if (typeof amount !== 'number') return '৳ 0'
  return `৳ ${amount.toLocaleString('en-US')}`
}

type ApiOrder = {
  _id: string
  storeName?: string
  storeVerified?: boolean
  orderStatus?: string
  orderDate?: string
  createdAt?: string
  totalAmount?: number
  orderDetails?: unknown[]
  shippingName?: string
}

export default function OrderDetailsPage({ params }: PageProps) {
  const [order, setOrder] = React.useState<OrderSummary | null>(null)
  const item = order?.items?.[0]
  const { data: session } = useSession()
  type ProfileUser = { name?: string; address?: string; phone?: string }
  const user = (session?.user ?? {}) as ProfileUser
  const userName = user.name ?? 'Guest User'
  const userAddress = user.address ?? 'Banasree, C block, Main road, Bangladesh'
  const userPhone = user.phone ?? '—'

  React.useEffect(() => {
    const userLike = (session?.user ?? {}) as { id?: string; _id?: string }
    const userId = userLike.id || userLike._id
    if (!userId || !params.id) return
    api
      .get(`/product-order/${userId}`)
      .then((res) => {
        const list = (res.data?.data ?? []) as ApiOrder[]
        const found = list.find((o) => String(o._id) === params.id)
        if (!found) return
        const mapped: OrderSummary = {
          id: found._id,
          storeName: found.storeName || 'Store',
          storeVerified: !!found.storeVerified,
          status: mapOrderStatusToUI(found.orderStatus || 'Pending'),
          createdAt: new Date(found.orderDate ?? found.createdAt ?? Date.now()).toLocaleString(),
          items: [
            {
              id: 'item_1',
              title: found.shippingName || 'Order',
              thumbnailUrl: '/img/product/p-1.png',
              priceFormatted: formatCurrency(found.totalAmount),
              quantity: Array.isArray(found.orderDetails) ? found.orderDetails.length : 1,
            },
          ],
        }
        setOrder(mapped)
      })
      .catch(() => setOrder(null))
  }, [session, params.id])

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold px-4 mt-1 mb-4">Order Details</h1>

      <div className="bg-white border rounded-md">
        {/* Header row: store + status */}
        <div className="flex items-center justify-between px-4 py-2 border-b bg-gray-50">
          <div className="text-sm font-medium flex items-center gap-2">
            <span>{order?.storeName ?? 'Store'}</span>
            {order?.storeVerified && (
              <span className="text-blue-600 text-xs inline-flex items-center gap-1">
                Verified Seller
                <CheckCircle className="h-3 w-3" />
              </span>
            )}
          </div>
          <OrderStatusBadge status={(order?.status ?? 'to_pay') as OrderStatus} />
        </div>

        {/* Product summary row */}
        <div className="p-4 flex items-start gap-4">
          <Image src={item?.thumbnailUrl ?? '/img/product/p-1.png'} alt={item?.title ?? 'Product'} width={88} height={88} className="rounded" />
          <div className="flex-1 text-sm">
            <div className="font-medium leading-5">{item?.title ?? 'Order'}</div>
            <div className="text-gray-600">Size: {item?.size ?? '—'}, Color: {item?.color ?? '—'}</div>
            <div className="text-blue-600 font-semibold">{item?.priceFormatted ?? '৳ 0'}</div>
            <div className="text-xs text-gray-500">Qty {item?.quantity ?? 1}</div>
          </div>
          {order?.status === 'delivered' && (
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
              <div className="text-xs text-gray-700">Order {order?.id ?? ''}</div>
              <div className="text-xs text-gray-500">Placed on {order?.createdAt ?? ''}</div>
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
                <span className="text-gray-600">Total Items ({item?.quantity ?? 1})</span>
                <span className="text-blue-600">{item?.priceFormatted ?? '৳ 0'}</span>
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
                <span className="text-blue-600">{item?.priceFormatted ?? '৳ 0'}</span>
              </div>
              {order?.status === 'delivered' && (
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


