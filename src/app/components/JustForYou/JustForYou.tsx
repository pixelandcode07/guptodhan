"use client";

import { useState, useEffect, useRef } from 'react';
import ProductGrid from '@/components/ReusableComponents/ProductGrid';
import PageHeader from '@/components/ReusableComponents/PageHeader';
import { Product } from '@/types/ProductType';
import axios from 'axios';

interface Props {
  initialProducts: Product[];
}

export function JustForYou({ initialProducts }: Props) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastProductRef = useRef<HTMLDivElement>(null);

  // Infinite Scroll Logic
  useEffect(() => {
    if (loading || !hasMore) return;

    const loadMore = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await axios.get<{ success: boolean; data: Product[] }>(
          `${baseUrl}/api/v1/product/offerProduct?page=${page + 1}&limit=20`
        );

        if (res.data.success && res.data.data.length > 0) {
          setProducts((prev) => [...prev, ...res.data.data]);
          setPage((prev) => prev + 1);
          setHasMore(res.data.data.length === 20);
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
      {/* bg-gradient-to-b from-purple-50 to-white */}
      <PageHeader title="Just For You" />

      {/* Product Grid */}
      <ProductGrid products={products} />

      {/* Loading Spinner */}
      {loading && (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-purple-600"></div>
        </div>
      )}

      {/* No More Data */}
      {!hasMore && products.length > 0 && (
        <p className="text-center text-gray-500 py-6">No more products to show.</p>
      )}

      {/* Invisible trigger for IntersectionObserver */}
      {hasMore && <div ref={lastProductRef} className="h-1" />}
    </section>
  );
}