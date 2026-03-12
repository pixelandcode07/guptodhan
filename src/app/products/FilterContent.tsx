'use client';

import React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
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

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const discount =
    product.discountPrice && product.productPrice
      ? Math.round(((product.productPrice - product.discountPrice) / product.productPrice) * 100)
      : null;

  return (
    <Link
      href={`/product/${product.slug || product._id}`}
      className="group bg-white rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
    >
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
          onError={(e) => { (e.target as HTMLImageElement).src = '/img/demo_products_img.png'; }}
        />
      </div>
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

// ─── Main FilterContent ───────────────────────────────────────────────────────
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
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  // ── URL থেকে multi-select values parse (comma-separated) ──────────────────
  const parseMulti = (key: string): string[] => {
    const val = searchParams.get(key);
    if (!val) return [];
    return val.split(',').map((v) => v.trim()).filter(Boolean);
  };

  const selectedBrands = parseMulti('brand');  // e.g. ['Asus', 'TpLink']
  const selectedColors = parseMulti('color');  // e.g. ['Brown', 'Red']
  const currentSize    = searchParams.get('size') || undefined;
  const currentSort    = searchParams.get('sortBy') || 'createdAt';
  const currentPage    = Number(searchParams.get('page')) || 1;

  // ── URL update helper ──────────────────────────────────────────────────────
  const updateURL = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val !== undefined && val !== '') {
        params.set(key, val);
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  // ── Brand toggle ───────────────────────────────────────────────────────────
  const toggleBrand = (name: string) => {
    const next = selectedBrands.includes(name)
      ? selectedBrands.filter((b) => b !== name)   // click again = unselect
      : [...selectedBrands, name];
    updateURL({ brand: next.length > 0 ? next.join(',') : undefined, page: '1' });
  };

  // ── Color toggle ───────────────────────────────────────────────────────────
  const toggleColor = (name: string) => {
    const next = selectedColors.includes(name)
      ? selectedColors.filter((c) => c !== name)   // click again = unselect
      : [...selectedColors, name];
    updateURL({ color: next.length > 0 ? next.join(',') : undefined, page: '1' });
  };

  // ── Size toggle (single select) ────────────────────────────────────────────
  const toggleSize = (name: string) => {
    updateURL({ size: currentSize === name ? undefined : name, page: '1' });
  };

  // ── Sort ───────────────────────────────────────────────────────────────────
  const handleSortChange = (sortBy: string) => updateURL({ sortBy, page: '1' });

  // ── Page ───────────────────────────────────────────────────────────────────
  const handlePageChange = (page: number) => {
    updateURL({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ── Reset ──────────────────────────────────────────────────────────────────
  const handleReset = () => router.push(pathname, { scroll: false });

  const hasActiveFilters =
    selectedBrands.length > 0 ||
    selectedColors.length > 0 ||
    !!currentSize ||
    !!searchParams.get('priceMin') ||
    !!searchParams.get('priceMax');

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* ═══ SIDEBAR ════════════════════════════════════════════════════════ */}
      <aside className="w-full lg:w-64 xl:w-72 flex-shrink-0">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 sticky top-4">

          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters
            </h2>
            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="text-xs text-red-500 hover:text-red-600 font-medium border border-red-200 hover:border-red-300 rounded-full px-2.5 py-1 transition-all"
              >
                Reset ×
              </button>
            )}
          </div>

          <div className="space-y-5 divide-y divide-gray-100">

            {/* ── BRAND (multi-select checkboxes) ── */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brand</h3>
                {selectedBrands.length > 0 && (
                  <span className="text-[10px] bg-blue-100 text-blue-600 font-bold rounded-full px-2 py-0.5">
                    {selectedBrands.length}
                  </span>
                )}
              </div>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {initialBrands.map((b) => {
                  const active = selectedBrands.includes(b.name);
                  return (
                    <label
                      key={b._id}
                      className="flex items-center gap-2.5 cursor-pointer group"
                      onClick={() => toggleBrand(b.name)}
                    >
                      {/* Custom checkbox */}
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        active ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
                      }`}>
                        {active && (
                          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm transition-colors ${
                        active ? 'text-blue-600 font-semibold' : 'text-gray-600 group-hover:text-gray-900'
                      }`}>
                        {b.name}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* ── COLOR (multi-select color swatches) ── */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Color</h3>
                {selectedColors.length > 0 && (
                  <span className="text-[10px] bg-blue-100 text-blue-600 font-bold rounded-full px-2 py-0.5">
                    {selectedColors.length}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {initialColors.map((c) => {
                  const active = selectedColors.includes(c.colorName);
                  return (
                    <button
                      key={c._id}
                      onClick={() => toggleColor(c.colorName)}
                      title={c.colorName}
                      className={`relative w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                        active
                          ? 'border-blue-600 scale-110 shadow-md ring-2 ring-blue-300 ring-offset-1'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: c.colorCode }}
                    >
                      {active && (
                        <span className="absolute inset-0 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              {selectedColors.length > 0 && (
                <p className="text-xs text-gray-400 italic">{selectedColors.join(', ')}</p>
              )}
            </div>

            {/* ── SIZE (single select, click again = deselect) ── */}
            {initialSizes.length > 0 && (
              <div className="pt-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {initialSizes.map((s) => {
                    const active = currentSize === s.name;
                    return (
                      <button
                        key={s._id}
                        onClick={() => toggleSize(s.name)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          active
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                            : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── PRICE ── */}
            <div className="pt-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">Price Range</h3>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="Min ৳"
                  defaultValue={searchParams.get('priceMin') || ''}
                  onBlur={(e) => updateURL({
                    priceMin: e.target.value || undefined,
                    page: '1',
                  })}
                  className="w-full h-8 border border-gray-200 rounded-lg px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <span className="text-gray-400 flex-shrink-0">–</span>
                <input
                  type="number"
                  placeholder="Max ৳"
                  defaultValue={searchParams.get('priceMax') || ''}
                  onBlur={(e) => updateURL({
                    priceMax: e.target.value || undefined,
                    page: '1',
                  })}
                  className="w-full h-8 border border-gray-200 rounded-lg px-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>

          </div>
        </div>
      </aside>

      {/* ═══ MAIN ═══════════════════════════════════════════════════════════ */}
      <main className="flex-1 min-w-0">
        {/* Top bar */}
        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 mb-5 flex flex-wrap items-center gap-3 shadow-sm">
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

          {/* Active filter pills */}
          {(selectedBrands.length > 0 || selectedColors.length > 0 || currentSize) && (
            <div className="flex flex-wrap gap-1.5 flex-1">
              {selectedBrands.map((b) => (
                <button
                  key={b}
                  onClick={() => toggleBrand(b)}
                  className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-2.5 py-1 hover:bg-blue-100 transition-all"
                >
                  {b}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ))}
              {selectedColors.map((c) => (
                <button
                  key={c}
                  onClick={() => toggleColor(c)}
                  className="flex items-center gap-1 text-xs bg-purple-50 text-purple-600 border border-purple-200 rounded-full px-2.5 py-1 hover:bg-purple-100 transition-all"
                >
                  {c}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ))}
              {currentSize && (
                <button
                  onClick={() => toggleSize(currentSize)}
                  className="flex items-center gap-1 text-xs bg-green-50 text-green-600 border border-green-200 rounded-full px-2.5 py-1 hover:bg-green-100 transition-all"
                >
                  {currentSize}
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-500">Sort by:</span>
            <select
              value={currentSort}
              onChange={(e) => handleSortChange(e.target.value)}
              className="h-9 border border-gray-200 rounded-lg px-3 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="createdAt">Newest Arrivals</option>
              <option value="popularity">Most Popular</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {initialProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
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

        {/* Pagination */}
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
                            ? 'bg-blue-600 text-white shadow-md'
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