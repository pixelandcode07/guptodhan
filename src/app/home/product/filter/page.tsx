import React from 'react';
import FilterContent from './FilterContent';
import { HeroNav } from '@/app/components/Hero/HeroNav';
import { MainCategory } from '@/types/navigation-menu';

const demoProducts = Array.from({ length: 16 }).map((_, i) => ({
  id: `p_${i + 1}`,
  title: 'Vintage Leather Jacket Dog House',
  price: '৳ 7,200',
  image: '/img/product/p-1.png',
}));

const categoriesData: MainCategory[] = [];

export default function ProductFilterPage() {
  return (
    <>
      <HeroNav categories={categoriesData} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <FilterContent products={demoProducts} />
      </div>
    </>
  );
}