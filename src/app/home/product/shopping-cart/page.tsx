import React from 'react';
import HeroNav from '@/app/components/Hero/HeroNav';
import ShoppingCartClient from './components/ShoppingCartClient';
import Link from 'next/link';

export default function ShoppingCartPage() {
  return (
    <>
      <HeroNav />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="font-semibold text-blue-600">Shopping Cart</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500">Checkout</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500">Order Complete</span>
          </nav>
        </div>

        <ShoppingCartClient />
      </div>
    </>
  );
}
