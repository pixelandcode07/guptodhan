"use client"

import React, { useState, useEffect } from 'react'
import OrderSummary from './components/OrderSummary'
import DeliveryOptions, { DeliveryOption } from './components/DeliveryOptions'
import ItemsList from './components/ItemsList'
import OrderSuccessModal from './components/OrderSuccessModal'
import OrderErrorModal from './components/OrderErrorModal'
import InfoForm from './components/InfoForm'
import FancyLoadingPage from '@/app/general/loading'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'sonner'
import { AppliedCoupon } from './components/CouponSection'
import { useGeoData } from '@/hooks/useGeoData'
import { useDeliveryCharge } from '@/hooks/useDeliveryCharge'
import { useUpazilas } from '@/hooks/useUpazilas'
import { placeOrder, initiateSSLCommerzPayment } from './utils/payment'

export type CartItem = {
	id: string;
	seller: {
		name: string;
		verified: boolean;
	};
	product: {
		id: string;
		name: string;
		image: string;
		size: string;
		color: string;
		price: number;
		originalPrice: number;
		quantity: number;
	};
};

interface UserProfile {
	_id: string;
	name: string;
	email?: string;
	phoneNumber?: string;
	address: string;
	profilePicture?: string;
	isVerified: boolean;
	isActive: boolean;
	role: string;
	rewardPoints: number;
}

export default function ShoppingInfoContent({ cartItems }: { cartItems: CartItem[] }) {
	const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>('standard')
	const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
	const [profileLoading, setProfileLoading] = useState(true)
	const [formData, setFormData] = useState({
		name: '',
		phone: '',
		email: '',
		district: '',
		upazila: '',
		address: '',
		city: '',
		postalCode: '',
		country: 'Bangladesh'
	})
	const { data: session } = useSession()

	const { geoData, geoLoading } = useGeoData()
	const { deliveryCharge } = useDeliveryCharge(formData.district, formData.upazila)
	const { upazilas } = useUpazilas(formData.district)

	const [successModalOpen, setSuccessModalOpen] = useState(false)
	const [successOrderId, setSuccessOrderId] = useState('')
	const [errorModalOpen, setErrorModalOpen] = useState(false)
	const [errorMessage, setErrorMessage] = useState('')
	const [lastPaymentMethod, setLastPaymentMethod] = useState<'cod' | 'card'>('cod')
	
	const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)

	const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.product.quantity), 0)
	const totalSavings = cartItems.reduce((sum, item) => sum + ((item.product.originalPrice - item.product.price) * item.product.quantity), 0)
	
	const calculateCouponDiscount = (): number => {
		if (!appliedCoupon) return 0
		const typeLower = appliedCoupon.type.toLowerCase().trim()
		const isPercentage = typeLower === 'percentage' || typeLower.includes('percentage')
		if (isPercentage) {
			const couponDiscount = (subtotal * appliedCoupon.value) / 100
			return Math.round(couponDiscount * 100) / 100
		} else {
			return Math.min(appliedCoupon.value, subtotal)
		}
	}

	const couponDiscount = calculateCouponDiscount()
	const finalDeliveryCharge = deliveryCharge

	const showSuccessModal = async (orderId: string) => {
		setSuccessOrderId(orderId)
		setSuccessModalOpen(true)
		setErrorModalOpen(false)
		if (userProfile?._id) {
			try {
				await axios.delete(`/api/v1/add-to-cart/get-cart/${userProfile._id}`)
			} catch (error) {
				console.error('Error clearing cart from database:', error)
			}
		}
	}

	const showError = (message: string) => {
		setErrorMessage(message)
		setErrorModalOpen(true)
		setSuccessModalOpen(false)
	}

	const handleSuccessModalClose = () => {
		setSuccessModalOpen(false)
	}

	useEffect(() => {
		const fetchUserProfile = async () => {
			try {
				setProfileLoading(true)
				if (!session?.user) {
					setProfileLoading(false)
					return
				}
				const userLike = (session?.user ?? {}) as { id?: string; _id?: string }
				const userId = userLike.id || userLike._id
				if (!userId) {
					setProfileLoading(false)
					return
				}
				const response = await axios.get('/api/v1/profile/me', {
					headers: { 'x-user-id': userId }
				})
				if (response.data.success && response.data.data) {
					setUserProfile(response.data.data)
				}
			} catch (error) {
				console.error('Error fetching user profile:', error)
			} finally {
				setProfileLoading(false)
			}
		}
		fetchUserProfile()
	}, [session])

	const validateCODOrder = (paymentMethod: 'cod' | 'card') => {
		const errors: string[] = []
		if (!session?.user) errors.push('User must be logged in to place order')
		if (!userProfile?._id) errors.push('User profile information is missing. Please complete your profile.')
		if (!formData.name || !formData.phone || !formData.email || !formData.district || !formData.upazila || !formData.address || !formData.city || !formData.postalCode || !formData.country) {
			errors.push('Please fill in all required delivery information')
		}
		if (paymentMethod === 'cod') {
			if (cartItems.length === 0) errors.push('Your cart is empty')
			if (!selectedDelivery) errors.push('Please select a delivery method')
		}
		return errors
	}

	const handlePlaceOrder = async (paymentMethod: 'cod' | 'card') => {
		try {
			setLastPaymentMethod(paymentMethod)
			const validationErrors = validateCODOrder(paymentMethod)
			if (validationErrors.length > 0) {
				showError(validationErrors.join(', '))
				return
			}

			let resolvedStoreId: string | undefined = undefined
			if (cartItems.length > 0) {
				try {
					const firstProductId = cartItems[0].product.id
					const productResp = await axios.get(`/api/v1/product/${firstProductId}`)
					const productData = productResp?.data?.data
					if (productData?.vendorStoreId) {
						resolvedStoreId = productData.vendorStoreId
					}
				} catch {
				}
			}

			const orderData = {
				userId: userProfile?._id!,
				...(resolvedStoreId ? { storeId: resolvedStoreId } : {}),
				deliveryMethodId: selectedDelivery,
				shippingName: formData.name || userProfile?.name || 'Guest User',
				shippingPhone: formData.phone || userProfile?.phoneNumber || '01700000000',
				shippingEmail: formData.email || userProfile?.email || 'guest@example.com',
				shippingStreetAddress: formData.address || userProfile?.address || 'Address not provided',
				shippingCity: formData.city || 'Dhaka',
				shippingDistrict: formData.district || 'Dhaka',
				shippingPostalCode: formData.postalCode || '1000',
				shippingCountry: formData.country || 'Bangladesh',
				addressDetails: `${formData.address}, ${formData.upazila}, ${formData.district}`,
				deliveryCharge: finalDeliveryCharge,
				totalAmount: subtotal - couponDiscount + finalDeliveryCharge,
				paymentStatus: 'Pending' as const,
				orderStatus: 'Pending' as const,
				orderForm: 'Website' as const,
				orderDate: new Date(),
				deliveryDate: new Date(Date.now() + (selectedDelivery === 'steadfast' ? 2 : 3) * 24 * 60 * 60 * 1000),
				...(selectedDelivery === 'steadfast' && { parcelId: null, trackingId: null }),
				products: cartItems.map(item => ({
					productId: item.product.id,
					vendorId: item.id,
					quantity: item.product.quantity,
					unitPrice: item.product.originalPrice,
					discountPrice: item.product.price,
					size: item.product.size,
					color: item.product.color
				})),
				couponId: appliedCoupon?._id || undefined
			}

			if (paymentMethod === 'card') {
				toast.loading('Redirecting to payment gateway...', { id: 'payment-init' })
				try {
					const placed = await placeOrder(orderData)
					const orderId = placed.order?._id || placed.orderId || placed.order?.orderId
					if (!orderId) throw new Error('Order ID missing after order creation')
					const gatewayUrl = await initiateSSLCommerzPayment(orderId)
					toast.dismiss('payment-init')
					window.location.href = gatewayUrl
					return
				} catch (err: any) {
					toast.dismiss('payment-init')
					const msg = err?.message || 'Failed to initialize payment gateway. Please try again.'
					toast.error('Payment initialization failed', { description: msg, duration: 4000 })
					showError(msg)
					return
				}
			}

			const response = await axios.post('/api/v1/product-order', orderData)
			if (response.data.success) {
				const o = response.data.data
				let orderSuccessfullyCompleted = true
				if (selectedDelivery === 'steadfast') {
					try {
						const steadfastResponse = await axios.post('/api/v1/product-order/steadfast', { orderId: o.order.orderId })
						if (steadfastResponse.data.success) {
							const consignmentId = steadfastResponse.data.data.consignmentId
							const trackingCode = steadfastResponse.data.data.trackingCode
							localStorage.setItem('lastOrderTracking', JSON.stringify({
								orderId: o.order.orderId,
								parcelId: consignmentId,
								trackingId: trackingCode,
								trackingUrl: `https://portal.packzy.com/track/${trackingCode}`,
							}))
						} else {
							orderSuccessfullyCompleted = false
							const errorMsg = 'Failed to create Steadfast parcel. Please contact support.'
							toast.error('Steadfast parcel creation failed', { description: errorMsg, duration: 4000 })
							showError(errorMsg)
						}
					} catch (error) {
						console.error('Error creating Steadfast parcel:', error)
						orderSuccessfullyCompleted = false
						try {
							await axios.patch(`/api/v1/product-order/${o.order.orderId}`, { orderStatus: 'Cancelled', updatedAt: new Date() })
						} catch (updateError) {
							console.error('Error updating order status:', updateError)
						}
						const errorMsg = 'Failed to create Steadfast parcel. Your order has been placed but needs manual processing. Please contact support.'
						toast.error('Steadfast parcel creation failed', { description: errorMsg, duration: 5000 })
						showError(errorMsg)
						localStorage.setItem('lastOrderTracking', JSON.stringify({
							orderId: o.order.orderId,
							parcelId: null,
							trackingId: null,
							trackingUrl: null,
							note: 'Steadfast parcel creation failed - contact support'
						}))
					}
				}
				if (orderSuccessfullyCompleted) {
					showSuccessModal(o.order.orderId)
				}
			} else {
				const errorMsg = response.data.message || 'Failed to place order. Please try again.'
				toast.error('Order failed', { description: errorMsg, duration: 4000 })
				showError(errorMsg)
			}
		} catch (error) {
			console.error('Error placing order:', error)
			const errorMsg = 'Failed to place order. Please try again or contact support.'
			toast.error('Order failed', { description: errorMsg, duration: 4000 })
			showError(errorMsg)
		}
	}

	if (profileLoading || geoLoading) {
		return <FancyLoadingPage />
	}

	if (!userProfile && session?.user) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="text-center">
					<div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
						<p className="font-bold">Profile Information Required</p>
						<p className="text-sm">Please complete your profile information to proceed with checkout.</p>
						<p className="text-xs mt-2">Using default information for now.</p>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<InfoForm 
						onFormDataChange={setFormData}
						initialData={{
							name: userProfile?.name || '',
							phone: userProfile?.phoneNumber || '',
							email: userProfile?.email || '',
							address: userProfile?.address || '',
							city: 'Dhaka',
							postalCode: '1000',
							country: 'Bangladesh'
						}}
						districts={geoData.allDistricts}
						upazilas={upazilas}
					/>
					<DeliveryOptions 
						selectedDelivery={selectedDelivery}
						onDeliveryChange={setSelectedDelivery}
					/>
					<ItemsList items={cartItems} />
				</div>
				<div className="lg:col-span-1">
					<OrderSummary 
						subtotal={subtotal} 
						discount={totalSavings} 
						shipping={finalDeliveryCharge}
						onPlaceOrder={handlePlaceOrder}
						selectedDelivery={selectedDelivery}
						appliedCoupon={appliedCoupon}
						onCouponApplied={setAppliedCoupon}
					/>
				</div>
			</div>

			<OrderSuccessModal
				open={successModalOpen}
				onOpenChange={handleSuccessModalClose}
				orderId={successOrderId}
			/>

			<OrderErrorModal
				open={errorModalOpen}
				onOpenChange={setErrorModalOpen}
				errorMessage={errorMessage}
				onRetry={() => {
					handlePlaceOrder(lastPaymentMethod)
				}}
			/>
		</div>
	)
}
