// import { Input } from '@/components/ui/input'
// import { Search, Loader2 } from 'lucide-react'
// import React, { useState, useEffect, useRef, useCallback } from 'react'
// import debounce from 'lodash/debounce'
// import Image from 'next/image'
// import Link from 'next/link'
// import { useRouter } from 'next/navigation'

// interface Suggestion {
//     _id: string
//     productTitle: string
//     productImage?: string
//     price?: number
//     discountPrice?: number
// }

// export default function SearchBar() {
//     const [searchQuery, setSearchQuery] = useState('')
//     const [suggestions, setSuggestions] = useState<Suggestion[]>([])
//     const [loading, setLoading] = useState(false)
//     const [showSuggestions, setShowSuggestions] = useState(false)
//     const router = useRouter()
//     const wrapperRef = useRef<HTMLDivElement>(null)

//     // Close suggestions when clicking outside
//     useEffect(() => {
//         const handleClickOutside = (event: MouseEvent) => {
//             if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
//                 setShowSuggestions(false)
//             }
//         }
//         document.addEventListener('mousedown', handleClickOutside)
//         return () => document.removeEventListener('mousedown', handleClickOutside)
//     }, [])

//     // Debounced live search for suggestions
//     const fetchSuggestions = useCallback(
//         debounce(async (query: string) => {
//             if (!query.trim()) {
//                 setSuggestions([])
//                 setLoading(false)
//                 return
//             }

//             try {
//                 setLoading(true)
//                 const res = await fetch(`/api/v1/product/liveSearch?q=${encodeURIComponent(query)}&type=suggestion`)
//                 const data = await res.json()

//                 if (data.success) {
//                     setSuggestions(data.data || [])
//                 } else {
//                     setSuggestions([])
//                 }
//             } catch (error) {
//                 console.error('Search suggestions error:', error)
//                 setSuggestions([])
//             } finally {
//                 setLoading(false)
//             }
//         }, 300),
//         []
//     )

//     useEffect(() => {
//         fetchSuggestions(searchQuery)
//     }, [searchQuery, fetchSuggestions])

//     const handleSearch = () => {
//         if (!searchQuery.trim()) return

//         setShowSuggestions(false)
//         router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
//     }

//     const handleSuggestionClick = (productId: string) => {
//         setShowSuggestions(false)
//         setSearchQuery('')
//         router.push(`/products/${productId}`)
//     }

//     const highlightMatch = (text: string, query: string) => {
//         if (!query) return text
//         const parts = text.split(new RegExp(`(${query})`, 'gi'))
//         return parts.map((part, i) =>
//             part.toLowerCase() === query.toLowerCase() ? (
//                 <span key={i} className="font-semibold text-blue-600">
//                     {part}
//                 </span>
//             ) : (
//                 part
//             )
//         )
//     }

//     return (
//         <div className="relative w-full max-w-2xl" ref={wrapperRef}>
//             <div className="relative">
//                 <Input
//                     placeholder="Search for products..."
//                     className="w-full pr-12 pl-4 py-6 text-base bg-white border border-gray-300 rounded-lg focus:border-black focus:ring-0 focus:outline-none z-50"
//                     value={searchQuery}
//                     onChange={(e) => {
//                         setSearchQuery(e.target.value)
//                         setShowSuggestions(true)
//                     }}
//                     onFocus={() => searchQuery && setShowSuggestions(true)}
//                     onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
//                 />
//                 <button
//                     onClick={handleSearch}
//                     className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100 transition"
//                 >
//                     {loading ? (
//                         <Loader2 className="h-5 w-5 text-[#00005E] animate-spin" />
//                     ) : (
//                         <Search className="h-5 w-5 text-[#00005E]" />
//                     )}
//                 </button>
//             </div>

//             {/* Suggestions Dropdown */}
//             {showSuggestions && searchQuery && (
//                 <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
//                     {loading ? (
//                         <div className="p-4 text-center text-gray-500">
//                             <Loader2 className="mx-auto h-6 w-6 animate-spin" />
//                         </div>
//                     ) : suggestions.length > 0 ? (
//                         <ul>
//                             {suggestions.map((item) => (
//                                 <li
//                                     key={item._id}
//                                     className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
//                                     onClick={() => handleSuggestionClick(item._id)}
//                                 >
//                                     {item.productImage ? (
//                                         <Image
//                                             src={item.productImage}
//                                             alt={item.productTitle}
//                                             width={48}
//                                             height={48}
//                                             className="rounded-md object-cover border"
//                                         />
//                                     ) : (
//                                         <div className="bg-gray-200 border-2 border-dashed rounded-md w-12 h-12" />
//                                     )}
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-sm font-medium text-gray-900 truncate">
//                                             {highlightMatch(item.productTitle, searchQuery)}
//                                         </p>
//                                         <p className="text-sm text-gray-600">
//                                             {item.discountPrice ? (
//                                                 <>
//                                                     <span className="font-semibold text-green-600">₹{item.discountPrice}</span>
//                                                     <span className="line-through text-gray-400 ml-2 text-xs">₹{item.price}</span>
//                                                 </>
//                                             ) : (
//                                                 <span className="font-semibold">₹{item.price}</span>
//                                             )}
//                                         </p>
//                                     </div>
//                                 </li>
//                             ))}
//                             {/* View all results */}
//                             <li
//                                 className="p-4 text-center border-t border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer font-medium text-blue-600"
//                                 onClick={handleSearch}
//                             >
//                                 View all results for "{searchQuery}"
//                             </li>
//                         </ul>
//                     ) : (
//                         <div className="p-8 text-center text-gray-500">
//                             <p className="text-sm">No products found for "{searchQuery}"</p>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     )
// }


"use client";

import * as React from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import debounce from "lodash/debounce";

interface Suggestion {
  _id: string;
  productTitle: string;
  productImage?: string;
  price?: number;
  discountPrice?: number;

  // These fields come from your populate in the API
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

  // close dropdown when clicking outside
  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // fetch suggestions (your existing endpoint)
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

  // ─── When user clicks a single product ─────────────────────
  const goToProduct = (productId: string) => {
    setShowDropdown(false);
    setQuery("");
    router.push(`/products/${productId}`);
  };

  // ─── When user clicks “View all results” ───────────────────
  const goToCategoryPage = () => {
    if (!query.trim() || suggestions.length === 0) return;

    // Take the FIRST suggestion (the most relevant one)
    const first = suggestions[0];

    // Build the deepest slug we have
    let targetUrl = "/search"; // fallback

    if (first.childCategory?.slug) {
      targetUrl = `/childcategory/${first.childCategory.slug}`;
    } else if (first.subCategory?.slug) {
      targetUrl = `/subcategory/${first.subCategory.slug}`;
    } else if (first.category?.slug) {
      targetUrl = `/category/${first.category.slug}`;
    }

    // Keep the search term so filters stay active
    const params = new URLSearchParams({ q: query.trim() });
    router.push(`${targetUrl}?${params.toString()}`);

    setShowDropdown(false);
    setQuery("");
  };

  const highlight = (text: string, term: string) => {
    if (!term) return text;
    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return parts.map((p, i) =>
      p.toLowerCase() === term.toLowerCase() ? (
        <span key={i} className="font-bold text-blue-600">
          {p}
        </span>
      ) : (
        p
      )
    );
  };

  return (
    <div className="relative w-full max-w-2xl" ref={wrapperRef}>
      {/* Input */}
      <div className="relative">
        <Input
          placeholder="Search for products..."
          className="w-full pl-11 pr-12 py-6 text-base bg-white border border-gray-300 rounded-lg focus:border-black focus:ring-0"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => query && setShowDropdown(true)}
          onKeyDown={(e) => e.key === "Enter" && goToCategoryPage()}
        />
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 pointer-events-none" />
        <button
          onClick={goToCategoryPage}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-[#00005E]" />
          ) : (
            <Search className="h-5 w-5 text-[#00005E]" />
          )}
        </button>
      </div>

      {/* Dropdown */}
      {showDropdown && query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : suggestions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No products found for “{query}”
            </div>
          ) : (
            <>
              <ul>
                {suggestions.map((item) => (
                  <li
                    key={item._id}
                    onClick={() => goToProduct(item._id)}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  >
                    {item.productImage ? (
                      <Image
                        src={item.productImage}
                        alt={item.productTitle}
                        width={56}
                        height={56}
                        className="rounded-md border object-cover"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-gray-200 border-2 border-dashed rounded-md" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {highlight(item.productTitle, query)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.discountPrice ? (
                          <>
                            <span className="font-bold text-green-600">
                              ৳{item.discountPrice.toLocaleString()}
                            </span>{" "}
                            <span className="line-through text-gray-400">
                              ৳{item.price?.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold">
                            ৳{item.price?.toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              {/* View all results – now goes to the correct category page */}
              <div
                onClick={goToCategoryPage}
                className="p-4 text-center bg-gray-50 border-t font-medium text-blue-600 hover:bg-gray-100 cursor-pointer"
              >
                View all results for “{query}”
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}