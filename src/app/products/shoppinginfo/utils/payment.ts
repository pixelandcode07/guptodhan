import axios from 'axios'

export interface CreateOrderPayload {
  userId: string
  storeId?: string
  deliveryMethodId: string
  shippingName: string
  shippingPhone: string
  shippingEmail: string
  shippingStreetAddress: string
  shippingCity: string
  shippingDistrict: string
  shippingPostalCode: string
  shippingCountry: string
  addressDetails: string
  deliveryCharge: number
  totalAmount: number
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded'
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
  orderForm: 'Website' | 'App'
  orderDate: Date
  deliveryDate?: Date
  products: Array<{
    productId: string
    vendorId: string
    quantity: number
    unitPrice: number
    discountPrice?: number
    size?: string
    color?: string
  }>
  couponId?: string
}

export async function placeOrder(orderData: CreateOrderPayload) {
  const response = await axios.post('/api/v1/product-order', orderData)
  if (!response.data?.success) {
    throw new Error(response.data?.message || 'Failed to place order')
  }
  return response.data.data
}

/**
 * ✅ FIX: Always sends the human-readable string `orderId` (e.g. "GDH-...")
 * to the payment init endpoint. The backend now queries by this field
 * instead of MongoDB _id, so the formats always match.
 */
export async function initiateSSLCommerzPayment(orderId: string): Promise<string> {
  if (!orderId || orderId.trim() === '') {
    throw new Error('Order ID is required to initiate payment.')
  }

  const paymentResponse = await axios.post('/api/v1/payment/init', {
    orderId: orderId.trim(),
  })

  if (!paymentResponse.data?.success || !paymentResponse.data?.data?.url) {
    throw new Error(
      paymentResponse.data?.message || 'Failed to initialize payment gateway'
    )
  }

  return paymentResponse.data.data.url as string
}

/**
 * Extracts the string orderId from the order creation API response.
 * Prefers the human-readable `orderId` string field over MongoDB `_id`.
 *
 * API response shapes handled:
 *   - { data: { order: { orderId, _id } } }   ← nested order object
 *   - { data: { orderId, _id } }               ← flat order object
 */
export function extractOrderId(responseData: any): string {
  const orderId =
    responseData?.order?.orderId ||   // nested, string field  ← prefer this
    responseData?.orderId ||           // flat, string field
    responseData?.order?._id ||        // nested, MongoDB _id fallback
    responseData?._id                  // flat, MongoDB _id fallback

  if (!orderId) {
    throw new Error('No order ID received from server.')
  }

  return String(orderId)
}