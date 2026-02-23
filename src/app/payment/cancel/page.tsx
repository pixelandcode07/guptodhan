'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { AlertTriangle, ShoppingCart, Home, ArrowLeft, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HeroNav } from '@/app/components/Hero/HeroNav';
import { MainCategory } from '@/types/navigation-menu';

function CancelContent() {
  const searchParams = useSearchParams();
  const tran_id = searchParams?.get('tran_id') ?? 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50">
      <HeroNav categories={[] as MainCategory[]} />
      
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        {/* Cancel Icon & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-yellow-100 rounded-full mb-6">
            <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-yellow-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Payment Cancelled
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Your payment process was cancelled
          </p>
          <p className="text-sm text-gray-500">
            No charges were made to your account
          </p>
        </div>

        {/* Cancel Details Card */}
        <Card className="mb-6 shadow-lg border-2 border-yellow-100">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Transaction ID */}
              <div className="pb-4 border-b">
                <p className="text-sm font-medium text-gray-500 mb-1">Transaction ID</p>
                <p className="text-lg font-mono font-semibold text-gray-900">{tran_id}</p>
              </div>

              {/* Information */}
              <div className="pt-4">
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <Clock className="w-5 h-5 text-yellow-600" />
                  <h3 className="text-lg font-semibold">What Happened?</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  You chose to cancel the payment process. Your order has been saved in your cart, 
                  and you can complete the purchase anytime you&apos;re ready.
                </p>
              </div>

              {/* Benefits Section */}
              <div className="pt-4 border-t bg-amber-50/50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Your Cart is Safe</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Your items are still in your shopping cart</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>No payment was processed</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>You can continue shopping or checkout later</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Prices and availability are locked for 24 hours</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            asChild 
            size="lg" 
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
          >
            <Link href="/home/product/shoppinginfo" className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Return to Checkout
            </Link>
          </Button>
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="border-2"
          >
            <Link href="/products/shopping-cart" className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              View Cart
            </Link>
          </Button>
          <Button 
            asChild 
            variant="ghost" 
            size="lg"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Questions about your order?{' '}
            <Link href="/contact" className="text-blue-600 hover:underline font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-600"></div>
      </div>
    }>
      <CancelContent />
    </Suspense>
  );
}
