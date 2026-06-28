"use client";

import { useState, useEffect, useRef } from 'react';
import ProductGrid from '@/components/ReusableComponents/ProductGrid';
import PageHeader from '@/components/ReusableComponents/PageHeader';
import { Product } from '@/types/ProductType';
import axios from 'axios';
import Link from 'next/link';

interface Props {
  initialProducts: Product[];
}

export function JustForYou({ initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  // যদি প্রথমবারই ৬০ এর কম আসে, তার মানে ডাটাবেসে আর প্রোডাক্ট নেই, তাই hasMore false হবে
  const [hasMore, setHasMore] = useState(initialProducts.length >= 60);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement>(null);

  // Infinite Scroll Logic
  useEffect(() => {
    if (loading || !hasMore) return;

    const loadMore = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        // ✅ API তে 60 লিমিট পাঠানো হচ্ছে
        const res = await axios.get<{ success: boolean; data: Product[] }>(
          `${baseUrl}/api/v1/product/offerProduct?page=${page + 1}&limit=60`
        );

        if (res.data.success && res.data.data.length > 0) {
          setProducts((prev) => {
            // Duplicate ডাটা চেক করার জন্য
            const existingIds = new Set(prev.map(p => p._id));
            const newProducts = res.data.data.filter(p => !existingIds.has(p._id));
            return [...prev, ...newProducts];
          });
          setPage((prev) => prev + 1);
          // যদি ৬০টার কম আসে, তার মানে আর ডাটা নেই
          setHasMore(res.data.data.length >= 60);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Failed to load more products:', error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    const currentElement = lastProductRef.current;
    const currentObserver = observer.current;

    if (currentElement) {
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !loading) {
            loadMore();
          }
        },
        { threshold: 0.1 }
      );

      observer.current.observe(currentElement);
    }

    return () => {
      if (currentElement && currentObserver) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [page, loading, hasMore]);

  return (
    <section className="max-w-[95vw] xl:container mx-auto px-2 md:px-8 py-4">
      <PageHeader title="Just For You" />

      {/* Product Grid */}
      <ProductGrid products={products} />

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-purple-600"></div>
        </div>
      )}

      {/* Invisible trigger for IntersectionObserver */}
      {hasMore && <div ref={lastProductRef} className="h-1" />}

      {/* View More Products Button */}
      <div className="flex justify-center mt-8 pt-4 border-t border-gray-100">
        <Link 
          href="/products/all" // ✅ URL টি '/products/all' বা আপনার অল প্রোডাক্টস পেজের লিঙ্ক করে দিলাম
          className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-md"
        >
          View More Products
        </Link>
      </div>
    </section>
  );
}