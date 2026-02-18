import React from 'react';
import FilterContent from './FilterContent';
import { HeroNav } from '@/app/components/Hero/HeroNav';
import { MainCategory } from '@/types/navigation-menu';

// ✅ ডাটা ফেচিং ফাংশন
async function getAllProducts() {
  try {
    // আপনার লাইভ ডোমেইন অথবা লোকালহোস্ট ব্যবহার করুন
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.guptodhandigital.com';
    const res = await fetch(`${baseUrl}/api/v1/public/product`, {
      cache: 'no-store', // রিয়েল-টাইম ডাটার জন্য
    });

    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }

    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// ক্যাটাগরি ফেচিং (যদি থাকে, না থাকলে খালি অ্যারে)
async function getCategories() {
  return []; 
}

export default async function ProductFilterPage() {
  const products = await getAllProducts();
  const categoriesData: MainCategory[] = await getCategories();

  return (
    <>
      <HeroNav categories={categoriesData} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ✅ রিয়েল ডাটা ক্লায়েন্ট কম্পোনেন্টে পাঠানো হচ্ছে */}
        <FilterContent initialProducts={products} />
      </div>
    </>
  );
}