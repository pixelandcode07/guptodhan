"use client"

import { useState, useEffect, useRef } from 'react'
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
import { useUpazilas } from '@/hooks/useUpazilas'
import { placeOrder, initiateSSLCommerzPayment } from './utils/payment'
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react'
import ShippingAddressCard from './components/ShippingAddressCard'

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

// Form data type for clarity
interface FormData {
    name: string;
    phone: string;
    email: string;
    district: string;
    upazila: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
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

    // ── Address edit state ─────────────────────────────────────────────────────
    // true  = show InfoForm (editing)
    // false = show ShippingAddressCard (confirmed)
    const [isEditingAddress, setIsEditingAddress] = useState(true)
    const [isSavingAddress, setIsSavingAddress] = useState(false)

    const [formData, setFormData] = useState<FormData>({
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
    const { upazilas } = useUpazilas(formData.district)

    const [apiDeliveryCharges, setApiDeliveryCharges] = useState<any[]>([])

    useEffect(() => {
        fetch('/api/v1/delivery-charge', {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        })
        .then(r => r.json())
        .then(data => { if (data?.data && Array.isArray(data.data)) setApiDeliveryCharges(data.data) })
        .catch(err => console.error("Failed to fetch dynamic delivery charges", err))
    }, [])

    const matchedCharge = apiDeliveryCharges.find(c => c.districtName === formData.district)
    const baseDistrictCharge = matchedCharge
        ? matchedCharge.deliveryCharge
        : (formData.district ? 130 : 0)

    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const [successOrderId, setSuccessOrderId] = useState('')
    const [errorModalOpen, setErrorModalOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [lastPaymentMethod, setLastPaymentMethod] = useState<'cod' | 'card'>('cod')
    const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)

    const [enrichedCartItems, setEnrichedCartItems] = useState<CartItem[]>(cartItems)
    const isFetchedRef = useRef(false)

    // ── Enrich cart with shipping costs ───────────────────────────────────────

    useEffect(() => {
        const fetchLatestProductDetails = async () => {
            if (cartItems.length === 0 || isFetchedRef.current) return
            try {
                const updatedItems = await Promise.all(cartItems.map(async (item) => {
                    try {
                        const res = await axios.get(`/api/v1/product/${item.product.id}`)
                        if (res.data?.success && res.data?.data) {
                            return { ...item, product: { ...item.product, shippingCost: res.data.data.shippingCost || 0 } }
                        }
                        return item
                    } catch { return item }
                }))
                setEnrichedCartItems(updatedItems)
                isFetchedRef.current = true
            } catch (error) {
                console.error("Failed to refresh cart items", error)
            }
        }
        fetchLatestProductDetails()
    }, [cartItems.length])

    // ── Fetch user profile ────────────────────────────────────────────────────

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setProfileLoading(true)
                if (!session?.user) { setProfileLoading(false); return }
                const userLike = (session?.user ?? {}) as { id?: string; _id?: string }
                const userId = userLike.id || userLike._id
                if (!userId) { setProfileLoading(false); return }

                const response = await axios.get('/api/v1/profile/me', {
                    headers: { 'x-user-id': userId }
                })
                if (response.data.success && response.data.data) {
                    const profile: UserProfile = response.data.data
                    setUserProfile(profile)

                    // ✅ Pre-fill formData from profile
                    const prefilledForm: FormData = {
                        name: profile.name || '',
                        phone: profile.phoneNumber || '',
                        email: profile.email || '',
                        address: profile.address || '',
                        city: 'Dhaka',
                        postalCode: '1000',
                        country: 'Bangladesh',
                        district: '',
                        upazila: '',
                    }
                    setFormData(prefilledForm)

                    // ✅ If profile has address → show card (not form)
                    //    If no address → show form so user fills it
                    setIsEditingAddress(!profile.address)
                }
            } catch (error) {
                console.error('Error fetching user profile:', error)
            } finally {
                setProfileLoading(false)
            }
        }
        fetchUserProfile()
    }, [session])

    // ── Confirm address (card → form → card) ─────────────────────────────────

    const handleConfirmAddress = async () => {
        // Validate required fields
        if (!formData.name.trim()) { toast.error('Name is required'); return }
        if (!formData.phone.trim()) { toast.error('Phone number is required'); return }
        if (!formData.address.trim()) { toast.error('Street address is required'); return }
        if (!formData.district) { toast.error('Please select a district'); return }

        setIsSavingAddress(true)
        try {
            // ✅ Save updated address back to user profile (no new API needed)
            if (userProfile?._id) {
                const fullAddress = [formData.address, formData.upazila, formData.district]
                    .filter(Boolean).join(', ')

                await axios.patch(
                    '/api/v1/profile/me',
                    { address: fullAddress },
                    { headers: { 'x-user-id': userProfile._id } }
                )

                // Update local userProfile so card shows correctly
                setUserProfile(prev => prev ? { ...prev, address: fullAddress } : prev)
            }
        } catch (err) {
            // Non-critical: even if save fails, we can continue with checkout
            console.warn('Could not save address to profile:', err)
        } finally {
            setIsSavingAddress(false)
        }

        // ✅ Switch back to card view
        setIsEditingAddress(false)
        toast.success('Address confirmed!')
    }

    // ── Calculations ──────────────────────────────────────────────────────────

    const subtotal = enrichedCartItems.reduce(
        (sum, item) => sum + (item.product.price * item.product.quantity), 0
    )
    const totalSavings = enrichedCartItems.reduce(
        (sum, item) => sum + ((item.product.originalPrice - item.product.price) * item.product.quantity), 0
    )
    const totalItems = enrichedCartItems.reduce(
        (sum, item) => sum + item.product.quantity, 0
    )

    const calculateTotalDeliveryCharge = () => {
        const customChargeTotal = enrichedCartItems.reduce(
            (sum, item) => sum + ((item.product.shippingCost || 0) * item.product.quantity), 0
        )
        return customChargeTotal > 0 ? customChargeTotal : baseDistrictCharge
    }
    const finalDeliveryCharge = calculateTotalDeliveryCharge()

    const calculateCouponDiscount = (): number => {
        if (!appliedCoupon) return 0
        const typeLower = appliedCoupon.type.toLowerCase().trim()
        const isPercentage = typeLower === 'percentage' || typeLower.includes('percentage')
        if (isPercentage) {
            return Math.round((subtotal * appliedCoupon.value) / 100 * 100) / 100
        }
        return Math.min(appliedCoupon.value, subtotal)
    }
    const couponDiscount = calculateCouponDiscount()

    // ── Modals ────────────────────────────────────────────────────────────────

    const showSuccessModal = async (orderId: string) => {
        setSuccessOrderId(orderId)
        setSuccessModalOpen(true)
        setErrorModalOpen(false)
        if (typeof window !== 'undefined') sessionStorage.removeItem('buyNowProductId')
        if (userProfile?._id) {
            try { await axios.delete(`/api/v1/add-to-cart/get-cart/${userProfile._id}`) }
            catch (error) { console.error('Error clearing cart:', error) }
        }
    }

    const showError = (message: string) => {
        setErrorMessage(message)
        setErrorModalOpen(true)
        setSuccessModalOpen(false)
    }

    // ── Order ─────────────────────────────────────────────────────────────────

    const validateCODOrder = (paymentMethod: 'cod' | 'card') => {
        const errors: string[] = []
        if (!session?.user) errors.push('User must be logged in to place order')
        if (!userProfile?._id) errors.push('User profile information is missing.')
        if (isEditingAddress) errors.push('Please confirm your shipping address first')
        if (!formData.name || !formData.phone || !formData.address || !formData.district || !formData.city || !formData.postalCode) {
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
            if (productData?.vendorStoreId && isValidObjectId(productData.vendorStoreId)) return productData.vendorStoreId
            if (productData?.vendorId && isValidObjectId(productData.vendorId)) return productData.vendorId
            return undefined
        } catch { return undefined }
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
                    const placedOrder = Array.isArray(placed) ? placed[0] : placed
                    const orderId = placedOrder?.orderId || placedOrder?._id
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
                const primaryOrder = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data
                const currentOrderId = primaryOrder.orderId

                if (selectedDelivery === 'steadfast') {
                    try {
                        const steadfastResponse = await axios.post('/api/v1/product-order/steadfast', { orderId: currentOrderId })
                        if (steadfastResponse.data.success) {
                            localStorage.setItem('lastOrderTracking', JSON.stringify({
                                orderId: currentOrderId,
                                trackingId: steadfastResponse.data.data.trackingCode,
                                trackingUrl: `https://portal.packzy.com/track/${steadfastResponse.data.data.trackingCode}`,
                            }))
                        }
                    } catch (error) { console.error('Courier sync failed:', error) }
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

    // ── Guards ────────────────────────────────────────────────────────────────

    if (profileLoading || geoLoading) return <ShoppingInfoSkeleton />

    if (!userProfile && session?.user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-center">
                    <p className="font-bold">Profile Information Required</p>
                    <p className="text-sm">Please complete your profile.</p>
                </div>
            </div>
        )
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
                <div className="space-y-4 lg:col-span-2 lg:space-y-6">

                    {/* ═══════════════════════════════════════════════════════
                        SHIPPING ADDRESS SECTION
                        — Card view  : address confirmed, shows summary
                        — Edit view  : InfoForm for full address input
                    ═══════════════════════════════════════════════════════ */}

                    {!isEditingAddress ? (
                        /* ── Confirmed: show Daraz-style address card ── */
                        <ShippingAddressCard
                            name={formData.name}
                            phone={formData.phone}
                            email={formData.email}
                            address={formData.address}
                            district={formData.district}
                            upazila={formData.upazila}
                            city={formData.city}
                            postalCode={formData.postalCode}
                            onEdit={() => setIsEditingAddress(true)}
                        />
                    ) : (
                        /* ── Editing: show full form ── */
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            {/* Form header */}
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
                                <h2 className="text-sm font-semibold text-gray-800">
                                    Shipping & Billing
                                </h2>
                                {/* If already has address, allow collapsing back */}
                                {formData.address && (
                                    <button
                                        onClick={() => setIsEditingAddress(false)}
                                        className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                                    >
                                        <ChevronUp className="w-3.5 h-3.5" />
                                        Collapse
                                    </button>
                                )}
                            </div>

                            <div className="p-5">
                                <InfoForm
                                    onFormDataChange={setFormData}
                                    initialData={{
                                        name: formData.name || userProfile?.name || '',
                                        phone: formData.phone || userProfile?.phoneNumber || '',
                                        email: formData.email || userProfile?.email || '',
                                        address: formData.address || userProfile?.address || '',
                                        city: formData.city || 'Dhaka',
                                        postalCode: formData.postalCode || '1000',
                                        country: formData.country || 'Bangladesh',
                                    }}
                                    districts={geoData.allDistricts}
                                    upazilas={upazilas}
                                />
                            </div>

                            {/* ✅ Confirm Address Button */}
                            <div className="px-5 pb-5">
                                <button
                                    onClick={handleConfirmAddress}
                                    disabled={isSavingAddress}
                                    className="
                                        w-full flex items-center justify-center gap-2
                                        py-3 px-6 rounded-lg
                                        bg-[#00005E] hover:bg-[#0000a0] active:bg-[#000044]
                                        text-white text-sm font-semibold
                                        transition-colors duration-150
                                        disabled:opacity-60 disabled:cursor-not-allowed
                                    "
                                >
                                    {isSavingAddress ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            Confirm Address & Continue
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ── Delivery Options ─────────────────────────────── */}
                    <DeliveryOptions
                        selectedDelivery={selectedDelivery}
                        onDeliveryChange={setSelectedDelivery}
                    />

                    {/* ── Items ────────────────────────────────────────── */}
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

                {/* ── Order Summary ─────────────────────────────────── */}
                <div className="lg:col-span-1">
                    <OrderSummary
                        subtotal={subtotal}
                        discount={totalSavings}
                        shipping={finalDeliveryCharge}
                        onPlaceOrder={handlePlaceOrder}
                        selectedDelivery={selectedDelivery}
                        appliedCoupon={appliedCoupon}
                        onCouponApplied={setAppliedCoupon}
                        totalItems={totalItems}
                    />
                </div>
            </div>

            <OrderSuccessModal
                open={successModalOpen}
                onOpenChange={() => setSuccessModalOpen(false)}
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