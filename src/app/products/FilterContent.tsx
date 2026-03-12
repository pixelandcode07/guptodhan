'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, SlidersHorizontal, X, Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// ─── Types ──────────────────────────────────────────────────────────────────
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
export type BackendColor  = { _id: string; productColorId: string; colorName: string; colorCode: string; status: string };
export type BackendBrand  = { _id: string; brandId: string; name: string; brandLogo: string; status: string };
export type BackendSize   = { _id: string; sizeId: string; name: string; status: string };
interface Meta { total: number; page: number; limit: number; totalPages: number; hasNext: boolean; hasPrev: boolean }

// ─── Product Card ────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const discount =
    product.discountPrice && product.productPrice
      ? Math.round(((product.productPrice - product.discountPrice) / product.productPrice) * 100)
      : null;

  return (
    <Link
      href={`/product/${product.slug || product._id}`}
      className="group bg-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
    >
      <div className="relative bg-gray-50 overflow-hidden" style={{ aspectRatio: '1 / 1' }}>
        {discount && (
          <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md">
            -{discount}%
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
          <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">{product.brand.name}</p>
        )}
        <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug flex-1">
          {product.productTitle}
        </h3>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          {product.discountPrice ? (
            <>
              <span className="text-base font-bold text-blue-600">৳{product.discountPrice.toLocaleString()}</span>
              <span className="text-xs text-gray-400 line-through">৳{product.productPrice.toLocaleString()}</span>
            </>
          ) : (
            <span className="text-base font-bold text-blue-600">৳{product.productPrice?.toLocaleString() || 'N/A'}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Filter Sections (shared) ────────────────────────────────────────────────
function FilterSections({
  initialBrands, initialColors, initialSizes,
  selectedBrands, selectedColors, currentSize,
  toggleBrand, toggleColor, toggleSize,
}: {
  initialBrands: BackendBrand[];
  initialColors: BackendColor[];
  initialSizes: BackendSize[];
  selectedBrands: string[];
  selectedColors: string[];
  currentSize: string | undefined;
  toggleBrand: (n: string) => void;
  toggleColor: (n: string) => void;
  toggleSize: (n: string) => void;
}) {
  return (
    <div className="space-y-6">
      {/* BRAND */}
      {initialBrands.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Brand</h3>
            {selectedBrands.length > 0 && (
              <span className="text-[10px] bg-blue-100 text-blue-600 font-bold rounded-full px-2 py-0.5">{selectedBrands.length}</span>
            )}
          </div>
          <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
            {initialBrands.map((b) => {
              const active = selectedBrands.includes(b.name);
              return (
                <label key={b._id} onClick={() => toggleBrand(b.name)}
                  className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    active ? 'bg-blue-600 border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
                  }`}>
                    {active && <Check size={11} className="text-white" strokeWidth={3} />}
                  </div>
                  <span className={`text-sm transition-colors ${active ? 'text-blue-600 font-semibold' : 'text-gray-700 group-hover:text-gray-900'}`}>
                    {b.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* COLOR */}
      {initialColors.length > 0 && (
        <div className="border-t border-gray-100 pt-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Color</h3>
            {selectedColors.length > 0 && (
              <span className="text-[10px] bg-blue-100 text-blue-600 font-bold rounded-full px-2 py-0.5">{selectedColors.length}</span>
            )}
          </div>
          <div className="flex flex-wrap gap-2.5">
            {initialColors.map((c) => {
              const active = selectedColors.includes(c.colorName);
              return (
                <button key={c._id} onClick={() => toggleColor(c.colorName)} title={c.colorName}
                  className={`relative w-8 h-8 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                    active ? 'border-blue-600 scale-110 shadow-lg ring-2 ring-blue-300 ring-offset-1' : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: c.colorCode }}>
                  {active && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <Check size={11} className="text-white drop-shadow" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          {selectedColors.length > 0 && (
            <p className="mt-2 text-xs text-gray-400 italic">{selectedColors.join(', ')}</p>
          )}
        </div>
      )}

      {/* SIZE */}
      {initialSizes.length > 0 && (
        <div className="border-t border-gray-100 pt-5">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Size</h3>
          <div className="flex flex-wrap gap-2">
            {initialSizes.map((s) => {
              const active = currentSize === s.name;
              return (
                <button key={s._id} onClick={() => toggleSize(s.name)}
                  className={`px-4 py-2 rounded-xl border text-xs font-medium transition-all ${
                    active ? 'bg-blue-600 text-white border-blue-600 shadow-md' : 'border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50'
                  }`}>
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main FilterContent ──────────────────────────────────────────────────────
export default function FilterContent({
  initialProducts, initialColors, initialBrands, initialSizes, meta,
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
  const drawerRef    = useRef<HTMLDivElement>(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Lock body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Close on backdrop click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setDrawerOpen(false);
    };
    if (drawerOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [drawerOpen]);

  // Parse URL
  const parseMulti = (key: string): string[] => {
    const val = searchParams.get(key);
    if (!val) return [];
    return val.split(',').map((v) => v.trim()).filter(Boolean);
  };

  const selectedBrands = parseMulti('brand');
  const selectedColors = parseMulti('color');
  const currentSize    = searchParams.get('size') || undefined;
  const currentSort    = searchParams.get('sortBy') || 'createdAt';
  const currentPage    = Number(searchParams.get('page')) || 1;

  const [priceMin, setPriceMin] = useState(searchParams.get('priceMin') || '');
  const [priceMax, setPriceMax] = useState(searchParams.get('priceMax') || '');

  useEffect(() => {
    setPriceMin(searchParams.get('priceMin') || '');
    setPriceMax(searchParams.get('priceMax') || '');
  }, [searchParams]);

  const updateURL = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, val]) => {
      if (val !== undefined && val !== '') params.set(key, val);
      else params.delete(key);
    });
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const toggleBrand = (name: string) => {
    const next = selectedBrands.includes(name) ? selectedBrands.filter((b) => b !== name) : [...selectedBrands, name];
    updateURL({ brand: next.length > 0 ? next.join(',') : undefined, page: '1' });
  };

  const toggleColor = (name: string) => {
    const next = selectedColors.includes(name) ? selectedColors.filter((c) => c !== name) : [...selectedColors, name];
    updateURL({ color: next.length > 0 ? next.join(',') : undefined, page: '1' });
  };

  const toggleSize  = (name: string) => updateURL({ size: currentSize === name ? undefined : name, page: '1' });

  const applyPrice  = () => {
    updateURL({ priceMin: priceMin || undefined, priceMax: priceMax || undefined, page: '1' });
  };

  const handleReset = () => {
    setPriceMin('');
    setPriceMax('');
    router.push(pathname, { scroll: false });
  };

  const handleSortChange = (sortBy: string) => updateURL({ sortBy, page: '1' });

  const handlePageChange = (page: number) => {
    updateURL({ page: page.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeFilterCount =
    selectedBrands.length + selectedColors.length +
    (currentSize ? 1 : 0) +
    (searchParams.get('priceMin') || searchParams.get('priceMax') ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  const sharedSectionProps = { initialBrands, initialColors, initialSizes, selectedBrands, selectedColors, currentSize, toggleBrand, toggleColor, toggleSize };

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          MOBILE DRAWER OVERLAY
      ══════════════════════════════════════════════════════════ */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer sheet — fixed height, NOT dependent on body */}
          <div
            ref={drawerRef}
            className="absolute bottom-0 left-0 right-0 bg-white flex flex-col"
            style={{
              borderRadius: '24px 24px 0 0',
              height: '82vh',            // fixed viewport height
              maxHeight: '82vh',
            }}
          >
            {/* Handle */}
            <div className="flex-shrink-0 flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-blue-600" />
                <h2 className="text-base font-bold text-gray-800">Filters</h2>
                {activeFilterCount > 0 && (
                  <span className="text-xs bg-blue-100 text-blue-600 font-bold rounded-full px-2 py-0.5">
                    {activeFilterCount} active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <button
                    onClick={() => { handleReset(); setDrawerOpen(false); }}
                    className="text-xs text-red-500 font-medium border border-red-200 rounded-full px-3 py-1.5 hover:bg-red-50"
                  >
                    Reset
                  </button>
                )}
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                >
                  <X size={16} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Scrollable body — flex-1 takes remaining space */}
            <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
              <FilterSections {...sharedSectionProps} />

              {/* Price range — inside scroll area */}
              <div className="border-t border-gray-100 pt-5 mt-2">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Price Range</h3>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min ৳"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyPrice()}
                    className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  />
                  <span className="text-gray-300 flex-shrink-0 font-bold text-lg">—</span>
                  <input
                    type="number"
                    placeholder="Max ৳"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyPrice()}
                    className="w-full h-10 border border-gray-200 rounded-xl px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  />
                </div>
              </div>

              {/* Extra bottom padding so last content isn't hidden behind footer */}
              <div className="h-4" />
            </div>

            {/* Footer — always visible at bottom */}
            <div className="flex-shrink-0 border-t border-gray-100 bg-white px-5 py-4 space-y-2.5"
              style={{ paddingBottom: 'max(16px, env(safe-area-inset-bottom))' }}>
              <button
                onClick={() => {
                  applyPrice();
                  setDrawerOpen(false);
                }}
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-200"
              >
                Show {meta?.total ?? initialProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          PAGE LAYOUT
      ══════════════════════════════════════════════════════════ */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* MOBILE: Filter trigger bar */}
        <div className="lg:hidden">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setDrawerOpen(true)}
              className="flex items-center gap-2 h-10 px-4 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm hover:border-blue-300 hover:text-blue-600 transition-all active:scale-95 flex-shrink-0"
            >
              <SlidersHorizontal size={15} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 flex items-center justify-center bg-blue-600 text-white text-[10px] font-bold rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <div className="flex gap-1.5 overflow-x-auto flex-1 pb-0.5" style={{ scrollbarWidth: 'none' }}>
                {selectedBrands.map((b) => (
                  <button key={b} onClick={() => toggleBrand(b)}
                    className="flex-shrink-0 flex items-center gap-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-2.5 py-1">
                    {b} <X size={10} />
                  </button>
                ))}
                {selectedColors.map((c) => (
                  <button key={c} onClick={() => toggleColor(c)}
                    className="flex-shrink-0 flex items-center gap-1 text-xs bg-purple-50 text-purple-600 border border-purple-200 rounded-full px-2.5 py-1">
                    {c} <X size={10} />
                  </button>
                ))}
                {currentSize && (
                  <button onClick={() => toggleSize(currentSize)}
                    className="flex-shrink-0 flex items-center gap-1 text-xs bg-green-50 text-green-600 border border-green-200 rounded-full px-2.5 py-1">
                    {currentSize} <X size={10} />
                  </button>
                )}
                <button onClick={handleReset}
                  className="flex-shrink-0 text-xs text-red-400 border border-red-200 rounded-full px-2.5 py-1">
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP: Sidebar */}
        <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-4">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <SlidersHorizontal size={15} className="text-blue-500" />
                Filters
              </h2>
              {hasActiveFilters && (
                <button onClick={handleReset}
                  className="text-xs text-red-500 hover:text-red-600 font-medium border border-red-200 hover:border-red-300 rounded-full px-2.5 py-1 transition-all">
                  Reset ×
                </button>
              )}
            </div>

            <FilterSections {...sharedSectionProps} />

            {/* Desktop price */}
            <div className="border-t border-gray-100 pt-5 mt-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Price Range</h3>
              <div className="flex gap-2 items-center mb-2.5">
                <input
                  type="number" placeholder="Min ৳" value={priceMin}
                  onChange={(e) => setPriceMin(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyPrice()}
                  className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                />
                <span className="text-gray-300 flex-shrink-0 font-bold">—</span>
                <input
                  type="number" placeholder="Max ৳" value={priceMax}
                  onChange={(e) => setPriceMax(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && applyPrice()}
                  className="w-full h-9 border border-gray-200 rounded-xl px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                />
              </div>
              <button onClick={applyPrice} disabled={!priceMin && !priceMax}
                className="w-full h-9 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-all">
                Apply Price Filter
              </button>
              {(searchParams.get('priceMin') || searchParams.get('priceMax')) && (
                <button onClick={() => { setPriceMin(''); setPriceMax(''); updateURL({ priceMin: undefined, priceMax: undefined, page: '1' }); }}
                  className="mt-2 w-full text-xs text-red-400 hover:text-red-600 transition-colors text-center py-1">
                  Clear price filter ×
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 min-w-0">
          {/* Top bar */}
          <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 mb-5 flex flex-wrap items-center gap-3 shadow-sm">
            <p className="text-sm text-gray-600 flex-shrink-0">
              {meta ? (
                <>
                  Showing{' '}
                  <span className="font-bold text-gray-900">
                    {(currentPage - 1) * meta.limit + 1}–{Math.min(currentPage * meta.limit, meta.total)}
                  </span>{' '}of{' '}
                  <span className="font-bold text-gray-900">{meta.total}</span> products
                </>
              ) : (
                <span className="font-bold">{initialProducts.length} products</span>
              )}
            </p>

            {/* Desktop active pills */}
            {hasActiveFilters && (
              <div className="hidden lg:flex flex-wrap gap-1.5 flex-1 min-w-0">
                {selectedBrands.map((b) => (
                  <button key={b} onClick={() => toggleBrand(b)}
                    className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 border border-blue-200 rounded-full px-2.5 py-1 hover:bg-blue-100">
                    {b} <X size={10} />
                  </button>
                ))}
                {selectedColors.map((c) => (
                  <button key={c} onClick={() => toggleColor(c)}
                    className="flex items-center gap-1 text-xs bg-purple-50 text-purple-600 border border-purple-200 rounded-full px-2.5 py-1 hover:bg-purple-100">
                    {c} <X size={10} />
                  </button>
                ))}
                {currentSize && (
                  <button onClick={() => toggleSize(currentSize)}
                    className="flex items-center gap-1 text-xs bg-green-50 text-green-600 border border-green-200 rounded-full px-2.5 py-1 hover:bg-green-100">
                    {currentSize} <X size={10} />
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center gap-2 ml-auto flex-shrink-0">
              <span className="text-xs text-gray-400 hidden sm:block">Sort:</span>
              <select value={currentSort} onChange={(e) => handleSortChange(e.target.value)}
                className="h-9 border border-gray-200 rounded-xl px-3 text-xs text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                <option value="createdAt">Newest</option>
                <option value="popularity">Popular</option>
                <option value="price_low">Price ↑</option>
                <option value="price_high">Price ↓</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          {initialProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {initialProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-gray-200 rounded-2xl">
              <div className="w-16 h-16 mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                <SlidersHorizontal size={28} className="text-gray-300" />
              </div>
              <h3 className="text-base font-semibold text-gray-700">No products found</h3>
              <p className="mt-1 text-sm text-gray-400">Try adjusting your filters.</p>
              {hasActiveFilters && (
                <button onClick={handleReset} className="mt-4 text-sm text-blue-600 font-medium hover:underline">
                  Clear all filters
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="mt-8 mb-4 flex items-center justify-center gap-2">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={!meta.hasPrev}
                className="flex items-center gap-1 h-9 px-3 sm:px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <ChevronLeft size={15} />
                <span className="hidden sm:inline">Prev</span>
              </button>

              <div className="flex items-center gap-1">
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
                      <span key={`dot-${i}`} className="px-1.5 text-gray-400 text-sm">...</span>
                    ) : (
                      <button key={p} onClick={() => handlePageChange(p as number)}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                          currentPage === p ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}>
                        {p}
                      </button>
                    )
                  )}
              </div>

              <button onClick={() => handlePageChange(currentPage + 1)} disabled={!meta.hasNext}
                className="flex items-center gap-1 h-9 px-3 sm:px-4 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                <span className="hidden sm:inline">Next</span>
                <ChevronRight size={15} />
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
}