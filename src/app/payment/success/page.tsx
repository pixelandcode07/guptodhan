'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import React, { Suspense, useEffect, useState, useRef } from 'react';
import { CheckCircle2, Package, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HeroNav } from '@/app/components/Hero/HeroNav';
import { MainCategory } from '@/types/navigation-menu';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const hasRedirected = useRef(false);

  const tran_id = searchParams?.get('tran_id') ?? '';
  const order_id = searchParams?.get('order_id') ?? '';

  // ✅ Auto redirect to orders page after 5 seconds (using useEffect, not during render)
  useEffect(() => {
    if (hasRedirected.current) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // ✅ Mark as redirected and navigate
          hasRedirected.current = true;
          router.push('/home/UserProfile/orders');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      <HeroNav categories={[] as MainCategory[]} />

      <div className="container mx-auto px-4 py-8 sm:py-12 max-w-4xl">
        {/* Success Icon & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 sm:w-32 sm:h-32 bg-green-100 rounded-full mb-6 animate-pulse">
            <CheckCircle2 className="w-12 h-12 sm:w-16 sm:h-16 text-green-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Thank you for your purchase
          </p>
          <p className="text-sm text-gray-500">
            Your order has been confirmed and will be processed shortly
          </p>
        </div>

        {/* Order Details Card */}
        <Card className="mb-6 shadow-lg border-2 border-green-100">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Transaction ID */}
              <div className="pb-4 border-b">
                <p className="text-sm font-medium text-gray-500 mb-1">Transaction ID</p>
                <p className="text-lg font-mono font-semibold text-gray-900 break-all">{tran_id || 'N/A'}</p>
              </div>

              {/* Order ID */}
              {order_id && (
                <div className="pb-4 border-b">
                  <p className="text-sm font-medium text-gray-500 mb-1">Order ID</p>
                  <p className="text-lg font-mono font-semibold text-gray-900 break-all">{order_id}</p>
                </div>
              )}

              {/* Order Summary */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <Package className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Payment Confirmed</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                    <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                      Paid
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Order Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {new Date().toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* What's Next */}
              <div className="pt-4 border-t bg-blue-50/50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">What&apos;s Next?</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>You will receive an order confirmation email shortly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>We&apos;ll notify you when your order ships</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>Track your order status in your account</span>
                  </li>
                </ul>
              </div>

              {/* Auto Redirect Notice */}
              <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded-lg">
                <p className="text-sm text-blue-800">
                  ⏱️ Redirecting to your orders in <span className="font-bold">{countdown}</span> seconds...
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
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
          >
            <Link href="/home/UserProfile/orders" className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              View My Orders
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
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Need help?{' '}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}