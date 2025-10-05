'use client';

import PageHeader from '@/components/ReusableComponents/PageHeader';
import { flashSale } from '@/data/flash_sale_data';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export default function JustForYou() {
  const [visibleCount, setVisibleCount] = useState(20); // show first 20

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 20); // load 20 more each time
  };

  return (
    <div className="bg-gray-100 max-w-7xl mx-auto py-15">
      <PageHeader title="Just For You" />

      <div className="grid justify-center items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 px-4">
        {flashSale.slice(0, visibleCount).map((item, idx) => (
          <Link href={`/products/${item.productName}`} key={idx}>
            <div className="bg-white rounded-md overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer">
              {/* Product Image */}
              <div className="w-full h-36 flex items-center justify-center overflow-hidden">
                <Image
                  src={item.productImage}
                  alt={item.productName}
                  width={150}
                  height={150}
                  className="object-contain"
                />
              </div>

              {/* Product Details */}
              <div className="p-2">
                <h3 className="text-sm font-medium truncate">{item.productName}</h3>
                <p className="text-[#0084CB] font-semibold text-base">
                  ₹{item.productActualPrice}
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-500 line-through">
                    ₹{item.productDiscountPrice}
                  </p>
                  <p className="text-xs text-red-500">-15%</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Show Load More only if there are more products */}
      {visibleCount < flashSale.length && (
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
