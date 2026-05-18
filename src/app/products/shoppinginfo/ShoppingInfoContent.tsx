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
    address: string;
    profilePicture?: string;
    isVerified: boolean;
    isActive: boolean;
    role: string;
    rewardPoints: number;
}

interface FormData {
    name: string;
    phone: string;
    email: string;
    district: string;
    upazila: string;
    city: string;
    postalCode: string;
    country: string;
    address: string;
}

const EMPTY_FORM: FormData = {
    name: '', phone: '', email: '',
    district: '', upazila: '',
    city: 'Dhaka', postalCode: '1000', country: 'Bangladesh',
    address: '',
}

const isValidObjectId = (id?: string) => !!id && /^[0-9a-fA-F]{24}$/.test(id)

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

    const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>('standard')
    const [userProfile, setUserProfile]   = useState<UserProfile | null>(null)
    const [profileLoading, setProfileLoading] = useState(true)

    const [isEditingAddress, setIsEditingAddress] = useState(true)
    const [isSavingAddress, setIsSavingAddress]   = useState(false)
    const [formData, setFormData] = useState<FormData>(EMPTY_FORM)
    const [formKey, setFormKey] = useState(0)

    const structuredAddress: AddressJSON = useMemo(() => ({
        street:     formData.address,
        district:   formData.district,
        upazila:    formData.upazila,
        city:       formData.city,
        postalCode: formData.postalCode,
        country:    formData.country,
    }), [formData])

    const { geoData, geoLoading } = useGeoData()
    const { upazilas } = useUpazilas(formData.district)

    const [apiDeliveryCharges, setApiDeliveryCharges] = useState<any[]>([])

    useEffect(() => {
        fetch('/api/v1/delivery-charge', {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache', Pragma: 'no-cache' }
        })
        .then(r => r.json())
        .then(d => { if (Array.isArray(d?.data)) setApiDeliveryCharges(d.data) })
        .catch(() => {})
    }, [])

    const matchedCharge = apiDeliveryCharges.find(c => c.districtName === formData.district)
    const baseDistrictCharge = matchedCharge ? matchedCharge.deliveryCharge : (formData.district ? 130 : 0)

    const [successModalOpen, setSuccessModalOpen] = useState(false)
    const [successOrderId, setSuccessOrderId]     = useState('')
    const [errorModalOpen, setErrorModalOpen]     = useState(false)
    const [errorMessage, setErrorMessage]         = useState('')
    const [lastPaymentMethod, setLastPaymentMethod] = useState<'cod' | 'card'>('cod')
    const [appliedCoupon, setAppliedCoupon]       = useState<AppliedCoupon | null>(null)

    const [enrichedCartItems, setEnrichedCartItems] = useState<CartItem[]>(cartItems)
    const isFetchedRef = useRef(false)

    // 🔥 FIX: কার্ট আপডেট হলে সিঙ্ক করার লজিক
    useEffect(() => {
        if (cartItems.length === 0) {
            setEnrichedCartItems([]);
            return;
        }

        // যদি আগে শিপিং কস্ট ফেচ করা না থাকে, তাহলে ফেচ করবে
        if (!isFetchedRef.current) {
            Promise.all(cartItems.map(async (item) => {
                try {
                    const res = await axios.get(`/api/v1/product/${item.product.id}`)
                    if (res.data?.success && res.data?.data) {
                        return { ...item, product: { ...item.product, shippingCost: res.data.data.shippingCost || 0 } }
                    }
                } catch { /* keep original */ }
                return item
            }))
            .then(updated => { 
                setEnrichedCartItems(updated); 
                isFetchedRef.current = true; 
            })
            .catch(console.error)
        } else {
            // 🔥 যদি আগে ফেচ করা থাকে, তাহলে শুধু Quantity এবং মেইন ডাটা সিঙ্ক করবে (শিপিং কস্ট রেখে দিবে)
            setEnrichedCartItems(current => {
                return cartItems.map(incomingItem => {
                    const existing = current.find(e => e.id === incomingItem.id);
                    return {
                        ...incomingItem,
                        product: {
                            ...incomingItem.product,
                            shippingCost: existing?.product?.shippingCost || 0
                        }
                    };
                });
            });
        }
    }, [cartItems])

    // ✅ Load Profile Directly from Database (No Local Storage)
    useEffect(() => {
        const load = async () => {
            try {
                setProfileLoading(true)
                if (!session?.user) return

                const userLike = session.user as { id?: string; _id?: string }
                const userId = userLike.id || userLike._id
                if (!userId) return

                const res = await axios.get('/api/v1/profile/me', {
                    headers: { 'x-user-id': userId }
                })
                
                if (res.data.success && res.data.data) {
                    const profile: UserProfile = res.data.data;
                    setUserProfile(profile)

                    const parsed = parseAddress(profile.address)
                    const hasDbAddress = !!parsed.street.trim() && !!parsed.district.trim()

                    const filled: FormData = {
                        name:       profile.name        || '',
                        phone:      profile.phoneNumber || '',
                        email:      profile.email       || '',
                        address:    parsed.street,
                        district:   parsed.district,
                        upazila:    parsed.upazila,
                        city:       hasDbAddress ? parsed.city : 'Dhaka',
                        postalCode: hasDbAddress ? parsed.postalCode : '1000',
                        country:    hasDbAddress ? parsed.country : 'Bangladesh',
                    }

                    setFormData(filled)
                    setFormKey(k => k + 1) 

                    const hasFullAddress = !!filled.address.trim() && !!filled.district.trim() && !!filled.phone.trim()
                    setIsEditingAddress(!hasFullAddress)
                }

            } catch (err) {
                console.error('Profile load error:', err)
            } finally {
                setProfileLoading(false)
            }
        }
        load()
    }, [session])

    // ✅ Confirm and Save Address strictly to Database
    const handleConfirmAddress = async () => {
        if (!formData.name.trim())    { toast.error('Name is required');           return }
        if (!formData.phone.trim())   { toast.error('Phone number is required');   return }
        if (!formData.district)       { toast.error('Please select a District');   return }
        if (!formData.upazila)        { toast.error('Please select an Upazila');   return }
        if (!formData.address.trim()) { toast.error('Street address is required'); return }

        if (!userProfile?._id) {
            toast.error('User profile missing. Please reload the page.')
            return
        }

        setIsSavingAddress(true)

        try {
            const addressJSON = serializeAddress(structuredAddress)
            
            const res = await axios.patch(
                '/api/v1/profile/address',
                { address: addressJSON, phone: formData.phone, name: formData.name },
                { headers: { 'x-user-id': userProfile._id } }
            )

            if (res.data.success) {
                setUserProfile(prev => prev ? { ...prev, address: addressJSON, phoneNumber: formData.phone, name: formData.name } : prev)
                setIsEditingAddress(false)
                toast.success('Address saved to database successfully!')
            } else {
                toast.error(res.data.message || 'Failed to save address.')
            }
        } catch (err: any) {
            console.error('API Error:', err);
            toast.error('Network Error: Failed to save address to database. Please check your API.')
        } finally {
            setIsSavingAddress(false)
        }
    }

    const subtotal = enrichedCartItems.reduce((s, i) => s + i.product.price * i.product.quantity, 0)
    const totalSavings = enrichedCartItems.reduce((s, i) => s + (i.product.originalPrice - i.product.price) * i.product.quantity, 0)
    const totalItems = enrichedCartItems.reduce((s, i) => s + i.product.quantity, 0)

    const finalDeliveryCharge = (() => {
        const custom = enrichedCartItems.reduce((s, i) => s + (i.product.shippingCost || 0) * i.product.quantity, 0)
        return custom > 0 ? custom : baseDistrictCharge
    })()

    const couponDiscount = (() => {
        if (!appliedCoupon) return 0
        const pct = appliedCoupon.type.toLowerCase().includes('percentage')
        return pct ? Math.round(subtotal * appliedCoupon.value / 100 * 100) / 100 : Math.min(appliedCoupon.value, subtotal)
    })()

    const showSuccessModal = async (orderId: string) => {
        setSuccessOrderId(orderId); setSuccessModalOpen(true); setErrorModalOpen(false)
        if (typeof window !== 'undefined') sessionStorage.removeItem('buyNowProductId')
        if (userProfile?._id) {
            try { await axios.delete(`/api/v1/add-to-cart/get-cart/${userProfile._id}`) }
            catch (e) {}
        }
    }
    
    const showError = (msg: string) => {
        setErrorMessage(msg); setErrorModalOpen(true); setSuccessModalOpen(false)
    }

    const validateOrder = (method: 'cod' | 'card') => {
        const errs: string[] = []
        if (!session?.user)    errs.push('Please log in to place an order')
        if (isEditingAddress)  errs.push('Please confirm your shipping address first')
        if (!formData.name || !formData.phone || !formData.address || !formData.district || !formData.upazila)
            errs.push('Please fill in all required delivery fields')
        if (method === 'cod' && enrichedCartItems.length === 0)
            errs.push('Your cart is empty')
        return errs
    }

    const handlePlaceOrder = async (paymentMethod: 'cod' | 'card') => {
        try {
            setLastPaymentMethod(paymentMethod)
            const errs = validateOrder(paymentMethod)
            if (errs.length > 0) { showError(errs.join('\n')); return }

            let resolvedStoreId = undefined;
            try {
                const id = enrichedCartItems[0]?.product.id
                if (id) {
                    const { data } = await axios.get(`/api/v1/product/${id}`)
                    const p = data?.data
                    if (p?.vendorStoreId && isValidObjectId(p.vendorStoreId)) resolvedStoreId = p.vendorStoreId
                    else if (p?.vendorId && isValidObjectId(p.vendorId)) resolvedStoreId = p.vendorId
                }
            } catch {}

            const addressDetail = [formData.address, formData.upazila, formData.district].filter(Boolean).join(', ')

            const orderData = {
                userId: userProfile!._id,
                ...(resolvedStoreId ? { storeId: resolvedStoreId } : {}),
                deliveryMethodId:      selectedDelivery,
                shippingName:          formData.name,
                shippingPhone:         formData.phone,
                shippingEmail:         formData.email,
                shippingStreetAddress: formData.address,
                shippingCity:          formData.city,
                shippingDistrict:      formData.district,
                shippingPostalCode:    formData.postalCode,
                shippingCountry:       formData.country,
                addressDetails:        addressDetail,
                deliveryCharge:        finalDeliveryCharge,
                totalAmount:           subtotal - couponDiscount + finalDeliveryCharge,
                paymentStatus:         'Pending' as const,
                orderStatus:           'Pending' as const,
                orderForm:             'Website' as const,
                orderDate:             new Date(),
                deliveryDate:          new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                products:              enrichedCartItems.map(item => ({
                    productId:     item.product.id,
                    vendorId:      item.id,
                    quantity:      item.product.quantity,
                    unitPrice:     item.product.originalPrice,
                    discountPrice: item.product.price,
                    size:          item.product.size,
                    color:         item.product.color,
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
                const primary  = Array.isArray(data.data) ? data.data[0] : data.data
                const orderId  = primary.orderId
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
                    } catch (e) {}
                }
                showSuccessModal(orderId)
            } else {
                showError(data.message || 'Order failed')
            }
        } catch (err) {
            showError('Failed to place order. Please try again.')
        }
    }

    if (profileLoading || geoLoading) return <ShoppingInfoSkeleton />

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
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
                <div className="space-y-4 lg:col-span-2 lg:space-y-6">

                    {!isEditingAddress ? (
                        <ShippingAddressCard
                            name={formData.name}
                            phone={formData.phone}
                            email={formData.email}
                            address={structuredAddress}
                            onEdit={() => setIsEditingAddress(true)}
                        />
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/60">
                                <h2 className="text-sm font-semibold text-gray-800">Shipping & Billing</h2>
                                {structuredAddress.street && structuredAddress.district && (
                                    <button
                                        onClick={() => setIsEditingAddress(false)}
                                        className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
                                    >
                                        <ChevronUp className="w-3.5 h-3.5" /> Collapse
                                    </button>
                                )}
                            </div>

                            <div className="p-5">
                                <InfoForm
                                    key={formKey}
                                    onFormDataChange={setFormData}
                                    initialData={{
                                        name:       formData.name,
                                        phone:      formData.phone,
                                        email:      formData.email,
                                        address:    formData.address,
                                        district:   formData.district,  
                                        upazila:    formData.upazila,    
                                        city:       formData.city,
                                        postalCode: formData.postalCode,
                                        country:    formData.country,
                                    }}
                                    districts={geoData.allDistricts}
                                    upazilas={upazilas}
                                />
                            </div>

                            <div className="px-5 pb-5">
                                <button
                                    onClick={handleConfirmAddress}
                                    disabled={isSavingAddress}
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#00005E] hover:bg-[#0000a0] active:bg-[#000044] text-white text-sm font-semibold transition-colors duration-150"
                                >
                                    {isSavingAddress ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                            Saving to database...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" /> Confirm Address & Continue
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

            <OrderSuccessModal open={successModalOpen} onOpenChange={() => setSuccessModalOpen(false)} orderId={successOrderId} />
            <OrderErrorModal open={errorModalOpen} onOpenChange={setErrorModalOpen} errorMessage={errorMessage} onRetry={() => handlePlaceOrder(lastPaymentMethod)} />
        </div>
    )
}