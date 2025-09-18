"use client"

import React from 'react'
import OrderSummary from './components/OrderSummary'
import AddressSelector from './components/AddressSelector'
import DeliveryOptions from './components/DeliveryOptions'
import ItemsList from './components/ItemsList'

const mockItems = [
  {
    id: '1',
    seller: { name: 'TechStore Pro', verified: true },
    product: { id: 'p1', name: 'Braun Silk-épil 9 Cordless Epilator', image: '/img/product/p-1.png', size: 'XL', color: 'Green', price: 7200, originalPrice: 7400, quantity: 1 }
  },
  {
    id: '2',
    seller: { name: 'TechStore Pro', verified: true },
    product: { id: 'p2', name: 'Braun Silk-épil 9 Cordless Epilator', image: '/img/product/p-2.png', size: 'L', color: 'Blue', price: 7200, originalPrice: 7400, quantity: 2 }
  }
]

export default function ShoppingInfoContent() {
  const subtotal = mockItems.reduce((sum, item) => sum + (item.product.price * item.product.quantity), 0)
  const totalItems = mockItems.reduce((sum, item) => sum + item.product.quantity, 0)
  const totalSavings = mockItems.reduce((sum, item) => sum + ((item.product.originalPrice - item.product.price) * item.product.quantity), 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <AddressSelector />
          <DeliveryOptions />
          <ItemsList items={mockItems} />
        </div>
        <div className="lg:col-span-1">
          <OrderSummary subtotal={subtotal} discount={totalSavings} shipping={0} />
        </div>
      </div>
    </div>
  )
}
