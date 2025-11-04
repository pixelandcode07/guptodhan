"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useParams } from 'next/navigation'
import api from '@/lib/axios'
import { CheckCircle, Package, ExternalLink } from 'lucide-react'
import type { OrderStatus, OrderSummary, OrderItemSummary } from '@/components/UserProfile/Order/types'
import OrderStatusBadge from '@/components/UserProfile/Order/OrderStatusBadge'

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

type OrderWithDetails = OrderSummary & {
  subtotal?: number
  deliveryCharge?: number
  discount?: number
  totalAmount?: number
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
  deliveryCharge?: number
  shippingName?: string
  shippingPhone?: string
  shippingEmail?: string
  shippingStreetAddress?: string
  shippingCity?: string
  shippingDistrict?: string
  shippingPostalCode?: string
  shippingCountry?: string
  addressDetails?: string
  orderDetails?: Array<{
    _id: string
    orderDetailsId?: string
    productId?: {
      _id: string
      productTitle?: string
      thumbnailImage?: string
      photoGallery?: string[]
      productPrice?: number
      discountPrice?: number
    }
    quantity?: number
    unitPrice?: number
    discountPrice?: number
    totalPrice?: number
    size?: string
    color?: string
  }>
  trackingId?: string
  parcelId?: string
}

export default function OrderDetailsPage() {
  const [order, setOrder] = React.useState<OrderWithDetails | null>(null)
  const [orderData, setOrderData] = React.useState<ApiOrder | null>(null)
  const { data: session } = useSession()
  const params = useParams()
  const orderId = params?.id as string

  React.useEffect(() => {
    const fetchOrder = async () => {
      const userLike = (session?.user ?? {}) as { id?: string; _id?: string }
      const userId = userLike._id || userLike.id
      if (!userId || !orderId) return

      // Optional token like other routes
      const token = (session as { accessToken?: string })?.accessToken
      const headers: Record<string, string> = { 'x-user-id': userId }
      if (token) headers['Authorization'] = `Bearer ${token}`

      try {
        const res = await api.get(`/product-order/${orderId}`, { headers })
        const found = (res.data?.data ?? null) as ApiOrder | null
        if (!found) { 
          setOrder(null)
          setOrderData(null)
          return 
        }

        setOrderData(found)

        // Map all order items, not just the first one
        // Product data comes from orderDetails.productId (populated from VendorProductModel)
        // User data comes from order model (shippingName, etc.)
        const items = (found.orderDetails || []).map((detail, index) => {
          // Extract product from orderDetails.productId
          // productId should be an object when populated (contains product data like productTitle)
          const product = detail.productId && 
                         typeof detail.productId === 'object' && 
                         'productTitle' in detail.productId
            ? detail.productId as { productTitle?: string; thumbnailImage?: string; photoGallery?: string[] | string; productPrice?: number; _id?: string }
            : null
          
          // Get product image - check populated product object first
          let productImage = '/img/product/p-1.png'
          if (product?.thumbnailImage) {
            productImage = product.thumbnailImage
          } else if (product?.photoGallery) {
            const gallery = Array.isArray(product.photoGallery) ? product.photoGallery : [product.photoGallery]
            if (gallery.length > 0) {
              productImage = gallery[0]
            }
          }
          
          // Get product name - use populated product title if available
          const productName = product?.productTitle || found.shippingName || 'Product'
          
          // Get price from orderDetails or product
          const unitPrice = detail.unitPrice || (detail.totalPrice && detail.quantity ? detail.totalPrice / detail.quantity : 0) || product?.productPrice || 0
          
          // Calculate item subtotal from orderDetails
          const itemSubtotal = detail.totalPrice || (unitPrice * (detail.quantity || 1))

          return {
            id: detail._id || detail.orderDetailsId || `item_${index}`,
            title: productName,
            thumbnailUrl: productImage,
            priceFormatted: formatCurrency(unitPrice),
            quantity: detail.quantity || 1, // From orderDetails model
            size: detail.size || 'Standard', // From orderDetails if exists
            color: detail.color || 'Default', // From orderDetails if exists
            unitPrice, // Store actual price for calculations
            subtotal: itemSubtotal, // Store subtotal for display
          }
        })

        // Calculate totals from actual order data
        const subtotal = found.orderDetails?.reduce((sum, detail) => sum + (detail.totalPrice || 0), 0) || 0
        const deliveryCharge = found.deliveryCharge || 0
        const discount = subtotal + deliveryCharge - (found.totalAmount || 0)

        const mapped: OrderWithDetails = {
          id: found._id,
          orderId: found.orderId || found._id,
          storeName: found.storeId?.storeName || found.storeName || 'Store',
          storeVerified: !!found.storeVerified,
          status: mapOrderStatusToUI(found.orderStatus || 'Pending'),
          paymentStatus: found.paymentStatus || 'Pending',
          deliveryMethod: found.deliveryMethodId || 'COD',
          createdAt: new Date(found.orderDate ?? found.createdAt ?? Date.now()).toLocaleString(),
          trackingId: found.trackingId,
          parcelId: found.parcelId,
          items,
          subtotal,
          deliveryCharge,
          discount: discount > 0 ? discount : 0,
          totalAmount: found.totalAmount || 0,
        }
        setOrder(mapped)
      } catch (error) {
        console.error('Error fetching order:', error)
        setOrder(null)
        setOrderData(null)
      }
    }

    fetchOrder()
  }, [session, orderId, params])

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

        {/* All Order Items */}
        <div className="divide-y">
          {order?.items && order.items.length > 0 ? (
            order.items.map((item) => (
              <div key={item.id} className="p-4 flex items-start gap-4">
                <Image 
                  src={item.thumbnailUrl || '/img/product/p-1.png'} 
                  alt={item.title || 'Product'} 
                  width={88} 
                  height={88} 
                  className="rounded flex-shrink-0" 
                />
                <div className="flex-1 text-sm">
                  <div className="font-medium leading-5">{item.title || 'Product'}</div>
                  <div className="text-gray-600 mt-1">
                    Size: {item.size || '—'}, Color: {item.color || '—'}
                  </div>
                  <div className="text-blue-600 font-semibold mt-1">
                    {item.priceFormatted || '৳ 0'}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Quantity: {item.quantity || 1}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Subtotal: {formatCurrency((item as OrderItemSummary & { subtotal?: number; unitPrice?: number }).subtotal || 0)}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {order?.status === 'delivered' && item === order.items[0] && (
                    <Link href="#" className="text-xs text-blue-600 font-medium underline-offset-4 hover:underline">
                      WRITE A REVIEW
                    </Link>
                  )}
                  {orderData?.deliveryMethodId === 'steadfast' && orderData?.trackingId && item === order.items[0] && (
                    <Link 
                      href={`/home/product/tracking?trackingId=${orderData.trackingId}`}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium underline-offset-4 hover:underline"
                    >
                      <Package className="h-3 w-3" />
                      TRACK ORDER
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-sm text-gray-500">No items found in this order.</div>
          )}
        </div>

        {/* Meta + totals grid */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Order meta and address */}
          <div className="border-t md:border-t-0 md:border-r">
            <div className="px-4 py-3 bg-gray-50 border-t md:border-t-0"> 
              <div className="text-xs text-gray-700">Order {order?.orderId ?? order?.id ?? ''}</div>
              <div className="text-xs text-gray-500">Placed on {order?.createdAt ?? ''}</div>
              {orderData?.deliveryMethodId === 'steadfast' && orderData?.trackingId && (
                <div className="text-xs text-blue-600 mt-1">
                  <Package className="h-3 w-3 inline mr-1" />
                  Tracking: {orderData.trackingId}
                </div>
              )}
            </div>
            <div className="px-4 py-3 text-sm">
              <div className="font-medium mb-1">{orderData?.shippingName || 'N/A'}</div>
              <div className="text-gray-600">
                {orderData?.shippingStreetAddress || ''}
                {orderData?.shippingCity ? `, ${orderData.shippingCity}` : ''}
                {orderData?.shippingDistrict ? `, ${orderData.shippingDistrict}` : ''}
                {orderData?.shippingPostalCode ? ` ${orderData.shippingPostalCode}` : ''}
              </div>
              <div className="text-gray-600">{orderData?.shippingPhone || 'N/A'}</div>
              {orderData?.shippingEmail && (
                <div className="text-gray-600">{orderData.shippingEmail}</div>
              )}
            </div>
          </div>

          {/* Right: Totals */}
          <div className="border-t md:border-t-0">
            <div className="px-4 py-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-blue-600">{formatCurrency(order?.subtotal || 0)}</span>
              </div>
              {(order?.discount ?? 0) > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">-{formatCurrency(order?.discount || 0)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-blue-600">
                  {order?.deliveryCharge ? formatCurrency(order.deliveryCharge) : 'FREE'}
                </span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="font-medium">Total:</span>
                <span className="text-blue-600 font-semibold">{formatCurrency(order?.totalAmount || orderData?.totalAmount || 0)}</span>
              </div>
              {order?.paymentStatus === 'Paid' || order?.status === 'delivered' ? (
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Paid by {orderData?.deliveryMethodId === 'steadfast' ? 'Cash on Delivery (Steadfast)' : 'Cash on Delivery'}</span>
                </div>
              ) : (
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Payment: {order?.paymentStatus || 'Pending'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


