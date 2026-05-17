"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  ShoppingBag,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Package,
  Clock,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Loader2,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Product {
  _id: string;
  slug?: string;
  productTitle: string;
  thumbnailImage?: string;
  productPrice?: number;
  discountPrice?: number;
  createdAt?: string;
  category?: { slug?: string; categoryName?: string };
  subCategory?: { slug?: string };
  childCategory?: { slug?: string };
}

type SortKey = "relevance" | "price_asc" | "price_desc" | "newest";

// ─── Constants ─────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 20;

const SORT_OPTIONS: { key: SortKey; label: string; icon: React.ReactNode }[] = [
  { key: "relevance", label: "Best Match", icon: <Sparkles className="w-3.5 h-3.5" /> },
  { key: "newest", label: "Newest", icon: <Clock className="w-3.5 h-3.5" /> },
  { key: "price_asc", label: "Price: Low → High", icon: <TrendingUp className="w-3.5 h-3.5" /> },
  { key: "price_desc", label: "Price: High → Low", icon: <TrendingDown className="w-3.5 h-3.5" /> },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function effectivePrice(p: Product) {
  return p.discountPrice ?? p.productPrice ?? 0;
}

function discountPct(p: Product): number | null {
  if (!p.discountPrice || !p.productPrice || p.discountPrice >= p.productPrice)
    return null;
  return Math.round(((p.productPrice - p.discountPrice) / p.productPrice) * 100);
}

// ─── Skeleton Card ─────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-4/5" />
        <div className="h-5 bg-gray-100 rounded w-2/5 mt-3" />
      </div>
    </div>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
  const pct = discountPct(product);
  const href = `/product/${product.slug ?? product._id}`;

  return (
    <Link
      href={href}
      className="
        group flex flex-col bg-white rounded-xl overflow-hidden
        border border-gray-100
        hover:border-[#00005E]/25
        hover:shadow-[0_6px_24px_rgba(0,0,94,0.10)]
        transition-all duration-200
      "
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.thumbnailImage ? (
          <Image
            src={product.thumbnailImage}
            alt={product.productTitle}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
            className="object-cover group-hover:scale-[1.04] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingBag className="w-10 h-10 text-gray-200" />
          </div>
        )}

        {/* Discount badge */}
        {pct && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full leading-tight">
            -{pct}%
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="text-sm text-gray-700 line-clamp-2 leading-snug flex-1 group-hover:text-[#00005E] transition-colors">
          {product.productTitle}
        </p>

        <div className="mt-2.5 flex items-baseline gap-2 flex-wrap">
          {product.discountPrice ? (
            <>
              <span className="text-[15px] font-bold text-[#00005E]">
                ৳{product.discountPrice.toLocaleString()}
              </span>
              <span className="text-xs text-gray-400 line-through">
                ৳{product.productPrice?.toLocaleString()}
              </span>
            </>
          ) : (
            <span className="text-[15px] font-bold text-gray-800">
              ৳{product.productPrice?.toLocaleString() ?? "—"}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Pagination ────────────────────────────────────────────────────────────────

function Pagination({
  page,
  totalPages,
  onChange,
}: {
  page: number;
  totalPages: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  // Build page buttons with ellipsis
  const range: (number | "...")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - page) <= 2) {
      if (range.length > 0 && typeof range[range.length - 1] === "number") {
        if ((range[range.length - 1] as number) + 1 < i) range.push("...");
      }
      range.push(i);
    }
  }

  return (
    <div className="flex items-center justify-center gap-1.5 py-10 flex-wrap">
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="
          w-9 h-9 flex items-center justify-center rounded-lg
          border border-gray-200 text-gray-500
          hover:border-[#00005E] hover:text-[#00005E]
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors
        "
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {range.map((item, i) =>
        item === "..." ? (
          <span key={`dot-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-400 text-sm select-none">
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onChange(item as number)}
            className={`
              w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors
              ${page === item
                ? "bg-[#00005E] text-white border border-[#00005E]"
                : "border border-gray-200 text-gray-600 hover:border-[#00005E] hover:text-[#00005E]"
              }
            `}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="
          w-9 h-9 flex items-center justify-center rounded-lg
          border border-gray-200 text-gray-500
          hover:border-[#00005E] hover:text-[#00005E]
          disabled:opacity-40 disabled:cursor-not-allowed
          transition-colors
        "
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function SearchResults({ query }: { query: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [page, setPage] = useState(1);
  const latestQuery = useRef(query);

  // Fetch on query change
  useEffect(() => {
    latestQuery.current = query;

    if (!query.trim()) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setPage(1);

    fetch(`/api/v1/product/liveSearch?q=${encodeURIComponent(query.trim())}&type=results`)
      .then((res) => res.json())
      .then((json) => {
        if (latestQuery.current !== query) return; // stale response
        setProducts(json.success ? (json.data ?? []) : []);
      })
      .catch(() => {
        if (latestQuery.current !== query) return;
        setProducts([]);
      })
      .finally(() => {
        if (latestQuery.current !== query) return;
        setLoading(false);
      });
  }, [query]);

  // Client-side sort
  const sorted = useMemo(() => {
    const arr = [...products];
    switch (sort) {
      case "price_asc":
        return arr.sort((a, b) => effectivePrice(a) - effectivePrice(b));
      case "price_desc":
        return arr.sort((a, b) => effectivePrice(b) - effectivePrice(a));
      case "newest":
        return arr.sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
        );
      default:
        return arr; // original API order = relevance
    }
  }, [products, sort]);

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const startItem = (page - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(page * ITEMS_PER_PAGE, sorted.length);

  const handleSortChange = (key: SortKey) => {
    setSort(key);
    setPage(1);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[95vw] xl:container mx-auto px-4 py-6">

        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className="mb-5">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-[#00005E] animate-spin" />
              <span className="text-gray-500 text-sm">Searching for &ldquo;{query}&rdquo;…</span>
            </div>
          ) : query ? (
            <div className="flex items-center gap-2 flex-wrap">
              <Search className="w-4 h-4 text-[#00005E] flex-shrink-0" />
              <h1 className="text-base font-semibold text-gray-800">
                Results for{" "}
                <span className="text-[#00005E]">&ldquo;{query}&rdquo;</span>
              </h1>
              <span className="text-sm text-gray-400">
                — {products.length} products found
              </span>
            </div>
          ) : (
            <h1 className="text-base font-semibold text-gray-800">Search Products</h1>
          )}
        </div>

        {/* ── Sort Bar ────────────────────────────────────────────── */}
        {!loading && products.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 px-4 py-2.5 mb-5 flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wide">
              <ArrowUpDown className="w-3.5 h-3.5" />
              Sort
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => handleSortChange(opt.key)}
                  className={`
                    inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                    ${sort === opt.key
                      ? "bg-[#00005E] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }
                  `}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Range info */}
            <div className="ml-auto text-xs text-gray-400 hidden sm:block whitespace-nowrap">
              {startItem}–{endItem} of {sorted.length}
            </div>
          </div>
        )}

        {/* ── Loading Skeleton ─────────────────────────────────────── */}
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {[...Array(10)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ── Empty: no query ──────────────────────────────────────── */}
        {!loading && !query.trim() && (
          <div className="flex flex-col items-center justify-center py-28 text-center gap-3">
            <Search className="w-16 h-16 text-gray-200" />
            <p className="text-gray-400">কিছু লিখে সার্চ করুন</p>
          </div>
        )}

        {/* ── Empty: no results ────────────────────────────────────── */}
        {!loading && query.trim() && products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-28 text-center gap-3">
            <Package className="w-16 h-16 text-gray-200" />
            <p className="text-lg font-semibold text-gray-700">
              &ldquo;{query}&rdquo; এর কোনো পণ্য পাওয়া যায়নি
            </p>
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">
              বানান চেক করুন, ছোট keyword দিয়ে চেষ্টা করুন, বা অন্য কিছু search করুন।
            </p>
          </div>
        )}

        {/* ── Product Grid ─────────────────────────────────────────── */}
        {!loading && paginated.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
              {paginated.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={handlePageChange}
            />
          </>
        )}
      </div>
    </div>
  );
}