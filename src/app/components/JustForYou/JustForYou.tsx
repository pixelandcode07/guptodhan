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

// ✅ NEW: Next.js Loading UI (Skeleton Loader)
// গোল স্পিনারের বদলে এখন এই প্রিমিয়াম স্কেলিটন লোডার শো করবে
const ProductSkeletonGrid = () => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mt-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex h-full flex-col overflow-hidden rounded-xl sm:rounded-2xl border bg-white p-2.5 sm:p-3 animate-pulse shadow-sm">
          <div className="aspect-[4/5] sm:aspect-[3/4] w-full bg-gray-100 rounded-lg mb-3"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-100 rounded w-1/2 mb-4"></div>
          <div className="mt-auto h-8 bg-gray-200 rounded-full w-full"></div>
        </div>
      ))}
    </div>
  );
};

export function JustForYou({ initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // ইনিশিয়ালি ৬০টার কম প্রোডাক্ট আসলে বুঝে নিতে হবে আর কোনো প্রোডাক্ট নেই
  const [hasMore, setHasMore] = useState(initialProducts.length >= 60);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (loading || !hasMore) return;

    const loadMore = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const nextPage = page + 1;
        
        const res = await axios.get<{ success: boolean; data: Product[] }>(
          `${baseUrl}/api/v1/product/just-for-you?page=${nextPage}&limit=60`
        );

        if (res.data.success && res.data.data.length > 0) {
          const fetchedProducts = res.data.data;
          
          setProducts((prev) => {
            // ডুপ্লিকেট প্রোডাক্ট ফিল্টার করা
            const existingIds = new Set(prev.map(p => p._id));
            const newProducts = fetchedProducts.filter(p => !existingIds.has(p._id));
            
            // ✅ MAGIC FIX: ইনফিনিট লুপ ব্রেকার! 
            // যদি API ডাটা পাঠায় কিন্তু সবই ডুপ্লিকেট হয় (অর্থাৎ নতুন প্রোডাক্ট নেই), 
            // তাহলে সাথে সাথে hasMore(false) করে লুপ বন্ধ করে দেবে।
            if (newProducts.length === 0) {
              setTimeout(() => setHasMore(false), 0);
              return prev;
            }
            
            return [...prev, ...newProducts];
          });
          
          setPage(nextPage);
          
          // যদি লিমিটের চেয়ে কম ডাটা আসে, তার মানে ডাটাবেস শেষ
          if (fetchedProducts.length < 60) {
            setHasMore(false);
          }
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

    // Intersection Observer দিয়ে স্ক্রল ট্র্যাক করা
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
      if (currentElement && observer.current) {
        observer.current.unobserve(currentElement);
      }
    };
  }, [page, loading, hasMore]); 

  return (
    <section className="max-w-[95vw] xl:container mx-auto px-2 md:px-8 py-4">
      <PageHeader title="Just For You" />

      {/* Product Grid */}
      <ProductGrid products={products} />

      {/* ✅ FIX: Next.js Skeleton Loading UI (গোল স্পিনারের বদলে) */}
      {loading && <ProductSkeletonGrid />}

      {/* Invisible trigger for IntersectionObserver (Only visible when NOT loading) */}
      {hasMore && !loading && <div ref={lastProductRef} className="h-4 w-full mt-4" />}

      {/* View More Button */}
      <div className="flex justify-center mt-8 pt-4 border-t border-gray-100">
        <Link 
          href="/products"
          className="px-6 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all shadow-md"
        >
          View More Products
        </Link>
      </div>
    </section>
  );
}