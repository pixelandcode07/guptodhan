"use client"

import React from 'react'
import ShoppingCartSection from './components/ShoppingCartSection'
import OrderSummary from './components/OrderSummary'
import YouMayLike from './components/YouMayLike'

export type CartItem = {
  id: string
  seller: {
    name: string
    verified: boolean
  }
  product: {
    id: string
    name: string
    image: string
    size: string
    color: string
    price: number
    originalPrice: number
    quantity: number
  }
}

export type Recommendation = {
  id: string
  name: string
  price: number
  originalPrice: number
  image: string
}

export default function ShoppingCartContent({ 
  cartItems, 
  recommendations 
}: { 
  cartItems: CartItem[]
  recommendations: Recommendation[]
}) {
  const totalItems = cartItems.reduce((sum, item) => sum + item.product.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.product.quantity), 0)
  const totalSavings = cartItems.reduce((sum, item) => sum + ((item.product.originalPrice - item.product.price) * item.product.quantity), 0)

  return (
    <div className="min-h-screen bg-gray-50">
     

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shopping Cart Section */}
        <div className="lg:col-span-2">
          <ShoppingCartSection cartItems={cartItems} totalItems={totalItems} />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary 
            subtotal={subtotal}
            totalSavings={totalSavings}
            totalItems={totalItems}
          />
        </div>
      </div>

      {/* You May Like Section */}
      <div className="mt-12">
        <YouMayLike recommendations={recommendations} />
      </div>
    </div>
  )
}
