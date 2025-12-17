"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import api from '@/lib/axios'
import OrderList from '@/components/UserProfile/Order/OrderList'
import OrderFilters from '@/components/UserProfile/Order/OrderFilters'
import type { OrderStatus, OrderSummary } from '@/components/UserProfile/Order/types'
import OrdersSkeleton from '@/components/UserProfile/Order/OrdersSkeleton'

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
      photoGallery?: string[]
    }
    quantity?: number
    unitPrice?: number
    totalPrice?: number
    size?: string
    color?: string
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
  
  // ✅ FIX 1: Get status from useSession
  const { data: session, status } = useSession()

  const fetchUserOrders = useCallback(async () => {
    // ✅ FIX 2: Don't run logic if session is loading or unauthenticated
    if (status === 'loading') return
    
    if (status === 'unauthenticated') {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const userLike = (session?.user ?? {}) as { id?: string; _id?: string; role?: string }
      const userId = userLike._id || userLike.id
      const token = (session as { accessToken?: string })?.accessToken
      const userRole = userLike.role
      
      // Now this check is safe because we ensured status is 'authenticated'
      if (!userId) {
        // Only log error if authenticated but missing ID (data integrity issue)
        console.error('Authenticated but no user ID found in session')
        setOrders([])
        setLoading(false)
        return
      }

      const response = await api.get(`/product-order?userId=${userId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { 'x-user-role': userRole } : {}),
        }
      })
      const apiOrders = (response.data?.data ?? []) as ApiOrder[]
      
      const mappedOrders: OrderSummary[] = apiOrders.map((order) => {
        const items = (order.orderDetails || []).map((detail, index) => {
          let product: { productTitle?: string; thumbnailImage?: string; photoGallery?: string[] | string; productPrice?: number; _id?: string } | null = null
          
          if (detail.productId) {
            if (typeof detail.productId === 'object' && detail.productId !== null) {
              const productObj = detail.productId as Record<string, unknown>
              const hasProductFields = 'productTitle' in productObj || 
                                       'thumbnailImage' in productObj || 
                                       'photoGallery' in productObj ||
                                       'productPrice' in productObj
              
              if (hasProductFields) {
                product = productObj as { productTitle?: string; thumbnailImage?: string; photoGallery?: string[] | string; productPrice?: number; _id?: string }
              } else {
                product = null
              }
            } else if (typeof detail.productId === 'string') {
              product = null
            }
          }
          
          let productImage = '/img/product/p-1.png'
          if (product) {
            if (product.thumbnailImage) {
              productImage = product.thumbnailImage
            } else if (product.photoGallery) {
              const gallery = Array.isArray(product.photoGallery) ? product.photoGallery : [product.photoGallery]
              if (gallery.length > 0 && gallery[0]) {
                productImage = gallery[0]
              }
            }
          }
          
          const productName = product?.productTitle || order.shippingName || `Product ${index + 1}`
          const productPrice = detail.unitPrice || product?.productPrice || 0
          
          return {
            id: detail._id || `${order._id}_${index}`,
            title: productName,
            thumbnailUrl: productImage,
            priceFormatted: `৳ ${productPrice.toLocaleString('en-US')}`,
            quantity: detail.quantity || 1,
            size: detail.size || 'Standard',
            color: detail.color || 'Default',
          }
        })
        
        const orderItems = items.length > 0 ? items : [{
          id: order._id,
          title: `Order #${order.orderId}`,
          thumbnailUrl: '/img/product/p-1.png',
          priceFormatted: `৳ ${(order.totalAmount || 0).toLocaleString('en-US')}`,
          quantity: 1,
          size: 'Standard',
          color: 'Default',
        }]
        
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
          items: orderItems,
        }
      })
      
      setOrders(mappedOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }, [session, status])

  // ✅ FIX 3: Update useEffect to depend on status
  useEffect(() => {
    if (status === 'authenticated') {
      fetchUserOrders()
    } else if (status === 'unauthenticated') {
      setLoading(false)
    }
  }, [status, fetchUserOrders])

  if (loading) {
    return <OrdersSkeleton />;
  }

  // Optional: Handle unauthenticated state UI
  if (status === 'unauthenticated') {
    return (
        <div className="p-6 text-center">
            <p>Please log in to view your orders.</p>
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
      
      {orders.length === 0 && !loading && (
        <div className="px-4 py-8 text-center text-gray-500">
          <p>No orders found.</p>
        </div>
      )}
    </div>
  )
}