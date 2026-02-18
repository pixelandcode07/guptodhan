"use client"

import React, { useState, useMemo } from 'react'
import FilterSidebar, { type FilterState } from './components/FilterSidebar'
import ProductGrid from './components/ProductGrid'

// ✅ আপনার ব্যাকএন্ড ডাটা টাইপ
export type Product = {
  _id: string;
  productTitle: string;
  thumbnailImage: string;
  productPrice: number;
  discountPrice?: number;
  brand?: { name: string };
  productOptions?: { color: string[]; size: string[] }[];
  status: string;
}

export default function FilterContent({ initialProducts }: { initialProducts: Product[] }) {
  const [filters, setFilters] = useState<FilterState>({})
  const [sortBy, setSortBy] = useState('popularity')

  // ✅ ডাইনামিক ফিল্টারিং লজিক (Client Side)
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // 1. Price Filter
    if (filters.priceMin) {
      result = result.filter(p => (p.discountPrice || p.productPrice) >= filters.priceMin!);
    }
    if (filters.priceMax) {
      result = result.filter(p => (p.discountPrice || p.productPrice) <= filters.priceMax!);
    }

    // 2. Brand Filter
    if (filters.brand) {
      result = result.filter(p => p.brand?.name === filters.brand);
    }

    // 3. Color Filter (Product Options check)
    if (filters.color) {
      result = result.filter(p => 
        p.productOptions?.some(opt => opt.color.includes(filters.color!))
      );
    }

    // 4. Size Filter
    if (filters.size) {
      result = result.filter(p => 
        p.productOptions?.some(opt => opt.size.includes(filters.size!))
      );
    }

    // 5. Sorting
    if (sortBy === 'price_low') {
      result.sort((a, b) => (a.discountPrice || a.productPrice) - (b.discountPrice || b.productPrice));
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => (b.discountPrice || b.productPrice) - (a.discountPrice || a.productPrice));
    }

    return result;
  }, [initialProducts, filters, sortBy]);

  // ✅ সাইডবারের জন্য ইউনিক অপশন বের করা (ডাটাবেজে যা আছে শুধু তাই দেখাবে)
  const availableBrands = Array.from(new Set(initialProducts.map(p => p.brand?.name).filter(Boolean))) as string[];
  
  const availableColors = Array.from(new Set(initialProducts.flatMap(p => 
    p.productOptions?.flatMap(o => o.color) || []
  ))).filter(Boolean);

  const availableSizes = Array.from(new Set(initialProducts.flatMap(p => 
    p.productOptions?.flatMap(o => o.size) || []
  ))).filter(Boolean);

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-4">
      {/* সাইডবারে ডাইনামিক অপশন পাঠানো হচ্ছে */}
      <FilterSidebar 
        value={filters} 
        onChange={setFilters} 
        options={{ brands: availableBrands, colors: availableColors, sizes: availableSizes }} 
      />

      <main className="flex-1">
        <div className="bg-white border rounded-md px-4 py-2 mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-gray-500">
            Showing {filteredProducts.length} products
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">Sort by</div>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)} 
              className="h-9 border rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="popularity">Popularity</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <ProductGrid products={filteredProducts} />
        ) : (
          <div className="text-center py-20 text-gray-500">
            No products found matching your filters.
          </div>
        )}
      </main>
    </div>
  )
}