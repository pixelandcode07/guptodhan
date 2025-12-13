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

export async function initiateSSLCommerzPayment(orderId: string): Promise<string> {
	const paymentResponse = await axios.post('/api/v1/payment/init', { orderId })
	if (!paymentResponse.data?.success || !paymentResponse.data?.data?.url) {
		throw new Error(paymentResponse.data?.message || 'Failed to initialize payment gateway')
	}
	return paymentResponse.data.data.url as string
}
