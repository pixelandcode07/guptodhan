export type OrderStatus = 'all' | 'to_pay' | 'to_ship' | 'to_receive' | 'to_review' | 'delivered' | 'cancelled' | 'return_refund';

export interface OrderItem {
  id: string
  title: string
  thumbnailUrl: string
  priceFormatted: string
  quantity: number
  size: string
  color: string
}

export interface OrderItemSummary extends OrderItem {
  subtotal?: number
  unitPrice?: number
}

export interface OrderSummary {
  id: string
  orderId: string
  storeName: string
  storeVerified: boolean
  status: OrderStatus
  paymentStatus: string
  deliveryMethod: string
  createdAt: string
  items: OrderItemSummary[]  // ✅ OrderItem → OrderItemSummary
  trackingId?: string
  parcelId?: string
}