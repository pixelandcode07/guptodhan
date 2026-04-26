import React from 'react';
import ShoppingInfoClient from './components/ShoppingInfoClient';
import { HeroNav } from '@/app/components/Hero/HeroNav';
import { MainCategory } from '@/types/navigation-menu';

export default function ShoppingInfoPage() {
    const categoriesData: MainCategory[] = [];

  return (
    <>
      <HeroNav categories={categoriesData} />
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6">
        <ShoppingInfoClient />
      </div>
    </>
  );
}
