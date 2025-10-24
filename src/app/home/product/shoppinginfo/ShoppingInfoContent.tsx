"use client"

import React, { useState, useEffect } from 'react'
import OrderSummary from './components/OrderSummary'
import AddressSelector from './components/AddressSelector'
import DeliveryOptions, { DeliveryOption } from './components/DeliveryOptions'
import ItemsList from './components/ItemsList'
import axios from 'axios'
import { toast } from 'sonner'

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

export default function ShoppingInfoContent({ cartItems }: { cartItems: CartItem[] }) {
  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryOption>('standard')
  const [deliveryCharge, setDeliveryCharge] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedAddress, setSelectedAddress] = useState<'home' | 'office'>('home')

  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.product.quantity), 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.product.quantity, 0)
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
        toast.error('Unable to fetch delivery charges', {
          description: 'Using default delivery charge.',
          duration: 3000,
        })
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
        toast.error('Order validation failed', {
          description: validationErrors.join(', '),
          duration: 4000,
        })
        return
      }

      // Prepare order data according to backend structure
      const orderData = {
        userId: '507f1f77bcf86cd799439011', // Valid ObjectId format - replace with actual user ID
        storeId: '507f1f77bcf86cd799439012', // Valid ObjectId format - replace with actual store ID  
        deliveryMethodId: selectedDelivery,
        paymentMethodId: '507f1f77bcf86cd799439013', // Valid ObjectId format - replace with actual payment method ID
        
        // Shipping information (mock data - replace with actual form data)
        shippingName: 'John Doe',
        shippingPhone: '01712345678',
        shippingEmail: 'john@example.com',
        shippingStreetAddress: '123 Main Street',
        shippingCity: 'Dhaka',
        shippingDistrict: 'Dhaka',
        shippingPostalCode: '1000',
        shippingCountry: 'Bangladesh',
        addressDetails: 'Near Central Mosque',
        
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
        
        // Show success message
        toast.success('Order placed successfully!', {
          description: `Order ID: ${orderData.order.orderId}. Total: ৳${(subtotal + finalDeliveryCharge).toLocaleString()}`,
          duration: 5000,
        })
        
        // If it's a Steadfast order, create the parcel
        if (selectedDelivery === 'steadfast' && orderData.needsSteadfastCreation) {
          try {
            const steadfastResponse = await axios.post('/api/v1/product-order/steadfast', {
              orderId: orderData.order.orderId
            })
            
            if (steadfastResponse.data.success) {
              toast.success('Steadfast parcel created!', {
                description: `Tracking ID: ${steadfastResponse.data.data.trackingId}. You can track your order on Steadfast website.`,
                duration: 6000,
              })
              
              // Store tracking info
              localStorage.setItem('lastOrderTracking', JSON.stringify({
                orderId: orderData.order.orderId,
                trackingId: steadfastResponse.data.data.trackingId,
                trackingUrl: steadfastResponse.data.data.steadfastUrl,
              }))
            }
          } catch (error) {
            console.error('Error creating Steadfast parcel:', error)
            toast.error('Order created but Steadfast parcel creation failed', {
              description: 'Please contact support to create the parcel manually. Order ID: ' + orderData.order.orderId,
              duration: 5000,
            })
            
            // Still store the order info even if Steadfast fails
            localStorage.setItem('lastOrderTracking', JSON.stringify({
              orderId: orderData.order.orderId,
              trackingId: null,
              trackingUrl: null,
              note: 'Steadfast parcel creation failed - contact support'
            }))
          }
        }
        
        // Clear cart after successful order
        localStorage.removeItem('cart')
        
        // Redirect to order success page or home
        setTimeout(() => {
          window.location.href = '/home/UserProfile/orders'
        }, 2000)
      }
    } catch (error) {
      console.error('Error placing order:', error)
      toast.error('Failed to place order', {
        description: 'Please try again or contact support.',
        duration: 4000,
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading delivery options...</p>
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
    </div>
  )
}
