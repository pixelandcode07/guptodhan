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

// Cart item type definition
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

// User profile type definition
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
  const [deliveryCharge, setDeliveryCharge] = useState(0)
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

  // Modal state management
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [successOrderId, setSuccessOrderId] = useState('')
  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [lastPaymentMethod, setLastPaymentMethod] = useState<'cod' | 'card'>('cod')

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.product.quantity), 0)
  const totalSavings = cartItems.reduce((sum, item) => sum + ((item.product.originalPrice - item.product.price) * item.product.quantity), 0)

  // Calculate final delivery charge based on selected option
  const getFinalDeliveryCharge = () => {
    // All delivery options use the same base delivery charge from API
    return deliveryCharge
  }

  const finalDeliveryCharge = getFinalDeliveryCharge()

  // Modal helper functions
  const showSuccessModal = async (orderId: string) => {
    setSuccessOrderId(orderId)
    setSuccessModalOpen(true)
    // Ensure error modal is closed when showing success
    setErrorModalOpen(false)
    
    // Clear cart from database after successful order
    if (userProfile?._id) {
      try {
        await axios.delete(`/api/v1/add-to-cart/get-cart/${userProfile._id}`)
        console.log('Cart cleared from database successfully')
      } catch (error) {
        console.error('Error clearing cart from database:', error)
      }
    }
  }

  const showError = (message: string) => {
    setErrorMessage(message)
    setErrorModalOpen(true)
    // Ensure success modal is closed when showing error
    setSuccessModalOpen(false)
  }

  const handleSuccessModalClose = () => {
    setSuccessModalOpen(false)
  }

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true)
        
        if (!session?.user) {
          console.log('No session found')
          setProfileLoading(false)
          return
        }

        // Get user ID from session
        const userLike = (session?.user ?? {}) as { id?: string; _id?: string }
        const userId = userLike.id || userLike._id

        if (!userId) {
          console.log('No user ID found in session')
          setProfileLoading(false)
          return
        }

        // Fetch user profile from API
        const response = await axios.get('/api/v1/profile/me', {
          headers: {
            'x-user-id': userId,
          }
        })

        if (response.data.success && response.data.data) {
          setUserProfile(response.data.data)
          console.log('User profile loaded:', response.data.data)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setProfileLoading(false)
      }
    }

    fetchUserProfile()
  }, [session])

  // Fetch delivery charge based on selected district and upazila
  useEffect(() => {
    const fetchDeliveryCharge = async () => {
      if (!formData.district || !formData.upazila) {
        setDeliveryCharge(0)
        return
      }

      try {
        const response = await axios.get(
          `/api/v1/delivery-charge?districtName=${formData.district}&upazilaName=${formData.upazila}`
        )
        
        if (response.data.success && response.data.data.length > 0) {
          setDeliveryCharge(response.data.data[0].deliveryCharge)
        } else {
          // No delivery charge data found - set to 0
          setDeliveryCharge(0)
        }
      } catch (error) {
        console.error('Error fetching delivery charge:', error)
        // No fallback - set to 0 if API fails
        setDeliveryCharge(0)
      }
    }

    fetchDeliveryCharge()
  }, [formData.district, formData.upazila])

  // COD validation function
  const validateCODOrder = (paymentMethod: 'cod' | 'card') => {
    const errors: string[] = []
    
    // Check if user is logged in
    if (!session?.user) {
      errors.push('User must be logged in to place order')
    }
    
    // Check if user profile exists with valid ID
    if (!userProfile?._id) {
      errors.push('User profile information is missing. Please complete your profile.')
    }
    
    // Check if form data is complete
    if (!formData.name || !formData.phone || !formData.email || !formData.district || !formData.upazila || !formData.address || !formData.city || !formData.postalCode || !formData.country) {
      errors.push('Please fill in all required delivery information')
    }
    
    if (paymentMethod === 'cod') {
      // Check if cart is empty
      if (cartItems.length === 0) {
        errors.push('Your cart is empty')
      }
      
      // Check for valid delivery method
      if (!selectedDelivery) {
        errors.push('Please select a delivery method')
      }
    }
    
    return errors
  }

  const handlePlaceOrder = async (paymentMethod: 'cod' | 'card') => {
    try {
      // Store the payment method for retry functionality
      setLastPaymentMethod(paymentMethod)
      
      // Validate COD order
      const validationErrors = validateCODOrder(paymentMethod)
      if (validationErrors.length > 0) {
        showError(validationErrors.join(', '))
        return
      }

      // Prepare order data according to backend structure
      const orderData = {
        userId: userProfile?._id,
        storeId: undefined as unknown as string, // must be provided by UI/state
        deliveryMethodId: selectedDelivery,
        paymentMethodId: undefined as unknown as string, // must be provided by UI/state
        
        // Shipping information from form data
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
        totalAmount: subtotal + finalDeliveryCharge,
        paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Pending',
        orderStatus: selectedDelivery === 'steadfast' ? 'Pending' : 'Pending',
        orderForm: 'Website',
        orderDate: new Date(),
        deliveryDate: new Date(Date.now() + (selectedDelivery === 'steadfast' ? 2 : 3) * 24 * 60 * 60 * 1000),
        
        // Steadfast-specific fields (will be populated after parcel creation)
        ...(selectedDelivery === 'steadfast' && {
          parcelId: null, // Will be updated after Steadfast API call
          trackingId: null, // Will be updated after Steadfast API call
        }),
        
        // Products array
        products: cartItems.map(item => ({
          productId: item.product.id,
          vendorId: item.id, // Using cart item id as vendor id
          quantity: item.product.quantity,
          unitPrice: item.product.originalPrice,
          discountPrice: item.product.price
        }))
      }

      // Validate order data before sending
      if (!orderData.userId || !orderData.deliveryMethodIdDisabled) {
        showError('Invalid order configuration. User ID and delivery method are required.')
        return
      }
      
      if (!orderData.shippingName || !orderData.shippingPhone || !orderData.shippingEmail) {
        showError('Missing shipping information. Please fill in all required fields.')
        return
      }
      
      if (!orderData.products || orderData.products.length === 0) {
        showError('No products in order. Please add items to your cart.')
        return
      }

      const response = await axios.post('/api/v1/product-order', orderData)
      
      if (response.data.success) {
        const orderData = response.data.data
        let orderSuccessfullyCompleted = true
        
        // If it's a Steadfast order, create the parcel
        if (selectedDelivery === 'steadfast') {
          try {
            const steadfastResponse = await axios.post('/api/v1/product-order/steadfast', {
              orderId: orderData.order.orderId
            })
            
            if (steadfastResponse.data.success) {
              const consignmentId = steadfastResponse.data.data.consignmentId
              const trackingCode = steadfastResponse.data.data.trackingCode
              
              // Store tracking info
              localStorage.setItem('lastOrderTracking', JSON.stringify({
                orderId: orderData.order.orderId,
                parcelId: consignmentId,
                trackingId: trackingCode,
                trackingUrl: `https://portal.packzy.com/track/${trackingCode}`,
              }))
            } else {
              // Steadfast API returned success: false
              orderSuccessfullyCompleted = false
              showError('Failed to create Steadfast parcel. Please contact support.')
            }
          } catch (error) {
            console.error('Error creating Steadfast parcel:', error)
            orderSuccessfullyCompleted = false
            
            // Update order status to indicate Steadfast creation failed
            try {
              await axios.patch(`/api/v1/product-order/${orderData.order.orderId}`, {
                orderStatus: 'Cancelled', // Steadfast creation failed
                updatedAt: new Date()
              })
            } catch (updateError) {
              console.error('Error updating order status:', updateError)
            }
            
            // Show error for Steadfast failure
            showError('Failed to create Steadfast parcel. Your order has been placed but needs manual processing. Please contact support.')
            
            // Still store the order info even if Steadfast fails
            localStorage.setItem('lastOrderTracking', JSON.stringify({
              orderId: orderData.order.orderId,
              parcelId: null,
              trackingId: null,
              trackingUrl: null,
              note: 'Steadfast parcel creation failed - contact support'
            }))
          }
        }
        
        // Only show success modal if order was successfully completed
        if (orderSuccessfullyCompleted) {
          showSuccessModal(orderData.order.orderId)
        }
        
      } else {
        // API returned success: false
        showError(response.data.message || 'Failed to place order. Please try again.')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      showError('Failed to place order. Please try again or contact support.')
    }
  }

  if (profileLoading) {
    return <FancyLoadingPage />
  }

  // Show warning if no user profile is available
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
          />
        </div>
      </div>

      {/* Order Success Modal */}
      <OrderSuccessModal
        open={successModalOpen}
        onOpenChange={handleSuccessModalClose}
        orderId={successOrderId}
      />

      {/* Order Error Modal */}
      <OrderErrorModal
        open={errorModalOpen}
        onOpenChange={setErrorModalOpen}
        errorMessage={errorMessage}
        onRetry={() => {
          // Retry the last order attempt
          handlePlaceOrder(lastPaymentMethod)
        }}
      />
    </div>
  )
}
