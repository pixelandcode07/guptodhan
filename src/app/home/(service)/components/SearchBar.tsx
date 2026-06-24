"use client";

import * as React from "react";
import {
  Search,
  Loader2,
  X,
  ShoppingBag,
  ArrowRight,
  Clock,
  TrendingUp,
  Tag,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Suggestion {
  _id: string;
  slug?: string;
  productTitle: string;
  thumbnailImage?: string;
  productPrice?: number;
  discountPrice?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const TRENDING: string[] = [
  "মোবাইল ফোন",
  "ল্যাপটপ",
  "স্মার্টওয়াচ",
  "ব্লুটুথ হেডফোন",
  "এয়ারপডস",
];

const RECENT_KEY = "guptodhan_recent_searches";
const MAX_RECENT = 6;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveRecentSearch(term: string) {
  if (typeof window === "undefined" || !term.trim()) return;
  const prev = getRecentSearches().filter(
    (s) => s.toLowerCase() !== term.toLowerCase()
  );
  localStorage.setItem(
    RECENT_KEY,
    JSON.stringify([term.trim(), ...prev].slice(0, MAX_RECENT))
  );
}

function removeRecentSearch(term: string) {
  const updated = getRecentSearches().filter((s) => s !== term);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

function clearAllRecent() {
  localStorage.setItem(RECENT_KEY, JSON.stringify([]));
}

// ─── Highlight match ──────────────────────────────────────────────────────────

function Highlight({ text, term }: { text: string; term: string }) {
  if (!term || !text) return <>{text}</>;
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escaped})`, "gi"));
  return (
    <>
      {parts.map((p, i) =>
        p.toLowerCase() === term.toLowerCase() ? (
          <mark
            key={i}
            className="bg-yellow-100 text-[#00005E] font-semibold not-italic rounded-sm px-0.5"
          >
            {p}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}

// ─── Discount % ───────────────────────────────────────────────────────────────

function discountPct(original?: number, discounted?: number) {
  if (!original || !discounted || discounted >= original) return null;
  return Math.round(((original - discounted) / original) * 100);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SearchBar() {
  const router = useRouter();

  const [query, setQuery] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [activeIdx, setActiveIdx] = React.useState(-1);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);

  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  // Load recent searches on mount
  React.useEffect(() => {
    setRecentSearches(getRecentSearches());
  }, [open]);

  // Click outside → close
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveIdx(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Fetch suggestions (debounced) ──────────────────────────────────────────

  const fetchSuggestions = React.useCallback(
    debounce(async (q: string) => {
      const text = q.trim();
      if (!text) {
        setSuggestions([]);
        setLoading(false);
        return;
      }

      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      setLoading(true);
      try {
        const res = await fetch(
          `/api/v1/product/liveSearch?q=${encodeURIComponent(text)}&type=suggestion`,
          { signal: ctrl.signal }
        );
        const json = await res.json();
        setSuggestions(json.success ? json.data ?? [] : []);
      } catch (err: any) {
        if (err.name !== "AbortError") setSuggestions([]);
      } finally {
        if (abortRef.current === ctrl) setLoading(false);
      }
    }, 280),
    []
  );

  React.useEffect(() => {
    setActiveIdx(-1);
    fetchSuggestions(query);
    return () => {
      fetchSuggestions.cancel();
      abortRef.current?.abort();
    };
  }, [query, fetchSuggestions]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const commitSearch = (term: string) => {
    if (!term.trim()) return;
    saveRecentSearch(term.trim());
    setOpen(false);
    setQuery("");
    router.push(`/search?q=${encodeURIComponent(term.trim())}`);
  };

  const goToProduct = (item: Suggestion) => {
    saveRecentSearch(item.productTitle);
    setOpen(false);
    setQuery("");
    router.push(`/product/${item.slug ?? item._id}`);
  };

  const handleSearchBtn = () => commitSearch(query);

  const handleClear = () => {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleRemoveRecent = (e: React.MouseEvent, term: string) => {
    e.stopPropagation();
    removeRecentSearch(term);
    setRecentSearches(getRecentSearches());
  };

  const handleClearAll = () => {
    clearAllRecent();
    setRecentSearches([]);
  };

  // ── Keyboard navigation ───────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const items = suggestions; // navigate through suggestions
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIdx >= 0 && items[activeIdx]) {
        goToProduct(items[activeIdx]);
      } else {
        handleSearchBtn();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
    }
  };

  // ── Dropdown content ──────────────────────────────────────────────────────

  const showEmpty = open && !query.trim();
  const showSuggestions = open && query.trim().length > 0;
  const isActive = open;

  return (
    <div className="relative w-full" ref={wrapperRef}>
      {/* ── Input row ─────────────────────────────────────────────── */}
      <div
        className={`
          flex items-center w-full h-11 rounded-full
          bg-white border-2 transition-all duration-200
          ${isActive
            ? "border-[#00005E] shadow-[0_4px_20px_rgba(0,0,94,0.15)] rounded-b-none rounded-t-3xl"
            : "border-gray-200 hover:border-[#0097E9]"
          }
          overflow-hidden
        `}
      >
        {/* Search icon */}
        <span className="pl-4 pr-2 flex-shrink-0 text-gray-400">
          <Search className="w-4 h-4" />
        </span>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          placeholder="Search products, brands & more..."
          className="flex-1 h-full bg-transparent text-sm text-gray-800 placeholder:text-gray-400 outline-none pr-2"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {/* Clear btn */}
        {query && (
          <button
            onClick={handleClear}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Divider */}
        <span className="h-5 w-px bg-gray-200 flex-shrink-0" />

        {/* Search button */}
        <button
          onClick={handleSearchBtn}
          className="
            flex-shrink-0 h-full px-5
            bg-[#00005E] hover:bg-[#0000a0] active:bg-[#000044]
            text-white text-sm font-semibold
            flex items-center gap-1.5
            transition-colors duration-150
            rounded-r-full
          "
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </>
          )}
        </button>
      </div>

      {/* ── Dropdown ──────────────────────────────────────────────── */}
      {isActive && (
        <div
          className="
            absolute top-full left-0 right-0 z-50
            bg-white border-x-2 border-b-2 border-[#00005E]
            rounded-b-2xl
            shadow-[0_8px_30px_rgba(0,0,94,0.12)]
            overflow-hidden
          "
        >
          {/* ── Empty state: recent + trending ─────────────────── */}
          {showEmpty && (
            <div className="divide-y divide-gray-100">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      Recent Searches
                    </span>
                    <button
                      onClick={handleClearAll}
                      className="text-[11px] text-[#0097E9] hover:underline font-medium"
                    >
                      Clear all
                    </button>
                  </div>
                  <ul className="flex flex-col gap-0.5">
                    {recentSearches.map((term) => (
                      <li
                        key={term}
                        onClick={() => commitSearch(term)}
                        className="
                          group flex items-center justify-between gap-3
                          px-2 py-1.5 rounded-lg cursor-pointer
                          hover:bg-blue-50 transition-colors
                        "
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Clock className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                          <span className="text-sm text-gray-700 truncate">{term}</span>
                        </div>
                        <button
                          onClick={(e) => handleRemoveRecent(e, term)}
                          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all flex-shrink-0"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Trending */}
              <div className="px-4 py-3">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest block mb-2">
                  Trending Now
                </span>
                <div className="flex flex-wrap gap-2">
                  {TRENDING.map((t) => (
                    <button
                      key={t}
                      onClick={() => commitSearch(t)}
                      className="
                        inline-flex items-center gap-1.5 px-3 py-1.5
                        text-xs font-medium text-[#00005E]
                        bg-blue-50 hover:bg-[#00005E] hover:text-white
                        rounded-full border border-blue-100 hover:border-[#00005E]
                        transition-all duration-150
                      "
                    >
                      <TrendingUp className="w-3 h-3" />
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Live suggestions ────────────────────────────────── */}
          {showSuggestions && (
            <>
              {/* Loading skeleton */}
              {loading && suggestions.length === 0 && (
                <div className="px-4 py-3 space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3 animate-pulse">
                      <div className="w-10 h-10 rounded-md bg-gray-100 flex-shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* No results */}
              {!loading && suggestions.length === 0 && (
                <div className="py-10 flex flex-col items-center gap-2 text-gray-400">
                  <ShoppingBag className="w-10 h-10 text-gray-200" />
                  <p className="text-sm font-medium text-gray-500">No products found</p>
                  <p className="text-xs text-gray-400">
                    Try different keywords or check spelling
                  </p>
                </div>
              )}

              {/* Results */}
              {suggestions.length > 0 && (
                <>
                  {/* Header */}
                  <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      Products
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {suggestions.length} found
                    </span>
                  </div>

                  {/* List */}
                  <ul className="max-h-[55vh] overflow-y-auto overscroll-contain">
                    {suggestions.map((item, idx) => {
                      const pct = discountPct(item.productPrice, item.discountPrice);
                      const isHighlighted = idx === activeIdx;

                      return (
                        <li
                          key={item._id}
                          onClick={() => goToProduct(item)}
                          onMouseEnter={() => setActiveIdx(idx)}
                          className={`
                            flex items-center gap-3 px-4 py-2.5 cursor-pointer
                            border-b border-gray-50 last:border-0
                            transition-colors duration-100
                            ${isHighlighted ? "bg-blue-50" : "hover:bg-gray-50"}
                          `}
                        >
                          {/* Thumbnail */}
                          <div className="relative w-11 h-11 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                            {item.thumbnailImage ? (
                              <Image
                                src={item.thumbnailImage}
                                alt={item.productTitle}
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800 truncate leading-snug">
                              <Highlight text={item.productTitle} term={query} />
                            </p>

                            <div className="flex items-center gap-2 mt-0.5">
                              {item.discountPrice ? (
                                <>
                                  <span className="text-sm font-bold text-[#00005E]">
                                    ৳{item.discountPrice.toLocaleString()}
                                  </span>
                                  <span className="text-xs text-gray-400 line-through">
                                    ৳{item.productPrice?.toLocaleString()}
                                  </span>
                                  {pct && (
                                    <span className="text-[10px] font-bold text-white bg-green-500 px-1.5 py-0.5 rounded-full">
                                      -{pct}%
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span className="text-sm font-bold text-gray-700">
                                  ৳{item.productPrice?.toLocaleString() ?? 0}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Arrow */}
                          <ArrowRight
                            className={`
                              w-4 h-4 flex-shrink-0 transition-all duration-150
                              ${isHighlighted ? "text-[#00005E] translate-x-0.5" : "text-gray-200"}
                            `}
                          />
                        </li>
                      );
                    })}
                  </ul>

                  {/* Footer CTA */}
                  <button
                    onClick={handleSearchBtn}
                    className="
                      w-full flex items-center justify-center gap-2
                      py-3 px-4
                      bg-gray-50 hover:bg-[#00005E]
                      border-t border-gray-100
                      text-sm font-semibold text-[#00005E] hover:text-white
                      transition-colors duration-200 group
                    "
                  >
                    <Tag className="w-4 h-4" />
                    <span>See all results for &ldquo;{query}&rdquo;</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}