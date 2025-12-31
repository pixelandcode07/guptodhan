import React from 'react';
import ShoppingInfoClient from './components/ShoppingInfoClient';
import { HeroNav } from '@/app/components/Hero/HeroNav';
import { MainCategory } from '@/types/navigation-menu';
import Link from 'next/link';

export default function ShoppingInfoPage() {
  const categoriesData: MainCategory[] = [];

  return (
    <>
      <HeroNav categories={categoriesData} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <span className="font-semibold text-blue-600">Checkout Cart</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500">Checkout</span>
            <span className="text-gray-400">/</span>
            <span className="text-gray-500">Delivery Information</span>
          </nav>
        </div>

        <ShoppingInfoClient />
      </div>
    </>
  );
}
