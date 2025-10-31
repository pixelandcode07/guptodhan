"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import OrderList from '@/components/UserProfile/Order/OrderList'
import OrderFilters from '@/components/UserProfile/Order/OrderFilters'
import type { OrderStatus, OrderSummary } from '@/components/UserProfile/Order/types'
import FancyLoadingPage from '@/app/general/loading'

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
  storeId?: {
    storeName?: string
  }
  storeName?: string
  storeVerified?: boolean
  orderStatus?: string
  paymentStatus?: string
  deliveryMethodId?: string
  orderDate?: string
  createdAt?: string
  totalAmount?: number
  orderDetails?: Array<{
    _id: string
    productId?: {
      _id: string
      productTitle?: string
      thumbnailImage?: string
      productPrice?: number
      discountPrice?: number
    }
    quantity?: number
    unitPrice?: number
    totalPrice?: number
  }>
  shippingName?: string
  trackingId?: string
  parcelId?: string
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
      const userLike = (session?.user ?? {}) as { id?: string; _id?: string; role?: string }
      const userId = userLike._id || userLike.id
      const token = (session as { accessToken?: string })?.accessToken
      const userRole = userLike.role
      
      if (!userId) {
        console.error('No user ID found in session')
        setOrders([])
        return
      }

      const response = await api.get(`/product-order/my-orders`, {
        headers: {
          'x-user-id': userId,
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { 'x-user-role': userRole } : {}),
        }
      })
      const apiOrders = (response.data?.data ?? []) as ApiOrder[]
      
      const mappedOrders: OrderSummary[] = apiOrders.map((order) => {
        // Get the first product from order details
        const firstProduct = order.orderDetails?.[0]?.productId
        const productImage = firstProduct?.thumbnailImage || '/img/product/p-1.png'
        const productName = firstProduct?.productTitle || order.shippingName || `Order #${order.orderId}`
        const productPrice = firstProduct?.productPrice || order.totalAmount || 0
        const totalQuantity = order.orderDetails?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 1
        
        return {
          id: order._id,
          orderId: order.orderId,
          storeName: order.storeId?.storeName || order.storeName || 'Store',
          storeVerified: !!order.storeVerified,
          status: mapOrderStatusToUI(order.orderStatus || 'Pending'),
          paymentStatus: order.paymentStatus || 'Pending',
          deliveryMethod: order.deliveryMethodId || 'COD',
          createdAt: new Date(order.orderDate ?? order.createdAt ?? Date.now()).toLocaleString(),
          trackingId: order.trackingId,
          parcelId: order.parcelId,
          items: [
            {
              id: order._id,
              title: productName,
              thumbnailUrl: productImage,
              priceFormatted: `৳ ${productPrice.toLocaleString('en-US')}`,
              quantity: totalQuantity,
            },
          ],
        }
      })
      
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
    return <FancyLoadingPage />;
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
      
      {orders.length === 0 && !loading && (
        <div className="px-4 py-8 text-center text-gray-500">
          <p>No orders found.</p>
        </div>
      )}
    </div>
  )
}