'use client';

import React, { useState } from 'react';
import { ShieldCheck, Truck, CreditCard, ChevronRight, Info } from 'lucide-react';
import { toast } from 'sonner';
import type { CartItem } from './components/ShoppingInfoClient';

interface ShoppingInfoContentProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
}

export default function ShoppingInfoContent({ cartItems }: ShoppingInfoContentProps) {
  const [agreed, setAgreed] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const deliveryCharge = 0; // আপনার লজিক অনুযায়ী পরিবর্তন করুন
  const total = subtotal + deliveryCharge;

  const handlePlaceOrder = () => {
    if (!agreed) {
      toast.error('Please agree to the Terms & Conditions first.');
      return;
    }
    // অর্ডার প্লেস করার লজিক এখানে হবে
    toast.success('Order placed successfully!');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pb-24 lg:pb-12">
      {/* Left Column: Shipping & Payment */}
      <div className="flex-1 space-y-6">
        {/* Delivery Banner */}
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Truck className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-blue-900 font-semibold text-sm sm:text-base">Standard Delivery Selected</p>
            <p className="text-blue-700 text-xs sm:text-sm">Estimated delivery: 3-5 days</p>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Choose Payment Method</h3>
          
          <div className="grid gap-3">
            {/* COD */}
            <label className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
              paymentMethod === 'cod' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'
            }`}>
              <input 
                type="radio" 
                name="payment" 
                className="w-5 h-5 text-blue-600" 
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              <div className="ml-4 flex-1">
                <span className="block font-bold text-gray-800">Cash on Delivery</span>
                <span className="text-xs text-gray-500">Pay when your order arrives</span>
              </div>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">Available</span>
            </label>

            {/* Online Payment */}
            <label className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
              paymentMethod === 'online' ? 'border-blue-600 bg-blue-50/50' : 'border-gray-100 hover:border-gray-200'
            }`}>
              <input 
                type="radio" 
                name="payment" 
                className="w-5 h-5 text-blue-600"
                checked={paymentMethod === 'online'}
                onChange={() => setPaymentMethod('online')}
              />
              <div className="ml-4 flex-1">
                <span className="block font-bold text-gray-800">Pay Online</span>
                <span className="text-xs text-gray-500">Secure online payment</span>
              </div>
              <CreditCard className="w-6 h-6 text-gray-400" />
            </label>
          </div>
        </div>
      </div>

      {/* Right Column: Order Summary */}
      <div className="lg:w-[400px] space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

          {/* Pricing Details */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">৳ {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery (Standard)</span>
              <span className="text-green-600 font-semibold">Free</span>
            </div>
            <div className="h-px bg-gray-100 w-full" />
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span className="text-blue-600">৳ {total.toLocaleString()}</span>
            </div>
          </div>

          {/* Terms and Conditions - এটিই আপনার সমস্যা ছিল */}
          <div className="bg-gray-50 p-4 rounded-xl mb-6">
            <div className="flex items-start gap-3">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                />
              </div>
              <label htmlFor="terms" className="text-xs sm:text-sm text-gray-600 leading-tight cursor-pointer">
                I have read and agree to the <span className="text-blue-600 font-semibold hover:underline">Terms & Conditions</span>, 
                <span className="text-blue-600 font-semibold hover:underline"> Privacy Policy</span> and 
                <span className="text-blue-600 font-semibold hover:underline"> Return Policy</span>.
              </label>
            </div>
          </div>

          {/* Place Order Button */}
          <button
            onClick={handlePlaceOrder}
            disabled={!agreed}
            className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
              agreed 
                ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98]' 
                : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            {agreed ? 'Place Order Now' : 'Accept Terms to Place Order'}
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Trust Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-gray-400">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs">Secure Checkout Guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
}