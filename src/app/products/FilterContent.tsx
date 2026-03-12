'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import FilterSidebar, { type FilterState } from './components/FilterSidebar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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

// ─── Product Card ───────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const discount =
    product.discountPrice && product.productPrice
      ? Math.round(((product.productPrice - product.discountPrice) / product.productPrice) * 100)
      : null;

  return (
    <Link
      href={`/products/${product.slug || product._id}`}
      className="group bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative bg-gray-50 overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
        {discount && (
          <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            SALE
          </span>
        )}
        <Image
          src={product.thumbnailImage || '/img/demo_products_img.png'}
          alt={product.productTitle}
          fill
          className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/img/demo_products_img.png';
          }}
        />
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1 gap-1">
        {product.brand?.name && (
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
            {product.brand.name}
          </p>
        )}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug flex-1">
          {product.productTitle}
        </h3>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {product.discountPrice ? (
            <>
              <span className="text-base font-bold text-blue-600">
                ৳{product.discountPrice.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 line-through">
                ৳{product.productPrice.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-base font-bold text-blue-600">
              ৳{product.productPrice?.toLocaleString() || 'N/A'}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Main FilterContent ──────────────────────────────────────────────────────
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

  const currentFilters: FilterState = {
    priceMin: searchParams.get('priceMin') ? Number(searchParams.get('priceMin')) : undefined,
    priceMax: searchParams.get('priceMax') ? Number(searchParams.get('priceMax')) : undefined,
    brand: searchParams.get('brand') || undefined,
    color: searchParams.get('color') || undefined,
    size:  searchParams.get('size')  || undefined,
  };

  const currentSort  = searchParams.get('sortBy') || 'createdAt';
  const currentPage  = Number(searchParams.get('page')) || 1;

  const updateURL = (updates: Record<string, string | string[] | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.keys(updates).forEach((key) => {
      const val = updates[key];
      if (val !== undefined && val !== null && val !== '') {
        params.set(key, Array.isArray(val) ? val.join(',') : String(val));
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (newFilters: FilterState) => {
    updateURL({
      page:     '1',
      priceMin: newFilters.priceMin?.toString(),
      priceMax: newFilters.priceMax?.toString(),
      brand:    newFilters.brand as string | undefined,
      color:    newFilters.color as string | undefined,
      size:     newFilters.size  as string | undefined,
    });
  };

  const handleSortChange   = (sortBy: string) => updateURL({ sortBy, page: '1' });
  const handlePageChange   = (page: number) => {
    updateURL({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sidebarColors = initialColors.map((c) => ({ name: c.colorName, hex: c.colorCode }));
  const sidebarBrands = initialBrands.map((b) => b.name);
  const sidebarSizes  = initialSizes.map((s) => s.name);

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* ── Sidebar ── */}
      <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
        <FilterSidebar
          value={currentFilters}
          onChange={handleFilterChange}
          options={{ brands: sidebarBrands, colors: sidebarColors, sizes: sidebarSizes }}
        />
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 mb-5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
          <p className="text-sm text-gray-600">
            {meta ? (
              <>
                Showing{' '}
                <span className="font-bold text-gray-900">
                  {(currentPage - 1) * meta.limit + 1}–{Math.min(currentPage * meta.limit, meta.total)}
                </span>{' '}
                of{' '}
                <span className="font-bold text-gray-900">{meta.total}</span> products
              </>
            ) : (
              <span className="font-bold">{initialProducts.length} products found</span>
            )}
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-9 border border-gray-200 rounded-lg px-3 text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer"
            >
              <option value="createdAt">Newest Arrivals</option>
              <option value="popularity">Most Popular</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* ── Product Grid ── */}
        {initialProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {initialProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-dashed border-gray-200 rounded-xl text-gray-400">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-700">No products found</h3>
            <p className="mt-1 text-sm">Try adjusting your filters or search criteria.</p>
          </div>
        )}

        {/* ── Pagination ── */}
        {meta && meta.totalPages > 1 && (
          <div className="mt-10 mb-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!meta.hasPrev}
                className="flex items-center gap-1 h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={16} />
                <span className="hidden sm:inline">Previous</span>
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: meta.totalPages }, (_, i) => i + 1)
                  .filter((p) => {
                    if (meta.totalPages <= 5) return true;
                    if (p === 1 || p === meta.totalPages) return true;
                    if (Math.abs(p - currentPage) <= 1) return true;
                    return false;
                  })
                  .reduce((acc: (number | string)[], p, i, arr) => {
                    if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((p, i) =>
                    p === '...' ? (
                      <span key={`dot-${i}`} className="px-2 text-gray-400 font-medium">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p as number)}
                        className={`w-10 h-10 rounded-lg text-sm font-semibold transition-all ${
                          currentPage === p
                            ? 'bg-blue-600 text-white shadow-md border-transparent'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!meta.hasNext}
                className="flex items-center gap-1 h-10 px-4 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={16} />
              </button>
            </div>

            <p className="sm:hidden text-xs text-gray-500">
              Page {currentPage} of {meta.totalPages}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}