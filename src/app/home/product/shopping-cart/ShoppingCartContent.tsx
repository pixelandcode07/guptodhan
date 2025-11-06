"use client"

import React from 'react'
import ShoppingCartSection from './components/ShoppingCartSection'
import OrderSummary from './components/OrderSummary'
import { useCart } from '@/contexts/CartContext'
import { useCartSelection } from './components/useCartSelection'

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
    shippingCost?: number
    freeShippingThreshold?: number
    discountPercentage?: number
  }
}

export default function ShoppingCartContent({ 
  onUpdateQuantity,
  onRemoveItem
}: { 
  onUpdateQuantity: (itemId: string, newQuantity: number) => void
  onRemoveItem: (itemId: string) => void
}) {
  const { cartItems } = useCart()
  const {
    selectedCartItems,
    isAllSelected,
    handleToggleSelect,
    handleSelectAll,
    selectedSubtotal,
    selectedTotalSavings,
    selectedTotalItems,
  } = useCartSelection({ cartItems })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Shopping Cart Section */}
        <div className="lg:col-span-2">
          <ShoppingCartSection 
            cartItems={cartItems}
            selectedItems={selectedCartItems.map(item => item.id)}
            isAllSelected={isAllSelected}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummary
            subtotal={selectedSubtotal}
            totalSavings={selectedTotalSavings}
            totalItems={selectedTotalItems}
            selectedCartItems={selectedCartItems}
          />
        </div>
      </div>
    </div>
  )
}
