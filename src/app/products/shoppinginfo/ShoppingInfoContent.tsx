"use client"

import { useState, useEffect, useRef, useMemo } from 'react'
import OrderSummary from './components/OrderSummary'
import DeliveryOptions, { DeliveryOption } from './components/DeliveryOptions'
import ItemsList from './components/ItemsList'
import CheckoutItemsTable from './components/CheckoutItemsTable'
import OrderSuccessModal from './components/OrderSuccessModal'
import OrderErrorModal from './components/OrderErrorModal'
import InfoForm from './components/InfoForm'
import ShoppingInfoSkeleton from './components/ShoppingInfoSkeleton'
import ShippingAddressCard from './components/ShippingAddressCard'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'sonner'
import { AppliedCoupon } from './components/CouponSection'
import { useGeoData } from '@/hooks/useGeoData'
import { useUpazilas } from '@/hooks/useUpazilas'
import { placeOrder, initiateSSLCommerzPayment } from './utils/payment'
import { CheckCircle2, ChevronUp } from 'lucide-react'
import { AddressJSON, parseAddress, serializeAddress } from './components/addressHelpers'

// ─── Types ────────────────────────────────────────────────────────────────────

export type CartItem = {
    id: string;
    seller: { name: string; verified: boolean };
    product: {
        id: string; name: string; image: string;
        size: string; color: string;
        price: number; originalPrice: number; quantity: number;
        shippingCost?: number;
    };
};

interface UserProfile {
    _id: string;
    name: string;
    email?: string;
    phoneNumber?: string;
    address: string;        // stored as JSON string
    profilePicture?: string;
    isVerified: boolean;
    isActive: boolean;
    role: string;
    rewardPoints: number;
}

/** Full flat form state used internally */
interface FormData {
    name: string;
    phone: string;
    email: string;
    // Location
    district: string;
    upazila: string;
    city: string;
    postalCode: string;
    country: string;
    // Street
    address: string;
}

const isValidObjectId = (id: string | undefined): boolean =>
    !!id && /^[0-9a-fA-F]{24}$/.test(id)

// ─── Component ────────────────────────────────────────────────────────────────

export default function ShoppingInfoContent({
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
}: {
  cartItems: CartItem[];
  onUpdateQuantity?: (itemId: string, newQuantity: number) => void;
  onRemoveItem?: (itemId: string) => void;
}) {
    const { data: session } = useSession()

    // ── State ─────────────────────────────────────────────────────────────────

    const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>('standard')
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
    const [profileLoading, setProfileLoading] = useState(true)

    // true  = show InfoForm (editing mode)
    // false = show ShippingAddressCard (confirmed mode)
    const [isEditingAddress, setIsEditingAddress] = useState(true)
    const [isSavingAddress, setIsSavingAddress] = useState(false)

    /**
     * Flat form state.
     * `address` = street/detail address (NOT the JSON blob).
     * district, upazila etc. are separate fields.
     */
    const [formData, setFormData] = useState<FormData>({
        name: '', phone: '', email: '',
        district: '', upazila: '',
        city: 'Dhaka', postalCode: '1000', country: 'Bangladesh',
        address: '',
    })

    // Structured address derived from formData (used by card + serialisation)
    const structuredAddress: AddressJSON = useMemo(() => ({
        street:     formData.address,
        district:   formData.district,
        upazila:    formData.upazila,
        city:       formData.city,
        postalCode: formData.postalCode,
        country:    formData.country,
    }), [formData])

    const { geoData, geoLoading } = useGeoData()
    const { upazilas } = useUpazilas(formData.district)   // reactive to district

    // ── Delivery charges ──────────────────────────────────────────────────────

    const [apiDeliveryCharges, setApiDeliveryCharges] = useState<any[]>([])

    useEffect(() => {
        fetch('/api/v1/delivery-charge', {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' }
        })
        .then(r => r.json())
        .then(data => { if (Array.isArray(data?.data)) setApiDeliveryCharges(data.data) })
        .catch(err => console.error('Failed to fetch delivery charges', err))
    }, [])

    const matchedCharge = apiDeliveryCharges.find(c => c.districtName === formData.district)
    const baseDistrictCharge = matchedCharge
        ? matchedCharge.deliveryCharge
        : (formData.district ? 130 : 0)

    // ── Order UI state ────────────────────────────────────────────────────────

    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const [successOrderId, setSuccessOrderId] = useState('')
    const [errorModalOpen, setErrorModalOpen] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [lastPaymentMethod, setLastPaymentMethod] = useState<'cod' | 'card'>('cod')
    const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null)

    // ── Enrich cart with shippingCost ─────────────────────────────────────────

    const [enrichedCartItems, setEnrichedCartItems] = useState<CartItem[]>(cartItems)
    const isFetchedRef = useRef(false)

    useEffect(() => {
        if (cartItems.length === 0 || isFetchedRef.current) return
        Promise.all(cartItems.map(async (item) => {
            try {
                const res = await axios.get(`/api/v1/product/${item.product.id}`)
                if (res.data?.success && res.data?.data) {
                    return { ...item, product: { ...item.product, shippingCost: res.data.data.shippingCost || 0 } }
                }
                return item
            } catch { return item }
        })).then(updated => { setEnrichedCartItems(updated); isFetchedRef.current = true })
          .catch(err => console.error('Failed to refresh cart items', err))
    }, [cartItems.length])

    // ── Load user profile + parse JSON address ────────────────────────────────

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setProfileLoading(true)
                if (!session?.user) return

                const userLike = session.user as { id?: string; _id?: string }
                const userId = userLike.id || userLike._id
                if (!userId) return

                const res = await axios.get('/api/v1/profile/me', {
                    headers: { 'x-user-id': userId }
                })
                if (!res.data.success || !res.data.data) return

                const profile: UserProfile = res.data.data
                setUserProfile(profile)

                // ✅ Parse JSON address → get all fields including district & upazila
                const parsed = parseAddress(profile.address)

                setFormData({
                    name:       profile.name        || '',
                    phone:      profile.phoneNumber || '',
                    email:      profile.email       || '',
                    // ✅ All location fields restored from JSON
                    address:    parsed.street,
                    district:   parsed.district,
                    upazila:    parsed.upazila,
                    city:       parsed.city,
                    postalCode: parsed.postalCode,
                    country:    parsed.country,
                })

                // ✅ Show card if address + district saved, else show form
                const hasFullAddress = !!parsed.street && !!parsed.district
                setIsEditingAddress(!hasFullAddress)

            } catch (err) {
                console.error('Error fetching user profile:', err)
            } finally {
                setProfileLoading(false)
            }
        }
        fetchUserProfile()
    }, [session])

    // ── Confirm & save address ────────────────────────────────────────────────

    const handleConfirmAddress = async () => {
        if (!formData.name.trim())    { toast.error('Name is required');          return }
        if (!formData.phone.trim())   { toast.error('Phone number is required');  return }
        if (!formData.district)       { toast.error('Please select a district');  return }
        if (!formData.upazila)        { toast.error('Please select an upazila');  return }
        if (!formData.address.trim()) { toast.error('Street address is required'); return }

        setIsSavingAddress(true)
        try {
            if (userProfile?._id) {
                // ✅ Save ALL fields as JSON — district & upazila included
                const addressJSON = serializeAddress(structuredAddress)

                await axios.patch(
                    '/api/v1/profile/me',
                    { address: addressJSON },
                    { headers: { 'x-user-id': userProfile._id } }
                )
                // Update local profile so card reflects new address immediately
                setUserProfile(prev => prev ? { ...prev, address: addressJSON } : prev)
            }
        } catch (err) {
            console.warn('Address save to profile failed (continuing anyway):', err)
        } finally {
            setIsSavingAddress(false)
        }

        setIsEditingAddress(false)
        toast.success('Address saved & confirmed!')
    }

    // ── Calculations ──────────────────────────────────────────────────────────

    const subtotal = enrichedCartItems.reduce(
        (s, i) => s + i.product.price * i.product.quantity, 0)
    const totalSavings = enrichedCartItems.reduce(
        (s, i) => s + (i.product.originalPrice - i.product.price) * i.product.quantity, 0)
    const totalItems = enrichedCartItems.reduce(
        (s, i) => s + i.product.quantity, 0)

    const finalDeliveryCharge = (() => {
        const custom = enrichedCartItems.reduce(
            (s, i) => s + (i.product.shippingCost || 0) * i.product.quantity, 0)
        return custom > 0 ? custom : baseDistrictCharge
    })()

    const couponDiscount = (() => {
        if (!appliedCoupon) return 0
        const pct = appliedCoupon.type.toLowerCase().includes('percentage')
        return pct
            ? Math.round((subtotal * appliedCoupon.value / 100) * 100) / 100
            : Math.min(appliedCoupon.value, subtotal)
    })()

    // ── Modals ────────────────────────────────────────────────────────────────

    const showSuccessModal = async (orderId: string) => {
        setSuccessOrderId(orderId); setSuccessModalOpen(true); setErrorModalOpen(false)
        if (typeof window !== 'undefined') sessionStorage.removeItem('buyNowProductId')
        if (userProfile?._id) {
            try { await axios.delete(`/api/v1/add-to-cart/get-cart/${userProfile._id}`) }
            catch (e) { console.error('Clear cart error:', e) }
        }
    }
    const showError = (msg: string) => {
        setErrorMessage(msg); setErrorModalOpen(true); setSuccessModalOpen(false)
    }

    // ── Place order ───────────────────────────────────────────────────────────

    const validateOrder = (method: 'cod' | 'card') => {
        const errs: string[] = []
        if (!session?.user)      errs.push('Please log in to place an order')
        if (!userProfile?._id)   errs.push('User profile is missing')
        if (isEditingAddress)    errs.push('Please confirm your shipping address first')
        if (!formData.name || !formData.phone || !formData.address || !formData.district || !formData.upazila)
            errs.push('Please fill in all required delivery fields')
        if (method === 'cod' && enrichedCartItems.length === 0)
            errs.push('Your cart is empty')
        return errs
    }

    const resolveStoreId = async (): Promise<string | undefined> => {
        try {
            const id = enrichedCartItems[0]?.product.id
            if (!id) return undefined
            const { data } = await axios.get(`/api/v1/product/${id}`)
            const p = data?.data
            if (p?.vendorStoreId && isValidObjectId(p.vendorStoreId)) return p.vendorStoreId
            if (p?.vendorId       && isValidObjectId(p.vendorId))       return p.vendorId
        } catch { /* ignore */ }
        return undefined
    }

    const handlePlaceOrder = async (paymentMethod: 'cod' | 'card') => {
        try {
            setLastPaymentMethod(paymentMethod)
            const errs = validateOrder(paymentMethod)
            if (errs.length > 0) { showError(errs.join(', ')); return }

            const resolvedStoreId = await resolveStoreId()
            const addressDetail = [formData.address, formData.upazila, formData.district]
                .filter(Boolean).join(', ')

            const orderData = {
                userId: userProfile!._id,
                ...(resolvedStoreId ? { storeId: resolvedStoreId } : {}),
                deliveryMethodId:     selectedDelivery,
                shippingName:         formData.name,
                shippingPhone:        formData.phone,
                shippingEmail:        formData.email,
                shippingStreetAddress: formData.address,
                shippingCity:         formData.city,
                shippingDistrict:     formData.district,
                shippingPostalCode:   formData.postalCode,
                shippingCountry:      formData.country,
                addressDetails:       addressDetail,
                deliveryCharge:       finalDeliveryCharge,
                totalAmount:          subtotal - couponDiscount + finalDeliveryCharge,
                paymentStatus:        'Pending' as const,
                orderStatus:          'Pending' as const,
                orderForm:            'Website' as const,
                orderDate:            new Date(),
                deliveryDate:         new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                products:             enrichedCartItems.map(item => ({
                    productId:    item.product.id,
                    vendorId:     item.id,
                    quantity:     item.product.quantity,
                    unitPrice:    item.product.originalPrice,
                    discountPrice: item.product.price,
                    size:         item.product.size,
                    color:        item.product.color,
                })),
                couponId: appliedCoupon?._id || undefined,
            }

            if (paymentMethod === 'card') {
                toast.loading('Redirecting to payment gateway...', { id: 'pay' })
                try {
                    const placed = await placeOrder(orderData)
                    const o = Array.isArray(placed) ? placed[0] : placed
                    const orderId = o?.orderId || o?._id
                    if (!orderId) throw new Error('Order ID missing')
                    const url = await initiateSSLCommerzPayment(orderId)
                    toast.dismiss('pay')
                    window.location.href = url
                } catch (err: any) {
                    toast.dismiss('pay')
                    showError(err?.message || 'Failed to initialize payment.')
                }
                return
            }

            const { data } = await axios.post('/api/v1/product-order', orderData)
            if (data.success) {
                const primary = Array.isArray(data.data) ? data.data[0] : data.data
                const orderId = primary.orderId
                if (selectedDelivery === 'steadfast') {
                    try {
                        const sf = await axios.post('/api/v1/product-order/steadfast', { orderId })
                        if (sf.data.success) {
                            localStorage.setItem('lastOrderTracking', JSON.stringify({
                                orderId,
                                trackingId:  sf.data.data.trackingCode,
                                trackingUrl: `https://portal.packzy.com/track/${sf.data.data.trackingCode}`,
                            }))
                        }
                    } catch (e) { console.error('Courier sync failed:', e) }
                }
                showSuccessModal(orderId)
            } else {
                showError(data.message || 'Order failed')
            }
        } catch (err) {
            console.error('Order error:', err)
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
                    <p className="text-sm">Please complete your profile first.</p>
                </div>
            </div>
        )
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
                <div className="space-y-4 lg:col-span-2 lg:space-y-6">

                    {/* ══════════════════════════════════════════════════
                        SHIPPING ADDRESS
                    ══════════════════════════════════════════════════ */}
                    {!isEditingAddress ? (

                        /* ── Confirmed card ── */
                        <ShippingAddressCard
                            name={formData.name}
                            phone={formData.phone}
                            email={formData.email}
                            address={structuredAddress}
                            onEdit={() => setIsEditingAddress(true)}
                        />

                    ) : (

                        /* ── Edit form ── */
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
                                <h2 className="text-sm font-semibold text-gray-800">Shipping & Billing</h2>
                                {/* Collapse back if address already saved */}
                                {structuredAddress.street && structuredAddress.district && (
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
                                {/*
                                  ✅ Pass district + upazila in initialData so InfoForm
                                     can pre-select them on mount.
                                     InfoForm must read these from initialData for dropdowns.
                                */}
                                <InfoForm
                                    key={`${formData.district}-${formData.upazila}`} // force remount when location changes
                                    onFormDataChange={setFormData}
                                    initialData={{
                                        name:       formData.name,
                                        phone:      formData.phone,
                                        email:      formData.email,
                                        address:    formData.address,
                                        district:   formData.district,   // ✅ pre-fill district
                                        upazila:    formData.upazila,    // ✅ pre-fill upazila
                                        city:       formData.city,
                                        postalCode: formData.postalCode,
                                        country:    formData.country,
                                    }}
                                    districts={geoData.allDistricts}
                                    upazilas={upazilas}
                                />
                            </div>

                            {/* ✅ Confirm button */}
                            <div className="px-5 pb-5">
                                <button
                                    onClick={handleConfirmAddress}
                                    disabled={isSavingAddress}
                                    className="
                                        w-full flex items-center justify-center gap-2
                                        py-3 rounded-lg
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