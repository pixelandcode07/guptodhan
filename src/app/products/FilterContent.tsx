'use client';

import React, { useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import FilterSidebar, { type FilterState } from './components/FilterSidebar';
import ProductGrid from './components/ProductGrid';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

export type Product = {
  _id: string;
  productTitle: string;
  thumbnailImage: string;
  productPrice: number;
  discountPrice?: number;
  brand?: { name: string };
  productOptions?: { color: string[]; size: string[] }[];
  status: string;
  slug: string;
};

export type BackendColor = {
  _id: string;
  productColorId: string;
  colorName: string;
  colorCode: string;
  status: string;
};

export type BackendBrand = {
  _id: string;
  brandId: string;
  name: string;
  brandLogo: string;
  status: string;
};

export type BackendSize = {
  _id: string;
  sizeId: string;
  name: string;
  status: string;
};

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function FilterContent({
  initialProducts,
  initialColors,
  initialBrands,
  initialSizes,
  meta,
}: {
  initialProducts: Product[];
  initialColors: BackendColor[];
  initialBrands: BackendBrand[];
  initialSizes: BackendSize[];
  meta: Meta | null;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // ✅ Current filters from URL
  const currentFilters: FilterState = {
    priceMin: searchParams.get('priceMin')
      ? Number(searchParams.get('priceMin'))
      : undefined,
    priceMax: searchParams.get('priceMax')
      ? Number(searchParams.get('priceMax'))
      : undefined,
    brand:  searchParams.get('brand')  || undefined,
    color:  searchParams.get('color')  || undefined,
    size:   searchParams.get('size')   || undefined,
  };

  const currentSort = searchParams.get('sortBy') || 'createdAt';
  const currentPage = Number(searchParams.get('page')) || 1;

  // ✅ URL update helper
  const updateURL = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  // ✅ Filter change — page reset to 1
  const handleFilterChange = (newFilters: FilterState) => {
    updateURL({
      page:     '1',
      priceMin: newFilters.priceMin?.toString(),
      priceMax: newFilters.priceMax?.toString(),
      brand:    newFilters.brand,
      color:    newFilters.color,
      size:     newFilters.size,
    });
  };

  // ✅ Sort change
  const handleSortChange = (sortBy: string) => {
    updateURL({ sortBy, page: '1' });
  };

  // ✅ Page change
  const handlePageChange = (page: number) => {
    updateURL({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sidebarColors = initialColors.map((c) => ({
    name: c.colorName,
    hex: c.colorCode,
  }));
  const sidebarBrands = initialBrands.map((b) => b.name);
  const sidebarSizes = initialSizes.map((s) => s.name);

  return (
    <div className="flex flex-col md:flex-row gap-6 mt-4">
      <FilterSidebar
        value={currentFilters}
        onChange={handleFilterChange}
        options={{
          brands: sidebarBrands,
          colors: sidebarColors,
          sizes: sidebarSizes,
        }}
      />

      <main className="flex-1">
        {/* ===== Top Bar ===== */}
        <div className="bg-white border rounded-md px-4 py-2 mb-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {isPending && <Loader2 size={13} className="animate-spin text-blue-500" />}
            {meta
              ? `Showing ${(currentPage - 1) * meta.limit + 1}–${Math.min(currentPage * meta.limit, meta.total)} of ${meta.total} products`
              : `${initialProducts.length} products`}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort by</span>
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-9 border rounded-md px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt">Newest</option>
              <option value="popularity">Popularity</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ===== Product Grid ===== */}
        <div className={isPending ? 'opacity-50 pointer-events-none' : ''}>
          {initialProducts.length > 0 ? (
            <ProductGrid products={initialProducts} />
          ) : (
            <div className="text-center py-20 text-gray-500">
              No products found matching your filters.
            </div>
          )}
        </div>

        {/* ===== Pagination ===== */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {/* Prev */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!meta.hasPrev || isPending}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={15} />
              Previous
            </button>

            {/* Page Numbers */}
            {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
              .filter((p) => {
                if (meta.totalPages <= 5) return true;
                if (p === 1 || p === meta.totalPages) return true;
                if (Math.abs(p - currentPage) <= 1) return true;
                return false;
              })
              .reduce((acc: (number | string)[], p, i, arr) => {
                if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) {
                  acc.push('...');
                }
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`dot-${i}`} className="px-2 text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() => handlePageChange(p as number)}
                    disabled={isPending}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all border ${
                      currentPage === p
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

            {/* Next */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!meta.hasNext || isPending}
              className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight size={15} />
            </button>
          </div>
        )}

        {/* Page info */}
        {meta && meta.totalPages > 1 && (
          <p className="text-center text-xs text-gray-400 mt-3">
            Page {currentPage} of {meta.totalPages}
          </p>
        )}
      </main>
    </div>
  );
}