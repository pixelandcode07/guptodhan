"use client"

import React from 'react'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import type { OrderStatus, OrderSummary } from '@/components/UserProfile/Order/types'
import OrderFilters from '@/components/UserProfile/Order/OrderFilters'
import OrderList from '@/components/UserProfile/Order/OrderList'

function mapOrderStatusToUI(status: string): OrderStatus {
  const s = status.toLowerCase()
  if (s === 'delivered') return 'delivered'
  if (s === 'cancelled' || s === 'canceled') return 'cancelled'
  if (s === 'shipped') return 'to_receive'
  if (s === 'processing') return 'to_ship'
  // default pending -> to_pay
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

export default function OrdersPage() {
  const { data: session } = useSession()
  const [filter, setFilter] = React.useState<OrderStatus>('all')
  const [orders, setOrders] = React.useState<OrderSummary[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    const userLike = session?.user as { id?: string; _id?: string } | undefined
    const userId = userLike?.id || userLike?._id
    if (!userId) return
    setLoading(true)
    api
      .get(`/product-order/${userId}`)
      .then((res) => {
        const list = (res.data?.data ?? []) as ApiOrder[]
        const mapped: OrderSummary[] = list.map((o) => ({
          id: o._id,
          storeName: o.storeName || 'Store',
          storeVerified: !!o.storeVerified,
          status: mapOrderStatusToUI(o.orderStatus || 'Pending'),
          createdAt: new Date(o.orderDate ?? o.createdAt ?? Date.now()).toLocaleString(),
          items: [
            {
              id: 'item_1',
              title: o.shippingName || 'Order',
              thumbnailUrl: '/img/product/p-1.png',
              priceFormatted: formatCurrency(o.totalAmount),
              quantity: Array.isArray(o.orderDetails) ? o.orderDetails.length : 1,
            },
          ],
        }))
        setOrders(mapped)
      })
      .catch(() => {
        setOrders([])
      })
      .finally(() => setLoading(false))
  }, [session])

  const counts = React.useMemo(() => {
    return orders.reduce<Record<OrderStatus, number>>((acc, o) => {
      acc['all'] = (acc['all'] ?? 0) + 1
      acc[o.status] = (acc[o.status] ?? 0) + 1
      return acc
    }, { all: 0 } as Record<OrderStatus, number>)
  }, [orders])

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold px-4 mt-1 mb-4">My Order</h1>
      <OrderFilters value={filter} onChange={setFilter} counts={counts} />
      <OrderList orders={orders} filter={filter} />
      {loading && <div className="px-4 text-sm text-gray-500 mt-2">Loading orders…</div>}
    </div>
  )
}
