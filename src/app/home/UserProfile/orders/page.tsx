"use client"

import React from 'react'
import type { OrderStatus, OrderSummary } from '@/components/UserProfile/Order/types'
import OrderFilters from '@/components/UserProfile/Order/OrderFilters'
import OrderList from '@/components/UserProfile/Order/OrderList'

const demoOrders: OrderSummary[] = [
  {
    id: 'o_1',
    storeName: 'TechStore Pro',
    storeVerified: true,
    status: 'cancelled',
    createdAt: '2025-09-15',
    items: [
      {
        id: 'i_1',
        title: 'Braun Silk-épil 9 Cordless Epilator',
        thumbnailUrl: '/public/img/product/p-1.png'.replace('/public', ''),
        priceFormatted: '৳7,200',
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
    createdAt: '2025-09-12',
    items: [
      {
        id: 'i_2',
        title: 'Braun Silk-épil 9 Cordless Epilator',
        thumbnailUrl: '/public/img/product/p-2.png'.replace('/public', ''),
        priceFormatted: '৳7,200',
        size: 'XL',
        color: 'Green',
        quantity: 1,
      },
    ],
  },
  {
    id: 'o_3',
    storeName: 'TechStore Pro',
    storeVerified: true,
    status: 'cancelled',
    createdAt: '2025-09-10',
    items: [
      {
        id: 'i_3',
        title: 'Braun Silk-épil 9 Cordless Epilator',
        thumbnailUrl: '/public/img/product/p-3.png'.replace('/public', ''),
        priceFormatted: '৳7,200',
        size: 'XL',
        color: 'Green',
        quantity: 1,
      },
    ],
  },
]

export default function OrdersPage() {
  const [filter, setFilter] = React.useState<OrderStatus>('all')
  const counts = React.useMemo(() => {
    return demoOrders.reduce<Record<OrderStatus, number>>((acc, o) => {
      acc['all'] = (acc['all'] ?? 0) + 1
      acc[o.status] = (acc[o.status] ?? 0) + 1
      return acc
    }, { all: 0 } as Record<OrderStatus, number>)
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold px-4 mt-1 mb-4">My Order</h1>
      <OrderFilters value={filter} onChange={setFilter} counts={counts} />
      <OrderList orders={demoOrders} filter={filter} />
    </div>
  )
}
