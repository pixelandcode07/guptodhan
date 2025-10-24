"use client"

import React, { useState, useEffect } from 'react'
import OrderSummary from './components/OrderSummary'
import AddressSelector from './components/AddressSelector'
import DeliveryOptions, { DeliveryOption } from './components/DeliveryOptions'
import ItemsList from './components/ItemsList'
import OrderSuccessModal from './components/OrderSuccessModal'
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
  const [loading, setLoading] = useState(true)
  const [selectedAddress, setSelectedAddress] = useState<'home' | 'office'>('home')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const { data: session } = useSession()

  // Modal state management
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [successOrderId, setSuccessOrderId] = useState('')

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.product.quantity), 0)
  const totalSavings = cartItems.reduce((sum, item) => sum + ((item.product.originalPrice - item.product.price) * item.product.quantity), 0)

  // Calculate final delivery charge based on selected option
  const getFinalDeliveryCharge = () => {
    switch (selectedDelivery) {
      case 'steadfast':
        return deliveryCharge + 50
      case 'office':
        return deliveryCharge + 30
      default:
        return deliveryCharge
    }
  }

  const finalDeliveryCharge = getFinalDeliveryCharge()

  // Modal helper functions
  const showSuccessModal = (orderId: string) => {
    setSuccessOrderId(orderId)
    setSuccessModalOpen(true)
    // Clear cart after successful order
    localStorage.removeItem('cart')
  }

  const showError = (message: string) => {
    // You can add a simple alert or console log for errors
    console.error('Order Error:', message)
    alert(`Order Error: ${message}`)
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

  // Fetch delivery charge based on location
  useEffect(() => {
    const fetchDeliveryCharge = async () => {
      try {
        setLoading(true)
        // Mock location data - replace with actual user location
        const district = 'Dhaka'
        const division = 'Dhaka'
        
        const response = await axios.get(
          `/api/v1/delivery-charge?districtName=${district}&divisionName=${division}`
        )
        
        if (response.data.success && response.data.data.length > 0) {
          setDeliveryCharge(response.data.data[0].deliveryCharge)
        } else {
          // Default delivery charge if not found
          setDeliveryCharge(100)
        }
      } catch (error) {
        console.error('Error fetching delivery charge:', error)
        // Fallback to default delivery charge
        setDeliveryCharge(100)
      } finally {
        setLoading(false)
      }
    }

    fetchDeliveryCharge()
  }, [])

  // COD validation function
  const validateCODOrder = (paymentMethod: 'cod' | 'card') => {
    const errors: string[] = []
    
    if (paymentMethod === 'cod') {
      // COD order limits
      if (subtotal > 50000) {
        errors.push('COD not available for orders above ৳50,000')
      }
      
      if (subtotal < 500) {
        errors.push('Minimum order amount for COD is ৳500')
      }
      
      // Check if cart is empty
      if (cartItems.length === 0) {
        errors.push('Your cart is empty')
      }
      
      // Check for valid delivery method
      if (!selectedDelivery) {
        errors.push('Please select a delivery method')
      }
      
      // Check for valid address
      if (!selectedAddress) {
        errors.push('Please select a delivery address')
      }
    }
    
    return errors
  }

  const handlePlaceOrder = async (paymentMethod: 'cod' | 'card') => {
    try {
      // Validate COD order
      const validationErrors = validateCODOrder(paymentMethod)
      if (validationErrors.length > 0) {
        showError(validationErrors.join(', '))
        return
      }

      // Prepare order data according to backend structure
      const orderData = {
        userId: userProfile?._id || '507f1f77bcf86cd799439011', // Use actual user ID from profile
        storeId: '507f1f77bcf86cd799439012', // Valid ObjectId format - replace with actual store ID  
        deliveryMethodId: selectedDelivery,
        paymentMethodId: '507f1f77bcf86cd799439013', // Valid ObjectId format - replace with actual payment method ID
        
        // Shipping information from user profile
        shippingName: userProfile?.name || 'Guest User',
        shippingPhone: userProfile?.phoneNumber || '01700000000',
        shippingEmail: userProfile?.email || 'guest@example.com',
        shippingStreetAddress: userProfile?.address || 'Address not provided',
        shippingCity: 'Dhaka', // Default city - can be extracted from address if needed
        shippingDistrict: 'Dhaka', // Default district - can be extracted from address if needed
        shippingPostalCode: '1000', // Default postal code
        shippingCountry: 'Bangladesh',
        addressDetails: selectedAddress === 'home' ? 'Home Address' : 'Office Address',
        
        deliveryCharge: finalDeliveryCharge,
        paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Pending',
        orderStatus: 'Pending',
        orderForm: 'Website',
        deliveryDate: new Date(Date.now() + (selectedDelivery === 'steadfast' ? 2 : 3) * 24 * 60 * 60 * 1000),
        
        // Products array
        products: cartItems.map(item => ({
          productId: item.product.id,
          vendorId: item.id, // Using cart item id as vendor id
          quantity: item.product.quantity,
          unitPrice: item.product.originalPrice,
          discountPrice: item.product.price
        }))
      }

      const response = await axios.post('/api/v1/product-order', orderData)
      
      if (response.data.success) {
        const orderData = response.data.data
        let trackingId = ''
        let trackingUrl = ''
        
        // If it's a Steadfast order, create the parcel
        if (selectedDelivery === 'steadfast' && orderData.needsSteadfastCreation) {
          try {
            const steadfastResponse = await axios.post('/api/v1/product-order/steadfast', {
              orderId: orderData.order.orderId
            })
            
            if (steadfastResponse.data.success) {
              trackingId = steadfastResponse.data.data.trackingId
              trackingUrl = steadfastResponse.data.data.steadfastUrl
              
              // Store tracking info
              localStorage.setItem('lastOrderTracking', JSON.stringify({
                orderId: orderData.order.orderId,
                trackingId: trackingId,
                trackingUrl: trackingUrl,
              }))
            }
          } catch (error) {
            console.error('Error creating Steadfast parcel:', error)
            // Still store the order info even if Steadfast fails
            localStorage.setItem('lastOrderTracking', JSON.stringify({
              orderId: orderData.order.orderId,
              trackingId: null,
              trackingUrl: null,
              note: 'Steadfast parcel creation failed - contact support'
            }))
          }
        }
        
        // Show success modal
        showSuccessModal(orderData.order.orderId)
        
      }
    } catch (error) {
      console.error('Error placing order:', error)
      showError('Failed to place order. Please try again or contact support.')
    }
  }

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading ...</p>
        </div>
      </div>
    )
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
          <AddressSelector 
            selectedAddress={selectedAddress}
            onAddressChange={setSelectedAddress}
          />
          <DeliveryOptions 
            selectedDelivery={selectedDelivery}
            onDeliveryChange={setSelectedDelivery}
            deliveryCharge={deliveryCharge}
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
    </div>
  )
}
