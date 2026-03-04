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

  // ✅ URL update helper with smooth transition
  const updateURL = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    startTransition(() => {
      // scroll: false ensures window.scrollTo works smoothly below
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

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

  const handleSortChange = (sortBy: string) => {
    updateURL({ sortBy, page: '1' });
  };

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
        <div className="bg-white border rounded-md px-4 py-3 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
            {isPending && <Loader2 size={16} className="animate-spin text-blue-600" />}
            {meta
              ? <span>Showing <span className="text-gray-900 font-bold">{(currentPage - 1) * meta.limit + 1}–{Math.min(currentPage * meta.limit, meta.total)}</span> of <span className="text-gray-900 font-bold">{meta.total}</span> products</span>
              : <span>{initialProducts.length} products found</span>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Sort by:</span>
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-9 border border-gray-200 rounded-md px-3 text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="createdAt">Newest Arrivals</option>
              <option value="popularity">Most Popular</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ===== Product Grid ===== */}
        <div className={`transition-opacity duration-300 ${isPending ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
          {initialProducts.length > 0 ? (
            <ProductGrid products={initialProducts} />
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-gray-500 bg-white border border-dashed border-gray-200 rounded-xl">
              <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or search criteria.</p>
            </div>
          )}
        </div>

        {/* ===== Pagination ===== */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-10 mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              {/* Prev */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!meta.hasPrev || isPending}
                className="flex items-center justify-center gap-1 h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Previous</span>
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1.5">
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
                      <span key={`dot-${i}`} className="px-2 text-gray-400 font-medium tracking-widest">
                        ...
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p as number)}
                        disabled={isPending}
                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                          currentPage === p
                            ? 'bg-blue-600 text-white shadow-md shadow-blue-200 border-transparent'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                        } disabled:opacity-50`}
                      >
                        {p}
                      </button>
                    )
                  )}
              </div>

              {/* Next */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!meta.hasNext || isPending}
                className="flex items-center justify-center gap-1 h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>
            
            {/* Page info (Mobile only) */}
            <p className="sm:hidden text-center text-xs text-gray-500 font-medium">
              Page {currentPage} of {meta.totalPages}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}