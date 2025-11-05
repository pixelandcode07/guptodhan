'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { Suspense } from 'react';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

function FailContent() {
  const searchParams = useSearchParams();
  const tran_id = searchParams.get('tran_id');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <XCircle className="w-24 h-24 text-red-500 mb-6" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Failed</h1>
      <p className="text-gray-600 mb-4">Unfortunately, your payment could not be processed.</p>
      <p className="text-sm text-gray-500">Transaction ID:</p>
      <p className="text-lg font-medium text-gray-700 mb-8">{tran_id || 'N/A'}</p>
      <div className="flex gap-4">
        <Button variant="outline" asChild>
          <Link href="/home/product/shoppinginfo">Try Again</Link>
        </Button>
        <Button asChild>
          <Link href="/">Go to Homepage</Link>
        </Button>
      </div>
    </div>
  );
}

export default function FailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FailContent />
    </Suspense>
  );
}