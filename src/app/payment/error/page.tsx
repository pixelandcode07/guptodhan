'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { AlertTriangle, Home, ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HeroNav } from '@/app/components/Hero/HeroNav';
import { MainCategory } from '@/types/navigation-menu';

function ErrorContent() {
  const searchParams = useSearchParams();
  const message = searchParams?.get('message') ?? 'An unexpected error occurred';

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <HeroNav categories={[] as MainCategory[]} />

      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        {/* Error Icon & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-red-100 rounded-full mb-6">
            <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-red-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Oops! Something Went Wrong
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            We encountered an error processing your request
          </p>
        </div>

        {/* Error Details Card */}
        <Card className="mb-6 shadow-lg border-2 border-red-100">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Error Message */}
              <div className="pb-4 border-b">
                <p className="text-sm font-medium text-gray-500 mb-2">Error Details</p>
                <p className="text-base text-gray-800 bg-red-50 p-3 rounded-lg border border-red-200">
                  {decodeURIComponent(message)}
                </p>
              </div>

              {/* Troubleshooting Steps */}
              <div className="pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What You Can Do</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">→</span>
                    <span>Try refreshing the page and attempt the payment again</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">→</span>
                    <span>Check your internet connection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">→</span>
                    <span>Clear your browser cache and try again</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">→</span>
                    <span>Use a different browser or payment method</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-1">→</span>
                    <span>Contact our support team for assistance</span>
                  </li>
                </ul>
              </div>

              {/* Important Note */}
              <div className="pt-4 border-t bg-orange-50/50 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Note:</span> If your payment was already processed, 
                  your order may still be in our system. Please check your email or contact support 
                  to verify your order status.
                </p>
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
              <ArrowLeft className="w-5 h-5" />
              Return to Checkout
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-2"
          >
            <Link href="/" className="flex items-center gap-2">
              <Home className="w-5 h-5" />
              Go Home
            </Link>
          </Button>
        </div>

        {/* Support Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Need immediate help?
          </p>
          <Button
            asChild
            variant="ghost"
            size="lg"
          >
            <Link href="/contact" className="flex items-center gap-2 justify-center">
              <Mail className="w-5 h-5" />
              Contact Support Team
            </Link>
          </Button>
          <p className="text-xs text-gray-400 mt-4">
            Our team is available 24/7 to assist you
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}