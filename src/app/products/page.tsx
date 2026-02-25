import React from 'react';
import FilterContent from './FilterContent';
import { HeroNav } from '@/app/components/Hero/HeroNav';
import { MainCategory } from '@/types/navigation-menu';

// ✅ Product Data Fetching
async function getAllProducts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.guptodhandigital.com';
    const res = await fetch(`${baseUrl}/api/v1/public/product`, {
      cache: 'no-store',
    });

    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// ✅ Active Colors Fetching
async function getActiveColors() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.guptodhandigital.com';
    const res = await fetch(`${baseUrl}/api/v1/public/product-config/product-color/active`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching colors:', error);
    return [];
  }
}

// ✅ Active Brands Fetching
async function getActiveBrands() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.guptodhandigital.com';
    // Adjust route if needed based on your backend routes file
    const res = await fetch(`${baseUrl}/api/v1/public/product-config/brand/active`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];    
  } catch (error) {
    console.error('Error fetching brands:', error);
    return [];
  }
}

// ✅ Active Sizes Fetching
async function getActiveSizes() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.guptodhandigital.com';
    // Adjust route if needed based on your backend routes file
    const res = await fetch(`${baseUrl}/api/v1/public/product-config/product-size/active`, {
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching sizes:', error);
    return [];
  }
}

async function getCategories() {
  return []; 
}

export default async function ProductFilterPage() {
  // Parallel Data Fetching
  const [products, colors, brands, sizes, categoriesData] = await Promise.all([
    getAllProducts(),
    getActiveColors(),
    getActiveBrands(),
    getActiveSizes(),
    getCategories()
  ]);

  return (
    <>
      <HeroNav categories={categoriesData} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* ✅ Passing all dynamic data to client component */}
        <FilterContent 
          initialProducts={products} 
          initialColors={colors} 
          initialBrands={brands}
          initialSizes={sizes}
        />
      </div>
    </>
  );
}