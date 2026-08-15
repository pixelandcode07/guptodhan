'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link'; 
import { Star, Loader2, PackageSearch } from 'lucide-react';
import axios from 'axios';

export default function ReviewHistory() {
  const { data: session } = useSession();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!session?.user) {
        setLoading(false);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = session.user as any;
      const userId = user.id || user._id;

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`/api/v1/product-review/product-review-user/${userId}`, {
          headers: {
            ...(user.accessToken ? { Authorization: `Bearer ${user.accessToken}` } : {})
          }
        });

        if (res.data.success) {
          setReviews(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-500 font-medium">Loading your reviews...</span>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 bg-white rounded-lg border mt-2">
        <PackageSearch className="w-16 h-16 mb-4 text-gray-300" />
        <p className="font-medium text-gray-600">You haven't reviewed any products yet.</p>
        <p className="text-xs text-gray-400 mt-1">Once you write a review, it will appear here.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg border mt-2">
      <h3 className="font-semibold text-gray-800 border-b pb-3 mb-4">Your Past Reviews</h3>
      <div className="space-y-6 md:max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {reviews.map((item) => {
          // ✅ MAGIC FIX: লিংকের শেষে #reviews অ্যাড করা হলো যাতে সরাসরি রিভিউ ট্যাবে যায়!
          const productSlug = item.productId?.slug || item.productId?._id;
          const productLink = `/product/${productSlug}#reviews`;

          return (
            <div key={item._id} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
              <div className="flex gap-4">
                {/* ✅ ক্লিকেবল ইমেজ */}
                <Link href={productLink} className="w-16 h-16 relative rounded-md border border-gray-200 overflow-hidden shrink-0 block group">
                  <Image 
                    src={item.productId?.thumbnailImage || '/img/product/p-1.png'} 
                    alt={item.productId?.productTitle || 'Product'} 
                    fill 
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </Link>
                
                <div className="flex-1 min-w-0">
                  {/* ✅ ক্লিকেবল টাইটেল */}
                  <Link href={productLink} className="group">
                    <h3 className="font-semibold text-sm text-gray-800 line-clamp-2 group-hover:text-blue-600 group-hover:underline transition-colors">
                      {item.productId?.productTitle || 'Product'}
                    </h3>
                  </Link>
                  <p className="text-xs text-gray-500 mt-1">
                    Reviewed on: {new Date(item.uploadedTime || item.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <div className="flex text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < item.rating ? 'currentColor' : 'none'}
                      className={i >= item.rating ? 'text-gray-300' : ''}
                    />
                  ))}
                </div>
                <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs font-medium">
                  {item.rating >= 4 ? 'Excellent' : item.rating === 3 ? 'Average' : 'Poor'}
                </span>
              </div>

              <div className="mt-3 bg-gray-50 p-3 rounded text-sm text-gray-700 leading-relaxed border border-gray-100">
                {item.comment || <span className="italic text-gray-400">No written feedback provided.</span>}
              </div>

              {/* Review Images */}
              {item.reviewImages && item.reviewImages.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {item.reviewImages.map((img: string, i: number) => (
                    <div key={i} className="relative w-16 h-16 rounded border border-gray-200 overflow-hidden cursor-zoom-in hover:opacity-90">
                      <Image src={img} alt={`Review Image ${i}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}