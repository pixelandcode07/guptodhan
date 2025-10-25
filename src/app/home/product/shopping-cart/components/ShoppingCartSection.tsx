"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Heart, Trash2, ChevronRight } from 'lucide-react'
import type { CartItem } from '../ShoppingCartContent'

export default function ShoppingCartSection({ 
  cartItems, 
  totalItems,
  onUpdateQuantity,
  onRemoveItem
}: { 
  cartItems: CartItem[]
  totalItems: number
  onUpdateQuantity: (itemId: string, newQuantity: number) => void
  onRemoveItem: (itemId: string) => void
}) {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Shopping Cart</h1>
        <p className="text-gray-600 mt-1">{totalItems} items in your cart</p>
      </div>

      <div className="space-y-6">
        {cartItems.map((item) => (
          <CartItemCard 
            key={item.id} 
            item={item} 
            onUpdateQuantity={onUpdateQuantity}
            onRemoveItem={onRemoveItem}
          />
        ))}
      </div>
    </div>
  )
}

function CartItemCard({ 
  item, 
  onUpdateQuantity, 
  onRemoveItem 
}: { 
  item: CartItem
  onUpdateQuantity: (itemId: string, newQuantity: number) => void
  onRemoveItem: (itemId: string) => void
}) {
  const [quantity, setQuantity] = React.useState(item.product.quantity)
  const subtotal = item.product.price * quantity
  const savings = (item.product.originalPrice - item.product.price) * quantity

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
      onUpdateQuantity(item.id, newQuantity)
    }
  }

  const handleRemove = () => {
    onRemoveItem(item.id)
  }

  return (
    <div className="border-b border-gray-200 pb-6 last:border-b-0">
      {/* Seller Info */}
      <div className="flex items-center gap-2 mb-4">
        <span className="font-medium text-gray-900">{item.seller.name}</span>
        {item.seller.verified && (
          <div className="flex items-center gap-1 text-green-600 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Verified Seller</span>
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={item.product.image}
            alt={item.product.name}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-2">{item.product.name}</h3>
          
          {/* Size and Color */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <span>Size: {item.product.size}, Color: {item.product.color}</span>
            <ChevronRight className="w-4 h-4" />
          </div>

          {/* Quantity Controls */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center border border-gray-300 rounded-md">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="px-3 py-1 text-sm font-medium min-w-[3rem] text-center">
                {quantity.toString().padStart(2, '0')}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Price */}
          <div className="text-lg font-semibold text-gray-900 mb-3">
            ৳ {subtotal.toLocaleString()}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-500">
              <Heart className="w-4 h-4 mr-1" />
              Save for later
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600 hover:text-red-500"
              onClick={handleRemove}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      </div>

      {/* Subtotal Breakdown */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Subtotal ({quantity} item{quantity > 1 ? 's' : ''}):</span>
            <div className="font-medium">৳ {subtotal.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-gray-600">You Save:</span>
            <div className="font-medium text-green-600">৳ {savings.toLocaleString()}</div>
          </div>
          <div>
            <span className="text-gray-600">Shipping:</span>
            <div className="font-medium text-green-600">FREE</div>
          </div>
        </div>
      </div>
    </div>
  )
}
