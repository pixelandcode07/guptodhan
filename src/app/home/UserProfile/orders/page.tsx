"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import OrderList from '@/components/UserProfile/Order/OrderList'
import OrderFilters from '@/components/UserProfile/Order/OrderFilters'
import type { OrderStatus, OrderSummary } from '@/components/UserProfile/Order/types'

function mapOrderStatusToUI(status: string): OrderStatus {
  const s = status.toLowerCase()
  if (s === 'delivered') return 'delivered'
  if (s === 'cancelled' || s === 'canceled') return 'cancelled'
  if (s === 'shipped') return 'to_receive'
  if (s === 'processing') return 'to_ship'
  return 'to_pay'
}

type ApiOrder = {
  _id: string
  orderId: string
  storeName?: string
  storeVerified?: boolean
  orderStatus?: string
  orderDate?: string
  createdAt?: string
  totalAmount?: number
  orderDetails?: unknown[]
  shippingName?: string
  trackingId?: string
  steadfastInvoice?: string
}

export default function UserOrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<OrderStatus>('all')
  const { data: session } = useSession()

  const fetchUserOrders = useCallback(async () => {
    try {
      setLoading(true)
      const userLike = (session?.user ?? {}) as { id?: string; _id?: string }
      const userId = userLike.id || userLike._id || '507f1f77bcf86cd799439011' // fallback for testing
      
      if (!userId) {
        setLoading(false)
        return
      }

      const response = await api.get(`/product-order/user/${userId}`)
      const apiOrders = (response.data?.data ?? []) as ApiOrder[]
      
      const mappedOrders: OrderSummary[] = apiOrders.map((order) => ({
        id: order._id,
        storeName: order.storeName || 'Store',
        storeVerified: !!order.storeVerified,
        status: mapOrderStatusToUI(order.orderStatus || 'Pending'),
        createdAt: new Date(order.orderDate ?? order.createdAt ?? Date.now()).toLocaleString(),
        items: [
          {
            id: order._id,
            title: order.shippingName || `Order #${order.orderId}`,
            thumbnailUrl: '/img/product/p-1.png',
            priceFormatted: `৳ ${(order.totalAmount || 0).toLocaleString('en-US')}`,
            quantity: Array.isArray(order.orderDetails) ? order.orderDetails.length : 1,
          },
        ],
      }))
      
      setOrders(mappedOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    fetchUserOrders()
  }, [fetchUserOrders])

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold px-4 mt-1 mb-4">My Orders</h1>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-md p-4">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold px-4 mt-1 mb-4">My Orders</h1>
      
      <div className="px-4 mb-4">
        <OrderFilters value={filter} onChange={setFilter} />
      </div>
      
      <div className="px-4">
        <OrderList orders={orders} filter={filter} />
      </div>
      
      {orders.length === 0 && (
        <div className="px-4 py-8 text-center text-gray-500">
          <p>No orders found.</p>
        </div>
      )}
    </div>
  )
}