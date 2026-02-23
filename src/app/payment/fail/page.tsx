'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { XCircle, AlertCircle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HeroNav } from '@/app/components/Hero/HeroNav';
import { MainCategory } from '@/types/navigation-menu';

function FailContent() {
  const searchParams = useSearchParams();
  const tran_id = searchParams?.get('tran_id') ?? 'N/A';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <HeroNav categories={[] as MainCategory[]} />
      
      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        {/* Error Icon & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-red-100 rounded-full mb-6">
            <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Payment Failed
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Unfortunately, your payment could not be processed
          </p>
          <p className="text-sm text-gray-500">
            Please try again or use a different payment method
          </p>
        </div>

        {/* Error Details Card */}
        <Card className="mb-6 shadow-lg border-2 border-red-100">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Transaction ID */}
              <div className="pb-4 border-b">
                <p className="text-sm font-medium text-gray-500 mb-1">Transaction ID</p>
                <p className="text-lg font-mono font-semibold text-gray-900">{tran_id}</p>
              </div>

              {/* Common Reasons */}
              <div className="pt-4">
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-semibold">Common Reasons for Payment Failure</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Insufficient funds in your account</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Card expired or invalid card details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Bank declined the transaction</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Network or connectivity issues</span>
                  </li>
                </ul>
              </div>

              {/* Help Section */}
              <div className="pt-4 border-t bg-orange-50/50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">What Can You Do?</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">→</span>
                    <span>Check your card details and try again</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">→</span>
                    <span>Contact your bank to ensure the card is active</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">→</span>
                    <span>Try using a different payment method</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">→</span>
                    <span>Contact our support team for assistance</span>
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
              <RefreshCw className="w-5 h-5" />
              Try Again
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
              Back to Cart
            </Link>
          </Button>
          <Button 
            asChild 
            variant="ghost" 
            size="lg"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Support Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Need immediate assistance?{' '}
            <Link href="/contact" className="text-blue-600 hover:underline font-medium">
              Contact Support
            </Link>
          </p>
          <p className="text-xs text-gray-400">
            Our team is available 24/7 to help you complete your purchase
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    }>
      <FailContent />
    </Suspense>
  );
}
