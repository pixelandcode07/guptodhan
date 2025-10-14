"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronDown } from 'lucide-react'

export default function OrderSummary({ 
  subtotal, 
  totalSavings, 
  totalItems 
}: { 
  subtotal: number
  totalSavings: number
  totalItems: number
}) {
  const [couponCode, setCouponCode] = React.useState('')
  const [discount, setDiscount] = React.useState(0)
  const shipping = 0 // FREE shipping
  const total = subtotal - discount + shipping

  const handleApplyCoupon = () => {
    // Mock coupon logic
    if (couponCode.toLowerCase() === 'save10') {
      setDiscount(Math.floor(subtotal * 0.1))
    } else if (couponCode.toLowerCase() === 'welcome') {
      setDiscount(500)
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 sticky top-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>

      {/* Coupon Code */}
      <div className="mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Apply coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1"
          />
          <Button 
            variant="outline" 
            onClick={handleApplyCoupon}
            disabled={!couponCode.trim()}
          >
            Apply
          </Button>
        </div>
      </div>

      {/* Voucher */}
      <div className="mb-6">
        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-md">
          <span className="text-sm text-gray-600">Voucher</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">None of Applicable</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Total items:</span>
          <span className="font-medium">৳ {subtotal.toLocaleString()}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Discount:</span>
            <span className="font-medium text-green-600">-৳ {discount.toLocaleString()}</span>
          </div>
        )}
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping:</span>
          <span className="font-medium text-green-600">FREE</span>
        </div>
        
        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total:</span>
            <span>৳ {total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-medium mb-4">
        Proceed to Checkout
      </Button>

      {/* Terms and Conditions */}
      <div className="text-xs text-gray-500">
        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" className="mt-1" />
          <span>
            I have read and agree to the{' '}
            <a href="#" className="text-blue-600 hover:underline">Terms and Conditions</a>,{' '}
            <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a> and{' '}
            <a href="#" className="text-blue-600 hover:underline">Refund and Return Policy</a>
          </span>
        </label>
      </div>
    </div>
  )
}
