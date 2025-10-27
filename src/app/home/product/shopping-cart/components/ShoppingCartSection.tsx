"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Minus, Plus, Trash2 } from 'lucide-react'
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
        <p className="text-gray-600 mt-1">
          {totalItems === 0 ? 'Your cart is empty' : `${totalItems} item${totalItems > 1 ? 's' : ''} in your cart`}
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-4">Looks like you haven&apos;t added any items to your cart yet.</p>
          <Link 
            href="/home/view/all/products" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          {/* Cart Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Image</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Product Name</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Unit Price</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Quantity</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Subtotal</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <CartItemRow 
                    key={item.id} 
                    item={item} 
                    onUpdateQuantity={onUpdateQuantity}
                    onRemoveItem={onRemoveItem}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <Link 
              href="/home/view/all/products"
              className="inline-flex items-center px-6 py-3 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              ← Continue Shopping
            </Link>
            <Button 
              onClick={() => {
                // Clear cart functionality would go here
                console.log('Clear cart');
              }}
              variant="outline"
              className="px-6 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Clear Cart
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function CartItemRow({ 
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
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      {/* Image */}
      <td className="py-4 px-2">
        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={item.product.image}
            alt={item.product.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
          <button
            onClick={handleRemove}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
          >
            ×
          </button>
        </div>
      </td>

      {/* Product Name */}
      <td className="py-4 px-2">
        <div>
          <h3 className="font-medium text-gray-900 text-sm mb-1">{item.product.name}</h3>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Size: {item.product.size}</span>
            <span>•</span>
            <span>Color: {item.product.color}</span>
          </div>
          {savings > 0 && (
            <div className="text-xs text-green-600 mt-1">
              Save ৳{savings.toLocaleString()}
            </div>
          )}
        </div>
      </td>

      {/* Unit Price */}
      <td className="py-4 px-2">
        <div className="text-sm">
          <div className="font-medium text-gray-900">৳ {item.product.price.toLocaleString()}</div>
          {item.product.originalPrice > item.product.price && (
            <div className="text-xs text-gray-500 line-through">
              ৳ {item.product.originalPrice.toLocaleString()}
            </div>
          )}
        </div>
      </td>

      {/* Quantity */}
      <td className="py-4 px-2">
        <div className="flex items-center border border-gray-300 rounded-md w-fit">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100"
            onClick={() => handleQuantityChange(Math.max(1, quantity - 1))}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="px-3 py-1 text-sm font-medium min-w-[2rem] text-center border-x border-gray-300">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100"
            onClick={() => handleQuantityChange(quantity + 1)}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>
      </td>

      {/* Subtotal */}
      <td className="py-4 px-2">
        <div className="font-semibold text-gray-900">
          ৳ {subtotal.toLocaleString()}
        </div>
      </td>

      {/* Action */}
      <td className="py-4 px-2">
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-600 hover:text-red-500 p-1"
            onClick={handleRemove}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </td>
    </tr>
  )
}
