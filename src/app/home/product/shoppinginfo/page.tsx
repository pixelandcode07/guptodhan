import React from 'react';
import HeroNav from '@/app/components/Hero/HeroNav';
import ShoppingInfoClient from './components/ShoppingInfoClient';

export default function ShoppingInfoPage() {
  return (
    <>
      <HeroNav />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ShoppingInfoClient />
      </div>
    </>
  );
}
