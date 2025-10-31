export type OrderStatus =
  | 'all'
  | 'to_pay'
  | 'to_ship'
  | 'to_receive'
  | 'to_review'
  | 'cancelled'
  | 'delivered'

export interface OrderItemSummary {
  id: string
  title: string
  thumbnailUrl: string
  priceFormatted: string
  size?: string
  color?: string
  quantity: number
}

export interface OrderSummary {
  id: string
  orderId: string
  storeName: string
  storeVerified: boolean
  status: OrderStatus
  paymentStatus?: string
  deliveryMethod?: string
  items: OrderItemSummary[]
  createdAt: string
  trackingId?: string
  parcelId?: string
}


