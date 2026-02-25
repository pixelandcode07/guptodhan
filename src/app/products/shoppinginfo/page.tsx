import React from 'react';
import ShoppingInfoClient from './components/ShoppingInfoClient';
import { HeroNav } from '@/app/components/Hero/HeroNav';
import { MainCategory } from '@/types/navigation-menu';

export default function ShoppingInfoPage() {
    const categoriesData: MainCategory[] = [];

  return (
    <>
      <HeroNav categories={categoriesData} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ShoppingInfoClient />
      </div>
    </>
  );
}
