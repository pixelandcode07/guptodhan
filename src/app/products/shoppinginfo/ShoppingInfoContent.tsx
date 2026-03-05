"use client"

import { useState, useEffect, useRef } from 'react' // ✅ useRef যুক্ত করা হয়েছে
import OrderSummary from './components/OrderSummary'
import DeliveryOptions, { DeliveryOption } from './components/DeliveryOptions'
import ItemsList from './components/ItemsList'
import CheckoutItemsTable from './components/CheckoutItemsTable'
import OrderSuccessModal from './components/OrderSuccessModal'
import OrderErrorModal from './components/OrderErrorModal'
import InfoForm from './components/InfoForm'
import ShoppingInfoSkeleton from './components/ShoppingInfoSkeleton'
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
        shippingCost?: number; 
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

const isValidObjectId = (id: string | undefined): boolean => {
    if (!id) return false
    return /^[0-9a-fA-F]{24}$/.test(id)
}

export default function ShoppingInfoContent({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}: {
  cartItems: CartItem[];
  onUpdateQuantity?: (itemId: string, newQuantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
}) {
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
    const { deliveryCharge: baseDistrictCharge } = useDeliveryCharge(formData.district, formData.upazila)
    const { upazilas } = useUpazilas(formData.district)

    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const [successOrderId, setSuccessOrderId] = useState('')
    const [errorModalOpen, setErrorModalOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [lastPaymentMethod, setLastPaymentMethod] = useState<'cod' | 'card'>('cod')
    const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)

    // ✅ State for items
    const [enrichedCartItems, setEnrichedCartItems] = useState<CartItem[]>(cartItems);
    
    // ✅ ১. একটি Ref ব্যবহার করা হচ্ছে যাতে ট্যাব পাল্টানোর সময় বারবার এপিআই কল না হয়
    const isFetchedRef = useRef(false);

    // ✅ ২. রিলোড সমস্যা সমাধানের মূল ফিক্স (Effect Logic)
    useEffect(() => {
        const fetchLatestProductDetails = async () => {
            // যদি কার্ট খালি থাকে অথবা অলরেডি একবার ফেচ করা হয়ে থাকে তবে আর ফেচ করবে না
            if (cartItems.length === 0 || isFetchedRef.current) return;
            
            try {
                const updatedItems = await Promise.all(cartItems.map(async (item) => {
                    try {
                        const res = await axios.get(`/api/v1/product/${item.product.id}`);
                        if (res.data?.success && res.data?.data) {
                            return {
                                ...item,
                                product: {
                                    ...item.product,
                                    shippingCost: res.data.data.shippingCost || 0 
                                }
                            };
                        }
                        return item;
                    } catch (e) {
                        return item;
                    }
                }));
                setEnrichedCartItems(updatedItems);
                isFetchedRef.current = true; // একবার সফলভাবে ফেচ হলে লক করে দেওয়া হলো
            } catch (error) {
                console.error("Failed to refresh cart items", error);
            }
        };
        fetchLatestProductDetails();
    }, [cartItems.length]); // ✅ পুরো অ্যারের বদলে শুধু length ব্যবহার করা হয়েছে

    const subtotal = enrichedCartItems.reduce((sum, item) => sum + (item.product.price * item.product.quantity), 0)
    const totalSavings = enrichedCartItems.reduce((sum, item) => sum + ((item.product.originalPrice - item.product.price) * item.product.quantity), 0)
    
    const calculateTotalDeliveryCharge = () => {
        const customChargeTotal = enrichedCartItems.reduce((sum, item) => {
            return sum + ((item.product.shippingCost || 0) * item.product.quantity);
        }, 0);

        if (customChargeTotal > 0) {
            return customChargeTotal;
        }
        return baseDistrictCharge;
    };

    const finalDeliveryCharge = calculateTotalDeliveryCharge();

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

    const showSuccessModal = async (orderId: string) => {
        setSuccessOrderId(orderId)
        setSuccessModalOpen(true)
        setErrorModalOpen(false)
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('buyNowProductId')
        }
        if (userProfile?._id) {
            try {
                await axios.delete(`/api/v1/add-to-cart/get-cart/${userProfile._id}`)
            } catch (error) {
                console.error('Error clearing cart:', error)
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
        if (!userProfile?._id) errors.push('User profile information is missing.')
        if (!formData.name || !formData.phone || !formData.email || !formData.district || !formData.upazila || !formData.address || !formData.city || !formData.postalCode || !formData.country) {
            errors.push('Please fill in all required delivery information')
        }
        if (paymentMethod === 'cod') {
            if (enrichedCartItems.length === 0) errors.push('Your cart is empty')
            if (!selectedDelivery) errors.push('Please select a delivery method')
        }
        return errors
    }

    const resolveStoreId = async (): Promise<string | undefined> => {
        if (enrichedCartItems.length === 0) return undefined
        try {
            const firstProductId = enrichedCartItems[0].product.id
            if (!firstProductId) return undefined
            const productResp = await axios.get(`/api/v1/product/${firstProductId}`)
            const productData = productResp?.data?.data
            if (!productData) return undefined
            
            if (productData?.vendorStoreId && isValidObjectId(productData.vendorStoreId)) {
                return productData.vendorStoreId
            }
            if (productData?.vendorId && isValidObjectId(productData.vendorId)) {
                return productData.vendorId
            }
            return undefined
        } catch (error) {
            return undefined
        }
    }

    const handlePlaceOrder = async (paymentMethod: 'cod' | 'card') => {
        try {
            setLastPaymentMethod(paymentMethod)
            const validationErrors = validateCODOrder(paymentMethod)
            if (validationErrors.length > 0) {
                showError(validationErrors.join(', '))
                return
            }

            const resolvedStoreId = await resolveStoreId()

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
                deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                products: enrichedCartItems.map(item => ({
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
                    const placedOrder = Array.isArray(placed) ? placed[0] : placed;
                    const orderId = placedOrder?.orderId || placedOrder?._id;

                    if (!orderId) throw new Error('Order ID missing')
                    
                    const gatewayUrl = await initiateSSLCommerzPayment(orderId)
                    toast.dismiss('payment-init')
                    window.location.href = gatewayUrl
                    return
                } catch (err: any) {
                    toast.dismiss('payment-init')
                    showError(err?.message || 'Failed to initialize payment.')
                    return
                }
            }

            const response = await axios.post('/api/v1/product-order', orderData)
            
            if (response.data.success) {
                const primaryOrder = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
                const currentOrderId = primaryOrder.orderId;

                if (selectedDelivery === 'steadfast') {
                    try {
                        const steadfastResponse = await axios.post('/api/v1/product-order/steadfast', { 
                            orderId: currentOrderId 
                        })
                        if (steadfastResponse.data.success) {
                            localStorage.setItem('lastOrderTracking', JSON.stringify({
                                orderId: currentOrderId,
                                trackingId: steadfastResponse.data.data.trackingCode,
                                trackingUrl: `https://portal.packzy.com/track/${steadfastResponse.data.data.trackingCode}`,
                            }))
                        }
                    } catch (error) {
                        console.error('Courier sync failed:', error)
                    }
                }
                showSuccessModal(currentOrderId)
            } else {
                showError(response.data.message || 'Order failed')
            }

        } catch (error) {
            console.error('Error placing order:', error)
            showError('Failed to place order.')
        }
    }

    if (profileLoading || geoLoading) {
        return <ShoppingInfoSkeleton />
    }

    if (!userProfile && session?.user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                        <p className="font-bold">Profile Information Required</p>
                        <p className="text-sm">Please complete your profile.</p>
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
                    {onUpdateQuantity && onRemoveItem ? (
                      <CheckoutItemsTable
                        items={enrichedCartItems}
                        onUpdateQuantity={onUpdateQuantity}
                        onRemoveItem={onRemoveItem}
                      />
                    ) : (
                      <ItemsList items={enrichedCartItems} />
                    )}
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
                onRetry={() => handlePlaceOrder(lastPaymentMethod)}
            />
        </div>
    )
}