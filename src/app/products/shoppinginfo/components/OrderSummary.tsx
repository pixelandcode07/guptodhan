"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import OrderSuccessModal from './OrderSuccessModal'
import CouponSection, { AppliedCoupon } from './CouponSection'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { DeliveryOption } from './DeliveryOptions'

interface OrderSummaryProps {
  subtotal: number
  discount?: number
  shipping?: number
  onPlaceOrder: (paymentMethod: 'cod' | 'card') => void
  selectedDelivery: DeliveryOption
  appliedCoupon: AppliedCoupon | null
  onCouponApplied: (coupon: AppliedCoupon | null) => void
  totalItems: number
}

export default function OrderSummary({
  subtotal,
  discount = 0,
  shipping = 0,
  onPlaceOrder,
  selectedDelivery,
  appliedCoupon,
  onCouponApplied,
  totalItems
}: OrderSummaryProps) {
  const [payment, setPayment] = React.useState<'cod' | 'card'>('cod')
  const [open, setOpen] = React.useState(false)
  const [termsAccepted, setTermsAccepted] = React.useState(false)
  const { data: session } = useSession()
  const user = session?.user

  const calculateCouponDiscount = (): number => {
    if (!appliedCoupon) return 0
    const typeLower = appliedCoupon.type.toLowerCase().trim()
    const isPercentage = typeLower === 'percentage' || typeLower.includes('percentage')
    if (isPercentage) {
      return Math.round(((subtotal * appliedCoupon.value) / 100) * 100) / 100
    } else {
      return Math.min(appliedCoupon.value, subtotal)
    }
  }

  const couponDiscount = calculateCouponDiscount()
  const totalDiscount = discount + couponDiscount
  const total = Math.max(0, subtotal - totalDiscount + shipping)

  const handlePlaceOrder = () => {
    if (!user) {
      toast.error('Please login to place an order')
      return
    }
    if (!termsAccepted) {
      toast.error('Please accept terms and conditions', {
        description: 'You must agree to the terms and conditions to place your order.',
        duration: 3000,
      })
      return
    }
    onPlaceOrder(payment)
  }

  const getDeliveryMethodName = (method: DeliveryOption) => {
    switch (method) {
      case 'steadfast': return 'Steadfast COD'
      case 'office': return 'Office Delivery'
      default: return 'Standard Delivery'
    }
  }

  const getDeliveryTime = (method: DeliveryOption) => {
    switch (method) {
      case 'steadfast': return '48 hours'
      case 'office': return '1-2 days'
      default: return '3-5 days'
    }
  }

  const getButtonLabel = () => {
    if (!user) return 'Login Required'
    if (!termsAccepted) return 'Accept Terms to Continue'
    return payment === 'cod' ? 'Place Order (COD)' : 'Place Order & Pay Online'
  }

  return (
    <>
      {/* Main scrollable content — pb-28 on mobile reserves space for sticky bar */}
      <div className="rounded-lg bg-white p-4 pb-28 sm:pb-4 lg:sticky lg:top-4 lg:p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">Order Summary</h2>

        {/* Selected Delivery Method */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex-shrink-0 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">🚚</span>
            </div>
            <div className="text-sm min-w-0">
              <p className="font-medium text-blue-800">
                {getDeliveryMethodName(selectedDelivery)} Selected
              </p>
              <p className="text-blue-700 text-xs">
                Estimated delivery: {getDeliveryTime(selectedDelivery)}
              </p>
            </div>
          </div>
        </div>

        {/* Payment Options */}
        <div className="mb-6 space-y-3">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Choose Payment Method</h3>

          <label className={`flex items-center justify-between gap-2 rounded-lg border p-3 sm:p-4 cursor-pointer transition-all ${
            payment === 'cod' ? 'ring-2 ring-blue-600 border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}>
            <div className="flex items-center gap-3 min-w-0">
              <input
                type="radio"
                name="payment"
                checked={payment === 'cod'}
                onChange={() => setPayment('cod')}
                className="w-4 h-4 flex-shrink-0 text-blue-600 cursor-pointer"
              />
              <div className="min-w-0">
                <span className="text-sm font-medium text-gray-900 block">Cash on Delivery</span>
                <p className="text-xs text-gray-500">Pay when your order arrives</p>
              </div>
            </div>
            <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
              <Image src="/img/regular.png" alt="cod" width={24} height={24} />
              <span className="text-[11px] font-medium text-green-600 sm:text-xs">Available</span>
            </div>
          </label>

          <div className={`rounded-lg border p-3 sm:p-4 transition-all ${
            payment === 'card' ? 'ring-2 ring-blue-600 border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="payment"
                checked={payment === 'card'}
                onChange={() => setPayment('card')}
                className="w-4 h-4 flex-shrink-0 text-blue-600 cursor-pointer"
              />
              <div>
                <span className="text-sm font-medium text-gray-900 block">Pay Online</span>
                <p className="text-xs text-gray-500">Secure online payment</p>
              </div>
            </label>
            <div className="ml-7 mt-3 flex flex-wrap items-center gap-2">
              <Image src="/img/sslcommerz.png" alt="sslcommerz" width={34} height={20} />
              <Image src="/img/stripe.png" alt="stripe" width={34} height={20} />
              <Image src="/img/bkash.png" alt="bkash" width={34} height={20} />
              <Image src="/img/paypal.png" alt="paypal" width={34} height={20} />
            </div>
          </div>
        </div>

        {/* COD Info */}
        {payment === 'cod' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 flex-shrink-0 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">✓</span>
              </div>
              <div className="text-sm">
                <p className="font-medium text-green-800">Cash on Delivery Selected</p>
                <p className="text-green-700 text-xs mt-1">
                  • Pay with cash when your order arrives<br />
                  • No advance payment required<br />
                  • Delivery person will collect the payment
                </p>
              </div>
            </div>
            {selectedDelivery === 'steadfast' && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <div className="text-xs text-green-700">
                  <p className="font-medium mb-1">Steadfast COD Information:</p>
                  <ul className="space-y-1">
                    <li>• 48-hour delivery guarantee</li>
                    <li>• Real-time tracking available</li>
                    <li>• COD collection by Steadfast</li>
                    <li>• SMS notifications for updates</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Coupon */}
        <div className="mb-6">
          <CouponSection
            subtotal={subtotal}
            appliedCoupon={appliedCoupon}
            onCouponApplied={onCouponApplied}
          />
        </div>

        {/* Totals */}
        <div className="space-y-2 text-sm mb-4">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">৳ {subtotal.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Product Discount</span>
              <span className="text-green-600">-৳ {discount.toLocaleString()}</span>
            </div>
          )}
          {couponDiscount > 0 && (
            <div className="flex justify-between">
              <span className="text-gray-600">Coupon Discount</span>
              <span className="text-green-600">-৳ {couponDiscount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery ({getDeliveryMethodName(selectedDelivery)})</span>
            <span className="text-gray-900">৳ {shipping.toLocaleString()}</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Items</span>
              <span className="text-gray-900">{totalItems} items</span>
            </div>
          </div>
        </div>

        {/* Grand Total */}
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total:</span>
          <span>৳ {total.toLocaleString()}</span>
        </div>
      </div>

      {/* ✅ MOBILE STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-white border-t border-gray-200 shadow-[0_-4px_16px_rgba(0,0,0,0.10)] px-4 pt-3 pb-5">
        {/* Terms */}
        <label className="flex items-center gap-2 cursor-pointer select-none mb-3">
          <input
            type="checkbox"
            className="w-4 h-4 flex-shrink-0 cursor-pointer accent-blue-600"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <span className="text-[11px] text-gray-500 leading-relaxed">
            I agree to the{' '}
            <a className="text-blue-600 hover:underline" href="#">Terms</a>,{' '}
            <a className="text-blue-600 hover:underline" href="#">Privacy Policy</a> &amp;{' '}
            <a className="text-blue-600 hover:underline" href="#">Return Policy</a>
          </span>
        </label>

        {/* Total + Button row */}
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <p className="text-[11px] text-gray-400">Total</p>
            <p className="text-base font-bold text-gray-900">৳ {total.toLocaleString()}</p>
          </div>
          <Button
            className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            onClick={handlePlaceOrder}
            disabled={!user}
          >
            {getButtonLabel()}
          </Button>
        </div>

        {!user && (
          <p className="text-[11px] text-red-500 mt-1.5 text-center">
            Please login to place your order
          </p>
        )}
      </div>

      {/* ✅ DESKTOP — normal inline button */}
      <div className="hidden sm:block bg-white rounded-b-lg px-6 pb-6">
        <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 p-3">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              className="mt-0.5 w-4 h-4 flex-shrink-0 cursor-pointer accent-blue-600"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
            <span className="text-xs text-gray-600 leading-relaxed">
              I have read and agree to the{' '}
              <a className="text-blue-600 hover:underline font-medium" href="#">Terms and Conditions</a>,{' '}
              <a className="text-blue-600 hover:underline font-medium" href="#">Privacy Policy</a> and{' '}
              <a className="text-blue-600 hover:underline font-medium" href="#">Refund and Return Policy</a>
            </span>
          </label>
        </div>

        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          onClick={handlePlaceOrder}
          disabled={!user}
        >
          {getButtonLabel()}
        </Button>

        {!user && (
          <p className="text-xs text-red-500 mt-2 text-center">
            Please login or register to place your order
          </p>
        )}
        {user && !termsAccepted && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Please accept the terms and conditions to proceed
          </p>
        )}
      </div>

      <OrderSuccessModal open={open} onOpenChange={setOpen} />
    </>
  )
}