'use client';

import Link from 'next/link';
import React, { Suspense } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function CancelContent() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <AlertTriangle className="w-24 h-24 text-yellow-500 mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Cancelled</h1>
      <p className="text-gray-600 mb-8">Your payment process was cancelled.</p>
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/home/product/shoppinginfo">Return to Checkout</Link>
        </Button>
        <Button asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}

export default function CancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CancelContent />
    </Suspense>
  );
}