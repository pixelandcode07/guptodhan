"use client";

import * as React from "react";
import { Search, Loader2, X, ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";
import { cn } from "@/lib/utils"; // Assuming you have a utils file, usually in shadcn

interface Suggestion {
  _id: string;
  slug?: string;
  productTitle: string;
  productImage?: string;
  price?: number;
  discountPrice?: number;

  // These fields come from populate in the API
  category?: { slug: string };
  subCategory?: { slug: string };
  childCategory?: { slug: string };
}

export default function SearchBar() {
  const [query, setQuery] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const router = useRouter();
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch suggestions
  const fetchSuggestions = React.useCallback(
    debounce(async (q: string) => {
      if (!q.trim()) {
        setSuggestions([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch(
          `/api/v1/product/liveSearch?q=${encodeURIComponent(q)}&type=suggestion`
        );
        const json = await res.json();
        setSuggestions(json.success ? json.data || [] : []);
      } catch (err) {
        console.error(err);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  React.useEffect(() => {
    fetchSuggestions(query);
  }, [query, fetchSuggestions]);

  // When user clicks a single product
  const goToProduct = (slug: string) => {
    setShowDropdown(false);
    setQuery("");
    router.push(`/products/${slug}`);
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    inputRef.current?.focus();
  };

  // When user clicks “View all results” or hits Enter
  const goToCategoryPage = () => {
    if (!query.trim()) return;

    let targetUrl = "/search";

    // If we have suggestions, try to be smart about the category
    if (suggestions.length > 0) {
      const first = suggestions[0];
      if (first.childCategory?.slug) {
        targetUrl = `/childcategory/${first.childCategory.slug}`;
      } else if (first.subCategory?.slug) {
        targetUrl = `/subcategory/${first.subCategory.slug}`;
      } else if (first.category?.slug) {
        targetUrl = `/category/${first.category.slug}`;
      }
    }

    const params = new URLSearchParams({ q: query.trim() });
    router.push(`${targetUrl}?${params.toString()}`);
    setShowDropdown(false);
    setQuery("");
  };

  // Highlight matching text
  const highlight = (text: string, term: string) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return parts.map((p, i) =>
      p.toLowerCase() === term.toLowerCase() ? (
        <span key={i} className="text-[#00005E] font-bold bg-yellow-100 px-0.5 rounded-sm">
          {p}
        </span>
      ) : (
        p
      )
    );
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto z-50" ref={wrapperRef}>
      {/* Search Input Container */}
      <div
        className={cn(
          "relative flex items-center w-full h-12 rounded-full border-2 transition-all duration-200 bg-white overflow-hidden",
          showDropdown && query
            ? "border-[#00005E] shadow-lg rounded-b-none rounded-t-[20px]"
            : "border-gray-200 hover:border-gray-400 focus-within:border-[#00005E] focus-within:shadow-md"
        )}
      >
        <div className="pl-4 text-gray-400">
          <Search className="w-5 h-5" />
        </div>

        <input
          ref={inputRef}
          type="text"
          placeholder="Search for products, brands and more..."
          className="flex-1 w-full h-full px-3 text-gray-700 bg-transparent outline-none placeholder:text-gray-400 text-base"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => query && setShowDropdown(true)}
          onKeyDown={(e) => e.key === "Enter" && goToCategoryPage()}
        />

        {/* Clear Button (Visible only when typing) */}
        {query && (
          <button
            onClick={clearSearch}
            className="p-2 mr-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Search Button */}
        <button
          onClick={goToCategoryPage}
          className="h-[calc(100%-8px)] mr-1 px-6 bg-[#00005E] hover:bg-[#000045] text-white rounded-full font-medium text-sm transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
        </button>
      </div>

      {/* Dropdown Results */}
      {showDropdown && query && (
        <div className="absolute top-full left-0 right-0 bg-white border-x-2 border-b-2 border-[#00005E] rounded-b-[20px] shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          
          {loading && suggestions.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#00005E] mb-2" />
              <p className="text-sm">Searching for best matches...</p>
            </div>
          ) : suggestions.length === 0 ? (
            <div className="py-10 flex flex-col items-center justify-center text-gray-500">
              <ShoppingBag className="w-10 h-10 mb-3 text-gray-300" />
              <p className="text-base font-medium text-gray-600">No products found</p>
              <p className="text-sm text-gray-400">Try checking your spelling or use different keywords.</p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Top Suggestions</span>
                <span className="text-xs text-gray-400">{suggestions.length} results</span>
              </div>

              {/* List */}
              <ul className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                {suggestions.map((item) => (
                  <li
                    key={item._id}
                    onClick={() => goToProduct(item.slug as string)}
                    className="group flex items-center gap-4 p-3 hover:bg-blue-50/50 cursor-pointer border-b border-gray-100 last:border-0 transition-colors duration-150"
                  >
                    {/* Image Container */}
                    <div className="relative w-12 h-12 flex-shrink-0 bg-white rounded-md border border-gray-200 overflow-hidden group-hover:border-blue-200">
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productTitle}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-300">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <p className="text-sm font-medium text-gray-800 truncate group-hover:text-[#00005E] transition-colors">
                        {highlight(item.productTitle, query)}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-0.5">
                        {item.discountPrice ? (
                          <>
                            <span className="text-sm font-bold text-[#00005E]">
                              ৳{item.discountPrice.toLocaleString()}
                            </span>
                            <span className="text-xs text-gray-400 line-through">
                              ৳{item.price?.toLocaleString()}
                            </span>
                            {/* Discount Badge Logic (Optional) */}
                            {item.price && (
                                <span className="text-[10px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                                  {Math.round(((item.price - item.discountPrice) / item.price) * 100)}% OFF
                                </span>
                            )}
                          </>
                        ) : (
                          <span className="text-sm font-bold text-gray-700">
                            ৳{item.price?.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Arrow Icon on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity pr-2 text-[#00005E]">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                  </li>
                ))}
              </ul>

              {/* View All Footer */}
              <div
                onClick={goToCategoryPage}
                className="p-3 bg-gray-50 hover:bg-[#00005E] group cursor-pointer border-t border-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span className="text-sm font-medium text-[#00005E] group-hover:text-white">
                  See all results for "{query}"
                </span>
                <ArrowRight className="w-4 h-4 text-[#00005E] group-hover:text-white" />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}