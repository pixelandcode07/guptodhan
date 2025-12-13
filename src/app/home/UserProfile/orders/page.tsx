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

      const response = await api.get(`/product-order?userId=${userId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(userRole ? { 'x-user-role': userRole } : {}),
        }
      })
      const apiOrders = (response.data?.data ?? []) as ApiOrder[]
      
      // Debug: log first order to see structure
      if (apiOrders.length > 0) {
        console.log('First order from API:', JSON.stringify(apiOrders[0], null, 2))
        if (apiOrders[0].orderDetails && apiOrders[0].orderDetails.length > 0) {
          console.log('First orderDetail:', JSON.stringify(apiOrders[0].orderDetails[0], null, 2))
          console.log('productId type:', typeof apiOrders[0].orderDetails[0].productId)
          console.log('productId value:', apiOrders[0].orderDetails[0].productId)
        }
      }
      
      const mappedOrders: OrderSummary[] = apiOrders.map((order) => {
        // Map all order items from orderDetails
        const items = (order.orderDetails || []).map((detail, index) => {
          // Check if productId is populated (object with product data) or just an ID
          let product: { productTitle?: string; thumbnailImage?: string; photoGallery?: string[] | string; productPrice?: number; _id?: string } | null = null
          
          if (detail.productId) {
            // Check if productId is an object (populated) or a string/primitive (not populated)
            if (typeof detail.productId === 'object' && detail.productId !== null) {
              const productObj = detail.productId as Record<string, unknown>
              
              // Check if it's populated by looking for product-specific fields
              // Populated objects will have productTitle, thumbnailImage, etc.
              // Non-populated ObjectIds will only have _id or be a plain object with just _id
              const hasProductFields = 'productTitle' in productObj || 
                                       'thumbnailImage' in productObj || 
                                       'photoGallery' in productObj ||
                                       'productPrice' in productObj
              
              if (hasProductFields) {
                // It's populated - use it
                product = productObj as { productTitle?: string; thumbnailImage?: string; photoGallery?: string[] | string; productPrice?: number; _id?: string }
              } else {
                // Check if it's just an ObjectId wrapper (only has _id)
                const keys = Object.keys(productObj)
                if (keys.length === 1 && keys[0] === '_id') {
                  // It's just an ObjectId, not populated
                  product = null
                } else if (keys.length === 0) {
                  // Empty object
                  product = null
                } else {
                  // Has other fields but not product fields - might be populated differently
                  // Log for debugging
                  console.warn('Unexpected productId structure:', productObj)
                  product = null
                }
              }
            } else if (typeof detail.productId === 'string') {
              // productId is just a string ID, not populated
              product = null
            }
          }
          
          // Debug for first item
          if (index === 0) {
            console.log(`OrderDetail ${index}:`, detail)
            console.log(`productId type:`, typeof detail.productId)
            console.log(`productId value:`, detail.productId)
            console.log(`Extracted product:`, product)
            if (product) {
              console.log(`  - productTitle:`, product.productTitle)
              console.log(`  - thumbnailImage:`, product.thumbnailImage)
              console.log(`  - photoGallery:`, product.photoGallery)
            }
          }
          
          // Get product image - check populated product object first
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
          
          // Get product name - use populated product title if available
          const productName = product?.productTitle || order.shippingName || `Product ${index + 1}`
          
          // Get price - prefer orderDetails unitPrice, fallback to product price
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
        
        // If no items, create a fallback item
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
  }, [session])

  useEffect(() => {
    fetchUserOrders()
  }, [fetchUserOrders])

  if (loading) {
    return <OrdersSkeleton />;
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