"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import OrderSuccessModal from './OrderSuccessModal'

export default function OrderSummary({
  subtotal,
  discount = 200,
  shipping = 0
}: {
  subtotal: number
  discount?: number
  shipping?: number
}) {
  const [payment, setPayment] = React.useState<'cod' | 'card'>('cod')
  const [open, setOpen] = React.useState(false)
  const total = Math.max(0, subtotal - discount + shipping)

  return (
    <div className="bg-white rounded-lg p-6 sticky top-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

      {/* Payment options */}
      <div className="space-y-3 mb-6">
        <label className="flex items-center justify-between p-3 border rounded-md cursor-pointer">
          <div className="flex items-center gap-2 text-sm">
            <input type="radio" name="payment" checked={payment==='cod'} onChange={() => setPayment('cod')} />
            <span>Cash on delivery</span>
          </div>
          <Image src="/img/regular.png" alt="cod" width={18} height={18} />
        </label>
        <div className={`p-3 border rounded-md ${payment==='card' ? 'ring-2 ring-blue-600 border-blue-200' : ''}`}>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="radio" name="payment" checked={payment==='card'} onChange={() => setPayment('card')} />
            <span>Pay with</span>
          </label>
          <div className="flex items-center gap-2 mt-3">
            <Image src="/img/sslcommerz.png" alt="sslcommerz" width={34} height={20} />
            <Image src="/img/stripe.png" alt="stripe" width={34} height={20} />
            <Image src="/img/bkash.png" alt="bkash" width={34} height={20} />
            <Image src="/img/paypal.png" alt="paypal" width={34} height={20} />
          </div>
        </div>
      </div>

      {/* Totals */}
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Items</span>
          <span className="text-gray-900">৳ {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Discount</span>
          <span className="text-gray-900">৳ {discount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="text-green-600">{shipping === 0 ? 'FREE' : `৳ ${shipping.toLocaleString()}`}</span>
        </div>
      </div>

      {/* Coupon applied banner */}
      <div className="bg-green-100 text-green-700 text-sm rounded-md p-3 mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>✓</span>
          <span>Coupon applied</span>
        </div>
        <button className="text-green-700 hover:underline text-xs">Remove</button>
      </div>

      {/* Voucher */}
      <div className="flex items-center justify-between p-3 border rounded-md text-sm mb-4">
        <div className="flex items-center gap-2">
          <span className="bg-yellow-100 text-yellow-700 text-[10px] px-1 rounded">V</span>
          <span>Voucher</span>
        </div>
        <button className="text-gray-600 hover:underline">Applied</button>
      </div>

      {/* Total */}
      <div className="flex items-center justify-between text-lg font-semibold mb-4">
        <span>Total:</span>
        <span>৳ {total.toLocaleString()}</span>
      </div>

      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setOpen(true)}>Place Order</Button>

      <div className="mt-4 text-xs text-gray-600">
        <label className="flex items-start gap-2">
          <input type="checkbox" className="mt-0.5" />
          <span>
            I have read and agree to the <a className="text-blue-600 hover:underline" href="#">Terms and Conditions</a>, <a className="text-blue-600 hover:underline" href="#">Privacy Policy</a> and <a className="text-blue-600 hover:underline" href="#">Refund and Return Policy</a>
          </span>
        </label>
      </div>

      <OrderSuccessModal open={open} onOpenChange={setOpen} />
    </div>
  )
}
