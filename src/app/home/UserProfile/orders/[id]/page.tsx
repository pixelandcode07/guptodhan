"use client"

import React, { useState } from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation' // ✅ Router added for redirect
import api from '@/lib/axios'
import axios from 'axios' // ✅ Added for Cancel API
import { CheckCircle, Package, ExternalLink, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'; // ✅ Added for Cancel Modal
import { toast } from 'sonner' // ✅ Added for Toast
import type { OrderStatus, OrderSummary } from '@/components/UserProfile/Order/types'
import OrderStatusBadge from '@/components/UserProfile/Order/OrderStatusBadge'
import ReturnRequestModal from '@/components/UserProfile/Order/ReturnRequestModal' 

function mapOrderStatusToUI(status: string): OrderStatus {
  if (!status) return 'to_pay'
  const s = status.trim().toLowerCase()
  if (s === 'delivered') return 'delivered'
  if (s === 'cancelled' || s === 'canceled') return 'cancelled'
  if (
    s === 'shipped' ||
    s === 'shipping' ||
    s.includes('transit') ||
    s.includes('receive') ||
    s.includes('delivery') ||
    s.includes('dispatched') ||
    s.includes('way')
  ) {
    return 'to_receive'
  }
  if (s === 'processing' || s === 'approved' || s === 'ready to ship' || s.includes('ship')) return 'to_ship'
  if (s.includes('return')) return 'return_refund'
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
      slug?: string 
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

// ================================================================
// ✅ NEW: UserOrderCancel Component integrated
// ================================================================
function UserOrderCancel({ orderId, orderStatus, userId }: { orderId: string, orderStatus: string, userId: string }) {
    const router = useRouter();
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [loading, setLoading] = useState(false);

    // Common Daraz-style reasons
    const cancelReasonsList = [
        "Changed my mind",
        "Found a better price elsewhere",
        "Delivery is taking too long",
        "Ordered by mistake / Duplicate order",
        "Forgot to apply coupon code",
        "Other reasons"
    ];

    const handleCancelOrder = async () => {
        if (!cancelReason) {
            toast.error("Please select a reason for cancellation.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.patch(`/api/v1/product-order/${orderId}/cancel`, {
                userId: userId, 
                reason: cancelReason
            });

            if (response.data.success) {
                toast.success("Order cancelled successfully!");
                setIsCancelModalOpen(false);
                window.location.reload(); // Reload to fetch fresh data
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to cancel order.");
        } finally {
            setLoading(false);
        }
    };

    // 💡 Rule: Only allow cancellation if status is Pending (to_pay) or Processing (to_ship)
    if (orderStatus !== 'to_pay' && orderStatus !== 'to_ship') {
        return null; 
    }

    return (
        <>
            <Button 
                variant="destructive" 
                size="sm"
                onClick={() => setIsCancelModalOpen(true)}
                className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 border border-red-100 h-7 text-xs font-semibold px-3"
            >
                Cancel Order
            </Button>

            <Dialog open={isCancelModalOpen} onOpenChange={setIsCancelModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Cancel Order</DialogTitle>
                    </DialogHeader>
                    
                    <div className="py-4">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Why do you want to cancel this order? <span className="text-red-500">*</span>
                        </label>
                        <div className="space-y-2 mt-3">
                            {cancelReasonsList.map((reason, idx) => (
                                <label key={idx} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input 
                                        type="radio" 
                                        name="cancelReason" 
                                        value={reason}
                                        checked={cancelReason === reason}
                                        onChange={(e) => setCancelReason(e.target.value)}
                                        className="w-4 h-4 text-red-600 focus:ring-red-500 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-700">{reason}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsCancelModalOpen(false)} disabled={loading}>
                            Keep Order
                        </Button>
                        <Button 
                            variant="destructive" 
                            onClick={handleCancelOrder} 
                            disabled={loading || !cancelReason}
                        >
                            {loading ? "Cancelling..." : "Confirm Cancellation"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

// ================================================================
// Main Page Component
// ================================================================
export default function OrderDetailsPage() {
  const [order, setOrder] = React.useState<OrderWithDetails | null>(null)
  const [orderData, setOrderData] = React.useState<ApiOrder | null>(null)
  const [isLoading, setIsLoading] = React.useState(true) 
  
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

  const { data: session } = useSession()
  const params = useParams()
  const orderIdParam = params?.id as string 

  const fetchOrder = React.useCallback(async () => {
    const userLike = (session?.user ?? {}) as { id?: string; _id?: string }
    const userId = userLike._id || userLike.id
    if (!userId || !orderIdParam) return

    const token = (session as { accessToken?: string })?.accessToken
    const headers: Record<string, string> = { 'x-user-id': userId }
    if (token) headers['Authorization'] = `Bearer ${token}`

    setIsLoading(true)
    try {
      let url = `/product-order/${orderIdParam}`;
      if (orderIdParam.startsWith('ORD-')) {
         url = `/product-order/find-by-ord/${orderIdParam}`; 
      }
      
      const res = await api.get(url, { headers })
      
      const rawData = res.data?.data;
      const found = (Array.isArray(rawData) ? rawData[0] : rawData) as ApiOrder | null;
      
      if (!found) { 
        setOrder(null)
        setOrderData(null)
        return 
      }

      setOrderData(found)

      const items = (found.orderDetails || []).map((detail, index) => {
        const product = detail.productId && 
                       typeof detail.productId === 'object' && 
                       'productTitle' in detail.productId
          ? detail.productId
          : null
        
        let productImage = '/img/product/p-1.png'
        if (product?.thumbnailImage) {
          productImage = product.thumbnailImage
        } else if (product?.photoGallery) {
          const gallery = Array.isArray(product.photoGallery) ? product.photoGallery : [product.photoGallery]
          if (gallery.length > 0) {
            productImage = gallery[0]
          }
        }
        
        const productName = product?.productTitle || found.shippingName || 'Product'
        const productSlug = product?.slug || product?._id || '' 
        
        const unitPrice = detail.unitPrice || detail.discountPrice || (detail.totalPrice && detail.quantity ? detail.totalPrice / detail.quantity : 0) || product?.discountPrice || product?.productPrice || 0
        const itemSubtotal = unitPrice * (detail.quantity || 1)

        return {
          id: detail._id || detail.orderDetailsId || `item_${index}`,
          title: productName,
          thumbnailUrl: productImage,
          slug: productSlug, 
          priceFormatted: formatCurrency(unitPrice),
          quantity: detail.quantity || 1,
          size: detail.size?.trim() && detail.size !== '—' ? detail.size : '',
          color: detail.color?.trim() && detail.color !== '—' ? detail.color : '',
          unitPrice,
          subtotal: itemSubtotal, 
        }
      })

      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
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
    } finally {
      setIsLoading(false)
    }
  }, [session, orderIdParam])

  React.useEffect(() => {
    fetchOrder()
  }, [fetchOrder])

  const handleReturnClick = (id: string) => {
    setSelectedOrderId(id); 
    setIsReturnModalOpen(true);
  };

  const handleReturnSuccess = () => {
    fetchOrder(); 
  };

  const isReturnRequested = order?.status === 'return_refund';
  
  const userLike = (session?.user ?? {}) as { id?: string; _id?: string }
  const currentUserId = userLike._id || userLike.id || '';

  if (isLoading) {
    return (
      <div className="p-10 flex flex-col justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0097E9]"></div>
        <p className="text-gray-500 mt-4 text-sm">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-10 flex flex-col justify-center items-center h-[60vh] text-center">
        <div className="text-gray-300 mb-4">
          <Package size={64} className="mx-auto" />
        </div>
        <h2 className="text-xl font-bold text-gray-700">Order Not Found</h2>
        <p className="text-sm text-gray-500 mt-2 mb-6">We couldn't find the details for this order. It might have been removed or the ID is incorrect.</p>
        <Link href="/home/UserProfile/orders">
          <Button className="bg-[#0097E9] hover:bg-blue-600">View All Orders</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold px-4 mt-1 mb-4">Order Details</h1>

      <div className="bg-white border rounded-md shadow-sm">
        <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
          <div className="text-sm font-medium flex items-center gap-2">
            <span className="text-gray-700">{order?.storeName ?? 'Store'}</span>
            {order?.storeVerified && (
              <span className="text-blue-600 text-[10px] uppercase font-bold inline-flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded">
                Verified <CheckCircle className="h-3 w-3" />
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
              {/* ✅ NEW: Cancel Button Component Rendered Here */}
              <UserOrderCancel 
                orderId={order.id} 
                orderStatus={order.status} 
                userId={currentUserId} 
              />

              {isReturnRequested && (
                <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                  Return Requested
                </span>
              )}
              {orderData?.trackingId && (
                <Link href={`/products/tracking?trackingId=${orderData.trackingId}`}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-[10px] uppercase font-bold text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 gap-1.5 bg-white px-2"
                  >
                    <Package className="h-3 w-3" /> Track Order
                  </Button>
                </Link>
              )}
              <OrderStatusBadge status={(order?.status ?? 'to_pay') as OrderStatus} />
          </div>
        </div>

        <div className="divide-y">
          {order?.items && order.items.length > 0 ? (
            order.items.map((item: any) => (
              <div key={item.id} className="p-4 flex items-start gap-4 hover:bg-gray-50/50 transition-colors">
                
                <Link href={`/product/${item.slug}`} className="shrink-0 block border border-gray-100 rounded bg-white">
                  <Image 
                    src={item.thumbnailUrl || '/img/product/p-1.png'} 
                    alt={item.title || 'Product'} 
                    width={88} 
                    height={88} 
                    className="rounded object-cover hover:opacity-80 transition-opacity" 
                  />
                </Link>
                
                <div className="flex-1 text-sm min-w-0">
                  <Link href={`/product/${item.slug}`} className="font-medium text-gray-900 leading-5 line-clamp-2 hover:text-[#0097E9] transition-colors">
                    {item.title || 'Product'}
                  </Link>
                  
                  <div className="text-xs text-gray-500 mt-2 flex items-center gap-2">
                    <span>Qty: {item.quantity || 1}</span>
                    <span className="text-gray-300">|</span>
                    <span>Unit Price: <span className="font-medium text-gray-700">{formatCurrency(item.unitPrice)}</span></span>
                  </div>
                  
                  {(item.size || item.color) && (
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      {item.color && <span>Color: {item.color}</span>}
                      {item.size && item.color && <span className="text-gray-300">|</span>}
                      {item.size && <span>Size: {item.size}</span>}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3 shrink-0 ml-4">
                  <div className="font-bold text-[#EF4A23] text-base">
                    {formatCurrency(item.subtotal || 0)}
                  </div>

                  {order?.status === 'delivered' && (
                    <div className="flex flex-col items-end gap-2">
                      <Link 
                        href={`/product/${item.slug}#reviews`} 
                        className="text-xs text-[#0097E9] font-bold uppercase hover:underline underline-offset-4"
                      >
                        WRITE A REVIEW
                      </Link>

                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleReturnClick(order.id)} 
                        className="h-7 text-[10px] uppercase font-bold text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-1.5 bg-white px-2 mt-1"
                      >
                        <RotateCcw className="h-3 w-3" /> Return Item
                      </Button>
                    </div>
                  )}
                  
                  {orderData?.deliveryMethodId === 'steadfast' && orderData?.trackingId && (
                    <Link 
                      href={`/products/tracking?trackingId=${orderData.trackingId}`}
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

        <div className="grid grid-cols-1 md:grid-cols-2 bg-gray-50/50">
          <div className="border-t md:border-t-0 md:border-r">
            <div className="px-4 py-3 border-t md:border-t-0 border-b border-gray-100"> 
              <div className="text-xs text-gray-700 font-medium">Order: <span className="font-mono">{order?.orderId ?? order?.id ?? ''}</span></div>
              <div className="text-xs text-gray-500 mt-0.5">Placed on {order?.createdAt ?? ''}</div>
              {orderData?.deliveryMethodId === 'steadfast' && orderData?.trackingId && (
                <div className="text-xs text-blue-600 mt-2 font-medium bg-blue-50 inline-block px-2 py-1 rounded">
                  <Package className="h-3 w-3 inline mr-1" />
                  Tracking: {orderData.trackingId}
                </div>
              )}
            </div>
            <div className="px-4 py-3 text-sm">
              <div className="font-medium text-gray-800 mb-1">Shipping Details</div>
              <div className="font-medium text-gray-700 text-xs mt-2">{orderData?.shippingName || 'N/A'}</div>
              <div className="text-gray-500 text-xs mt-1 leading-relaxed">
                {orderData?.shippingStreetAddress || ''}
                {orderData?.shippingCity ? `, ${orderData.shippingCity}` : ''}
                {orderData?.shippingDistrict ? `, ${orderData.shippingDistrict}` : ''}
                {orderData?.shippingPostalCode ? ` ${orderData.shippingPostalCode}` : ''}
              </div>
              <div className="text-gray-500 text-xs mt-1">{orderData?.shippingPhone || 'N/A'}</div>
              {orderData?.shippingEmail && (
                <div className="text-gray-500 text-xs">{orderData.shippingEmail}</div>
              )}
            </div>
          </div>

          <div className="border-t md:border-t-0 p-4">
            <div className="font-medium text-gray-800 text-sm mb-3">Order Summary</div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-800">{formatCurrency(order?.subtotal || 0)}</span>
              </div>
              {(order?.discount ?? 0) > 0 && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600 font-medium">-{formatCurrency(order?.discount || 0)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium text-gray-800">
                  {order?.deliveryCharge ? formatCurrency(order.deliveryCharge) : 'FREE'}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 mt-2 pt-2">
                <span className="font-bold text-gray-800">Total:</span>
                <span className="text-[#EF4A23] font-bold text-base">{formatCurrency(order?.totalAmount || orderData?.totalAmount || 0)}</span>
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-200">
                {order?.paymentStatus === 'Paid' || order?.status === 'delivered' ? (
                  <div className="flex items-center justify-between text-xs font-medium text-gray-700">
                    <span>Payment Method:</span>
                    <span>{orderData?.deliveryMethodId === 'steadfast' ? 'Steadfast COD' : 'Cash on Delivery'}</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs font-medium text-gray-700">
                    <span>Payment Status:</span>
                    <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded">{order?.paymentStatus || 'Pending'}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {isReturnModalOpen && selectedOrderId && (
        <ReturnRequestModal 
          isOpen={isReturnModalOpen}
          onClose={() => setIsReturnModalOpen(false)}
          orderId={selectedOrderId}
          onSuccess={handleReturnSuccess}
        />
      )}
    </div>
  )
}