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
  // ✅ VALIDATION: Check if cartItems is valid
  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    console.error('❌ Invalid or empty cartItems:', cartItems);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error Loading Cart</p>
            <p className="text-sm">Please refresh the page and try again.</p>
          </div>
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

  // ✅ Calculate subtotal with safety checks
  const subtotal = cartItems.reduce((sum: number, item: CartItem) => {
    if (!item?.product?.price || !item?.product?.quantity) {
      console.warn('⚠️ Invalid item structure:', item);
      return sum;
    }
    return sum + item.product.price * item.product.quantity;
  }, 0);

  // ✅ Calculate total savings with safety checks
  const totalSavings = cartItems.reduce((sum: number, item: CartItem) => {
    if (!item?.product?.originalPrice || !item?.product?.price || !item?.product?.quantity) {
      console.warn('⚠️ Invalid item structure:', item);
      return sum;
    }
    return sum + (item.product.originalPrice - item.product.price) * item.product.quantity;
  }, 0);

  const calculateCouponDiscount = (): number => {
    if (!appliedCoupon) return 0;
    const typeLower = appliedCoupon.type.toLowerCase().trim();
    const isPercentage = typeLower === 'percentage' || typeLower.includes('percentage');
    if (isPercentage) {
      const couponDiscount = (subtotal * appliedCoupon.value) / 100;
      return Math.round(couponDiscount * 100) / 100;
    } else {
      return Math.min(appliedCoupon.value, subtotal);
    }
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
        console.error('Error clearing cart from database:', error);
      }
    }
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setErrorModalOpen(true);
    setSuccessModalOpen(false);
  };

  const handleSuccessModalClose = () => {
    setSuccessModalOpen(false);
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        if (!session?.user) {
          setProfileLoading(false);
          return;
        }
        const userLike = (session?.user ?? {}) as { id?: string; _id?: string };
        const userId = userLike.id || userLike._id;
        if (!userId) {
          setProfileLoading(false);
          return;
        }
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

  const validateOrder = (paymentMethod: 'cod' | 'card') => {
    const errors: string[] = [];
    if (!session?.user) errors.push('User must be logged in to place order');
    if (!userProfile?._id) errors.push('User profile information is missing. Please complete your profile.');
    if (!formData.name || !formData.phone || !formData.email || !formData.district || !formData.upazila || !formData.address || !formData.city || !formData.postalCode || !formData.country) {
      errors.push('Please fill in all required delivery information');
    }
    if (cartItems.length === 0) errors.push('Your cart is empty');
    if (!selectedDelivery) errors.push('Please select a delivery method');
    return errors;
  };

  const handlePlaceOrder = async (paymentMethod: 'cod' | 'card') => {
    try {
      if (isProcessing) {
        console.warn('⚠️ Order already being processed');
        return;
      }

      setIsProcessing(true);
      setLastPaymentMethod(paymentMethod);

      const validationErrors = validateOrder(paymentMethod);
      if (validationErrors.length > 0) {
        showError(validationErrors.join(', '));
        setIsProcessing(false);
        return;
      }

      let resolvedStoreId: string | undefined = undefined;
      if (cartItems.length > 0 && cartItems[0]?.product?.id) {
        try {
          const firstProductId = cartItems[0].product.id;
          const productResp = await axios.get(`/api/v1/product/${firstProductId}`);
          const productData = productResp?.data?.data;
          if (productData?.vendorStoreId) {
            resolvedStoreId = productData.vendorStoreId;
          }
        } catch {
          // Continue without store ID, backend will handle it
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
        totalAmount: Math.max(0, subtotal - couponDiscount + finalDeliveryCharge),
        paymentStatus: 'Pending',
        orderStatus: 'Pending',
        orderForm: 'Website',
        orderDate: new Date(),
        deliveryDate: new Date(Date.now() + (selectedDelivery === 'steadfast' ? 2 : 3) * 24 * 60 * 60 * 1000),
        ...(selectedDelivery === 'steadfast' && { parcelId: null, trackingId: null }),
        products: cartItems.map((item) => ({
          productId: item.product.id,
          vendorId: item.id,
          quantity: item.product.quantity,
          unitPrice: item.product.originalPrice,
          discountPrice: item.product.price,
          size: item.product.size,
          color: item.product.color,
        })),
        couponId: appliedCoupon?._id || undefined,
      };

      console.log('📝 Creating order...');
      toast.loading('Creating your order...', { id: 'order-create' });

      // ✅ STEP 1: Create order FIRST
      const orderResponse = await axios.post('/api/v1/product-order', orderData);

      if (!orderResponse.data.success) {
        toast.dismiss('order-create');
        const errorMsg = orderResponse.data.message || 'Failed to place order';
        toast.error('Order creation failed', { description: errorMsg, duration: 4000 });
        showError(errorMsg);
        setIsProcessing(false);
        return;
      }

      const createdOrder = orderResponse.data.data;
      const orderId = createdOrder?.order?._id || createdOrder?.orderId;

      if (!orderId) {
        toast.dismiss('order-create');
        toast.error('Order creation failed', { description: 'No order ID received', duration: 4000 });
        showError('Order creation failed - No order ID received');
        setIsProcessing(false);
        return;
      }

      console.log('✅ Order created successfully:', orderId);
      toast.dismiss('order-create');

      // ✅ STEP 2: If Card payment, initiate payment gateway
      if (paymentMethod === 'card') {
        toast.loading('Redirecting to payment gateway...', { id: 'payment-init' });

        try {
          console.log('📤 Initiating payment for order:', orderId);

          const paymentResponse = await axios.post('/api/v1/payment/init', {
            orderId: orderId,
          });

          if (paymentResponse.data.success && paymentResponse.data.data?.url) {
            console.log('✅ Payment gateway URL received');
            toast.dismiss('payment-init');
            window.location.href = paymentResponse.data.data.url;
            return;
          } else {
            const errorMsg = paymentResponse.data.message || 'Failed to get payment gateway URL';
            throw new Error(errorMsg);
          }
        } catch (err: any) {
          toast.dismiss('payment-init');
          const msg = err?.message || 'Failed to initialize payment gateway. Please try again.';
          console.error('❌ Payment initialization failed:', msg);
          toast.error('Payment initialization failed', { description: msg, duration: 4000 });
          showError(msg);
          setIsProcessing(false);
          return;
        }
      }

      // ✅ STEP 3: If COD, show success modal
      console.log('✅ Order placed successfully with COD');
      toast.dismiss('order-create');
      showSuccessModal(orderId);
      setIsProcessing(false);

    } catch (error: any) {
      console.error('❌ Error placing order:', error);
      const errorMsg = error.message || 'Failed to place order. Please try again or contact support.';
      toast.error('Order failed', { description: errorMsg, duration: 4000 });
      showError(errorMsg);
      setIsProcessing(false);
    }
  };

  if (profileLoading || geoLoading) {
    return <ShoppingInfoSkeleton />;
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
          <DeliveryOptions selectedDelivery={selectedDelivery} onDeliveryChange={setSelectedDelivery} />
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
          if (!isProcessing) {
            handlePlaceOrder(lastPaymentMethod);
          }
        }}
      />
    </div>
  );
}