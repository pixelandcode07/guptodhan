"use client"

import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import OrderSuccessModal from './OrderSuccessModal'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { DeliveryOption } from './DeliveryOptions'

interface OrderSummaryProps {
  subtotal: number
  discount?: number
  shipping?: number
  onPlaceOrder: (paymentMethod: 'cod' | 'card') => void
  selectedDelivery: DeliveryOption
}

export default function OrderSummary({
  subtotal,
  discount = 200,
  shipping = 0,
  onPlaceOrder,
  selectedDelivery
}: OrderSummaryProps) {
  const [payment, setPayment] = React.useState<'cod' | 'card'>('cod')
  const [open, setOpen] = React.useState(false)
  const [termsAccepted, setTermsAccepted] = React.useState(false)
  const { data: session } = useSession()
  const user = session?.user
  const total = Math.max(0, subtotal - discount + shipping)

  const handlePlaceOrder = () => {
    if (!termsAccepted) {
      toast.error('Please accept terms and conditions', {
        description: 'You must agree to the terms and conditions to place your order.',
        duration: 3000,
      });
      return;
    }

    // Call the parent's place order function
    onPlaceOrder(payment);

    // Handle different payment methods
    if (payment === 'cod') {
      toast.success('Order placed successfully!', {
        description: `Cash on delivery order placed. Total amount: ৳${total.toLocaleString()}. You will pay when the order arrives.`,
        duration: 4000,
      });
    } else {
      toast.success('Redirecting to payment...', {
        description: 'You will be redirected to the secure payment gateway.',
        duration: 3000,
      });
    }

    // Open the success modal
    setOpen(true);
  }

  const getDeliveryMethodName = (method: DeliveryOption) => {
    switch (method) {
      case 'steadfast':
        return 'Steadfast COD'
      case 'office':
        return 'Office Delivery'
      default:
        return 'Standard Delivery'
    }
  }

  const getDeliveryTime = (method: DeliveryOption) => {
    switch (method) {
      case 'steadfast':
        return '48 hours'
      case 'office':
        return '1-2 days'
      default:
        return '3-5 days'
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 sticky top-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

      {/* Selected Delivery Method */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs">🚚</span>
          </div>
          <div className="text-sm">
            <p className="font-medium text-blue-800">
              {getDeliveryMethodName(selectedDelivery)} Selected
            </p>
            <p className="text-blue-700 text-xs">
              Estimated delivery: {getDeliveryTime(selectedDelivery)}
            </p>
          </div>
        </div>
      </div>

      {/* Payment options */}
      <div className="space-y-3 mb-6">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Choose Payment Method</h3>
        
        {/* Cash on Delivery Option */}
        <label className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-all ${
          payment === 'cod' ? 'ring-2 ring-blue-600 border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}>
          <div className="flex items-center gap-3">
            <input 
              type="radio" 
              name="payment" 
              checked={payment === 'cod'} 
              onChange={() => setPayment('cod')}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Cash on Delivery</span>
              <p className="text-xs text-gray-500">Pay when your order arrives</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Image src="/img/regular.png" alt="cod" width={24} height={24} />
            <span className="text-xs text-green-600 font-medium">Available</span>
          </div>
        </label>

        {/* Online Payment Option */}
        <div className={`p-4 border rounded-lg transition-all ${
          payment === 'card' ? 'ring-2 ring-blue-600 border-blue-200 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
        }`}>
          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="radio" 
              name="payment" 
              checked={payment === 'card'} 
              onChange={() => setPayment('card')}
              className="w-4 h-4 text-blue-600"
            />
            <div>
              <span className="text-sm font-medium text-gray-900">Pay Online</span>
              <p className="text-xs text-gray-500">Secure online payment</p>
            </div>
          </label>
          <div className="flex items-center gap-2 mt-3 ml-7">
            <Image src="/img/sslcommerz.png" alt="sslcommerz" width={34} height={20} />
            <Image src="/img/stripe.png" alt="stripe" width={34} height={20} />
            <Image src="/img/bkash.png" alt="bkash" width={34} height={20} />
            <Image src="/img/paypal.png" alt="paypal" width={34} height={20} />
          </div>
        </div>
      </div>

      {/* Cash on Delivery Info */}
      {payment === 'cod' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
          <div className="flex items-start gap-2">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-white text-xs">✓</span>
            </div>
            <div className="text-sm">
              <p className="font-medium text-green-800">Cash on Delivery Selected</p>
              <p className="text-green-700 text-xs mt-1">
                • Pay with cash when your order arrives<br/>
                • No advance payment required<br/>
                • Delivery person will collect the payment<br/>
               
              </p>
            </div>
          </div>
          
          {/* Steadfast COD Info */}
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

      {/* Totals */}
      <div className="space-y-2 text-sm mb-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">৳ {subtotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Discount</span>
          <span className="text-green-600">-৳ {discount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Delivery ({getDeliveryMethodName(selectedDelivery)})</span>
          <span className="text-gray-900">৳ {shipping.toLocaleString()}</span>
        </div>
        <div className="border-t pt-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Total Items</span>
            <span className="text-gray-900">{subtotal > 0 ? Math.round(subtotal / 1000) : 0} items</span>
          </div>
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

   

      {/* Total */}
      <div className="flex items-center justify-between text-lg font-semibold mb-4">
        <span>Total:</span>
        <span>৳ {total.toLocaleString()}</span>
      </div>

      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors" 
        onClick={handlePlaceOrder}
        disabled={!termsAccepted || !user}
      >
        {!user 
          ? 'Login Required to Place Order'
          : !termsAccepted 
            ? 'Accept Terms to Place Order'
            : (payment === 'cod' ? 'Place Order (Cash on Delivery)' : 'Place Order & Pay Online')
        }
      </Button>

      {!user && (
        <p className="text-xs text-red-500 mt-2 text-center">
          Please login or register to place your order
        </p>
      )}

      {user && !termsAccepted && (
        <p className="text-xs text-gray-500 mt-2 text-center">
          Please accept the terms and conditions to proceed with your order
        </p>
      )}

      <div className="mt-4 text-xs text-gray-600">
        <label className="flex items-start gap-2 cursor-pointer">
          <input 
            type="checkbox" 
            className="mt-0.5" 
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
          />
          <span>
            I have read and agree to the <a className="text-blue-600 hover:underline" href="#">Terms and Conditions</a>, <a className="text-blue-600 hover:underline" href="#">Privacy Policy</a> and <a className="text-blue-600 hover:underline" href="#">Refund and Return Policy</a>
          </span>
        </label>
      </div>

      <OrderSuccessModal open={open} onOpenChange={setOpen} />
    </div>
  )
}

