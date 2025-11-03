'use client';

import PageHeader from '@/components/ReusableComponents/PageHeader';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { ProductCardType } from '@/types/ProductCardType';

interface JustForYouProps {
  justForYouData: ProductCardType[];
}

export default function JustForYou({ justForYouData }: JustForYouProps) {
  const [visibleCount, setVisibleCount] = useState(20); // show first 20

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 20); // load 20 more each time
  };

  return (
    <div className="bg-gray-100 max-w-7xl mx-auto py-15">
      <PageHeader
        title="Just For You"
      />

      <div className="grid justify-center items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 px-4">
        {justForYouData?.slice(0, visibleCount).map((item) => (
          <Link href={`/products/${item._id}`} key={item._id}>
            <div className="bg-white rounded-md border-2 border-gray-200 hover:border-blue-300 overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer">
              {/* Product Image */}
              <div className="w-full h-36 flex items-center justify-center overflow-hidden">
                <Image
                  src={item.thumbnailImage}
                  alt={item.productTitle}
                  width={150}
                  height={150}
                  className="p-1 rounded-md w-full h-[20vh] border-b-2 border-gray-200"
                />
              </div>

              {/* Product Details */}
              <div className="p-2">
                <h3 className="text-sm font-medium truncate">{item.productTitle}</h3>
                <p className="text-[#0084CB] font-semibold text-base">
                  ₹{item.discountPrice}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500 line-through">
                    ₹{item.productPrice}
                  </p>
                  <p className="text-xs text-red-500">
                    -
                    {Math.round(
                      ((item.productPrice - item.discountPrice) / item.productPrice) * 100
                    )}
                    %
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Show Load More only if there are more products */}
      {visibleCount < justForYouData.length && (
        <div className="flex justify-center my-8">
          <button
            onClick={handleLoadMore}
            className="px-6 py-2 bg-[#0084CB] text-white font-medium rounded-md hover:bg-[#006da3] transition">
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
