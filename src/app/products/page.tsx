import React from 'react';
import FilterContent from './FilterContent';
import { HeroNav } from '@/app/components/Hero/HeroNav';

async function getProducts(searchParams: any) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.guptodhandigital.com';

    const params = new URLSearchParams({
      page:  searchParams?.page  || '1',
      limit: '10',
      ...(searchParams?.search   && { search:   searchParams.search }),
      ...(searchParams?.brand    && { brand:    searchParams.brand }),
      ...(searchParams?.color    && { color:    searchParams.color }),
      ...(searchParams?.size     && { size:     searchParams.size }),
      ...(searchParams?.priceMin && { priceMin: searchParams.priceMin }),
      ...(searchParams?.priceMax && { priceMax: searchParams.priceMax }),
      ...(searchParams?.sortBy   && { sortBy:   searchParams.sortBy }),
    });

    const res = await fetch(`${baseUrl}/api/v1/public/product?${params}`, {
      cache: 'no-store',
    });

    if (!res.ok) return { products: [], meta: null };
    const data = await res.json();
    return data.data || { products: [], meta: null };
  } catch {
    return { products: [], meta: null };
  }
}

async function getActiveColors() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.guptodhandigital.com';
    const res = await fetch(`${baseUrl}/api/v1/public/product-config/product-color/active`, {
      cache: 'force-cache',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function getActiveBrands() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.guptodhandigital.com';
    const res = await fetch(`${baseUrl}/api/v1/public/product-config/brand/active`, {
      cache: 'force-cache',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function getActiveSizes() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.guptodhandigital.com';
    const res = await fetch(`${baseUrl}/api/v1/public/product-config/product-size/active`, {
      cache: 'force-cache',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export default async function ProductFilterPage({
  searchParams,
}: {
  searchParams: any;
}) {
  const [{ products, meta }, colors, brands, sizes] = await Promise.all([
    getProducts(searchParams),
    getActiveColors(),
    getActiveBrands(),
    getActiveSizes(),
  ]);

  return (
    <>
      <HeroNav categories={[]} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <FilterContent
          initialProducts={products}
          initialColors={colors}
          initialBrands={brands}
          initialSizes={sizes}
          meta={meta}
        />
      </div>
    </>
  );
}