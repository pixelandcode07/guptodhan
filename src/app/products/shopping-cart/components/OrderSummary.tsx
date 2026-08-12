"use client"

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { CartItem } from '../ShoppingCartContent'

export default function OrderSummary({ 
  subtotal, 
  totalSavings, 
  totalItems,
  selectedCartItems
}: { 
  subtotal: number
  totalSavings: number
  totalItems: number
  selectedCartItems: CartItem[]
}) {
  const [termsAccepted, setTermsAccepted] = React.useState(false)
  const router = useRouter()
  
  // Use dynamic values from selected cart items
  const total = subtotal
  const finalSavings = totalSavings

  const handleCheckout = () => {
    if (selectedCartItems.length === 0) {
      toast.error('Please select at least one item to checkout', {
        description: 'You must select items from your cart to proceed.',
        duration: 3000,
      });
      return;
    }

    // Save only selected items to localStorage for checkout
    try {
      localStorage.setItem('cart', JSON.stringify(selectedCartItems));
      sessionStorage.setItem('selectedCartItemIds', JSON.stringify(selectedCartItems.map((item) => item.id)));
      // Navigate to shopping info page
      router.push('/products/shoppinginfo');
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
      toast.error('Failed to save cart items', {
        description: 'Please try again.',
        duration: 3000,
      });
    }
  }

  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 lg:sticky lg:top-4 mb-24 lg:mb-0">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">CART TOTALS</h2>

      {selectedCartItems.length === 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            ⚠️ No items selected. Please select items to checkout.
          </p>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal ({totalItems} item{totalItems > 1 ? 's' : ''}):</span>
          <span className="font-medium">৳ {subtotal.toLocaleString()}</span>
        </div>
        
        {totalSavings > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Product Savings:</span>
            <span className="font-medium text-green-600">-৳ {totalSavings.toLocaleString()}</span>
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>৳ {total.toLocaleString()}</span>
          </div>
          {finalSavings > 0 && (
            <div className="text-sm text-green-600 mt-1">
              You saved ৳ {finalSavings.toLocaleString()}!
            </div>
          )}
        </div>
      </div>

      {/* Terms and Conditions */}
      <div className="text-xs text-gray-500 mb-4 select-none">
        <div className="flex items-start gap-2">
          <input 
            id="terms-cart-checkbox"
            type="checkbox" 
            className="mt-0.5 w-4 h-4 flex-shrink-0 cursor-pointer accent-blue-600" 
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <label htmlFor="terms-cart-checkbox" className="cursor-pointer leading-relaxed">
            I have read and agree to the{' '}
            <Link
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-600 hover:underline font-medium relative z-10"
            >
              Terms and Conditions
            </Link>
            ,{' '}
            <Link
              href="/privacy"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-600 hover:underline font-medium relative z-10"
            >
              Privacy Policy
            </Link>
            {' '}and{' '}
            <Link
              href="/return"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-blue-600 hover:underline font-medium relative z-10"
            >
              Refund and Return Policy
            </Link>
          </label>
        </div>
      </div>

      {/* Checkout Button */}
      <Button 
        className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 text-base sm:text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleCheckout}
        disabled={selectedCartItems.length === 0}
      >
        PROCEED TO CHECKOUT →
      </Button>

    </div>
  )
}
