'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast } from 'sonner';
import { useGeoData } from '@/hooks/useGeoData';
import { useDeliveryCharge } from '@/hooks/useDeliveryCharge';
import { useUpazilas } from '@/hooks/useUpazilas';
import DeliveryOptions, { DeliveryOption } from './DeliveryOptions';
import { AppliedCoupon } from './CouponSection';
import ShoppingInfoSkeleton from './ShoppingInfoSkeleton';
import InfoForm from './InfoForm';
import ItemsList from './ItemsList';
import OrderSummary from './OrderSummary';
import OrderSuccessModal from './OrderSuccessModal';
import OrderErrorModal from './OrderErrorModal';
import {
  placeOrder,
  initiateSSLCommerzPayment,
  extractOrderId,
  type CreateOrderPayload,
} from '@/app/products/shoppinginfo/utils/payment';

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
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
          <p className="font-bold">Error Loading Cart</p>
          <p className="text-sm">Please refresh the page and try again.</p>
        </div>
      </div>
    );
  }

  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>('standard');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    district: '',
    upazila: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Bangladesh',
  });
  const { data: session } = useSession();

  const { geoData, geoLoading } = useGeoData();
  const { deliveryCharge } = useDeliveryCharge(formData.district, formData.upazila);
  const { upazilas } = useUpazilas(formData.district);

  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState('');
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastPaymentMethod, setLastPaymentMethod] = useState<'cod' | 'card'>('cod');
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  // Add this alongside subtotal and totalSavings calculations
  const totalItems = cartItems.reduce((sum, item) => sum + (item?.product?.quantity || 0), 0);

  const subtotal = cartItems.reduce((sum, item) => {
    if (!item?.product?.price || !item?.product?.quantity) return sum;
    return sum + item.product.price * item.product.quantity;
  }, 0);

  const totalSavings = cartItems.reduce((sum, item) => {
    if (!item?.product?.originalPrice || !item?.product?.price || !item?.product?.quantity) return sum;
    return sum + (item.product.originalPrice - item.product.price) * item.product.quantity;
  }, 0);

  const calculateCouponDiscount = (): number => {
    if (!appliedCoupon) return 0;
    const typeLower = appliedCoupon.type.toLowerCase().trim();
    const isPercentage = typeLower === 'percentage' || typeLower.includes('percentage');
    if (isPercentage) {
      return Math.round((subtotal * appliedCoupon.value) / 100 * 100) / 100;
    }
    return Math.min(appliedCoupon.value, subtotal);
  };

  const couponDiscount = calculateCouponDiscount();
  const finalDeliveryCharge = deliveryCharge || 0;

  const showSuccessModal = async (orderId: string) => {
    setSuccessOrderId(orderId);
    setSuccessModalOpen(true);
    setErrorModalOpen(false);
    if (userProfile?._id) {
      try {
        await axios.delete(`/api/v1/add-to-cart/get-cart/${userProfile._id}`);
        localStorage.removeItem('cart');
      } catch (error) {
        console.error('Error clearing cart:', error);
      }
    }
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setErrorModalOpen(true);
    setSuccessModalOpen(false);
  };

  const handleSuccessModalClose = () => setSuccessModalOpen(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        if (!session?.user) return;
        const userLike = (session.user ?? {}) as { id?: string; _id?: string };
        const userId = userLike.id || userLike._id;
        if (!userId) return;
        const response = await axios.get('/api/v1/profile/me', {
          headers: { 'x-user-id': userId },
        });
        if (response.data.success && response.data.data) {
          setUserProfile(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };
    fetchUserProfile();
  }, [session]);

  const validateOrder = (): string[] => {
    const errors: string[] = [];
    if (!session?.user) errors.push('You must be logged in to place an order.');
    if (!userProfile?._id) errors.push('User profile is missing. Please complete your profile.');
    const requiredFields: (keyof typeof formData)[] = [
      'name', 'phone', 'email', 'district', 'upazila', 'address', 'city', 'postalCode', 'country',
    ];
    const missingFields = requiredFields.filter((f) => !formData[f]);
    if (missingFields.length > 0) errors.push('Please fill in all required delivery fields.');
    if (cartItems.length === 0) errors.push('Your cart is empty.');
    if (!selectedDelivery) errors.push('Please select a delivery method.');
    return errors;
  };

  const handlePlaceOrder = async (paymentMethod: 'cod' | 'card') => {
    if (isProcessing) return;

    setIsProcessing(true);
    setLastPaymentMethod(paymentMethod);

    try {
      // ── Validate ──────────────────────────────────────────────────
      const validationErrors = validateOrder();
      if (validationErrors.length > 0) {
        showError(validationErrors.join(' '));
        return;
      }

      // ── Resolve store ID ──────────────────────────────────────────
      let resolvedStoreId: string | undefined;
      if (cartItems[0]?.product?.id) {
        try {
          const productResp = await axios.get(`/api/v1/product/${cartItems[0].product.id}`);
          const storeId = productResp?.data?.data?.vendorStoreId;
          if (storeId) resolvedStoreId = storeId;
        } catch {
          // non-fatal — continue without store ID
        }
      }

      // ── Build order payload ───────────────────────────────────────
      const orderPayload: CreateOrderPayload = {
        userId: userProfile!._id,
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
        totalAmount: Math.max(0, subtotal - couponDiscount + finalDeliveryCharge),
        paymentStatus: 'Pending',
        orderStatus: 'Pending',
        orderForm: 'Website',
        orderDate: new Date(),
        deliveryDate: new Date(
          Date.now() + (selectedDelivery === 'steadfast' ? 2 : 3) * 24 * 60 * 60 * 1000
        ),
        products: cartItems.map((item) => ({
          productId: item.product.id,
          vendorId: item.id,
          quantity: item.product.quantity,
          unitPrice: item.product.originalPrice,
          discountPrice: item.product.price,
          size: item.product.size,
          color: item.product.color,
        })),
        couponId: appliedCoupon?._id,
      };

      // ── STEP 1: Create order ──────────────────────────────────────
      console.log('📝 Creating order...');
      toast.loading('Creating your order...', { id: 'order-toast' });

      const createdOrderData = await placeOrder(orderPayload);

      // ✅ FIX: extractOrderId prefers string orderId over MongoDB _id
      const orderId = extractOrderId(createdOrderData);

      toast.dismiss('order-toast');
      console.log('✅ Order created, orderId:', orderId);

      // ── STEP 2a: Card payment → redirect to gateway ───────────────
      if (paymentMethod === 'card') {
        toast.loading('Redirecting to payment gateway...', { id: 'order-toast' });

        console.log('📤 Initiating payment for orderId:', orderId);
        const gatewayUrl = await initiateSSLCommerzPayment(orderId);

        console.log('✅ Redirecting to payment gateway...');
        toast.dismiss('order-toast');
        window.location.href = gatewayUrl;
        return; // don't setIsProcessing(false) — page is navigating away
      }

      // ── STEP 2b: COD → show success modal ────────────────────────
      console.log('✅ COD order placed successfully');
      toast.success('Order placed successfully!');
      await showSuccessModal(orderId);

    } catch (error: any) {
      console.error('❌ Order flow error:', error);
      toast.dismiss('order-toast');
      const msg = error?.response?.data?.message || error?.message || 'Something went wrong. Please try again.';
      toast.error('Order failed', { description: msg, duration: 4000 });
      showError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  if (profileLoading || geoLoading) return <ShoppingInfoSkeleton />;

  if (!userProfile && session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded text-center">
          <p className="font-bold">Profile Information Required</p>
          <p className="text-sm">Please complete your profile to proceed with checkout.</p>
        </div>
      </div>
    );
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
              country: 'Bangladesh',
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
            totalItems={totalItems}
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
          if (!isProcessing) handlePlaceOrder(lastPaymentMethod);
        }}
      />
    </div>
  );
}