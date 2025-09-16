'use client';

import PageHeader from '@/components/ReusableComponents/PageHeader';
import { flashSale } from '@/data/flash_sale_data';
import Image from 'next/image';
import React, { useState } from 'react';

export default function JustForYou() {
  const [visibleCount, setVisibleCount] = useState(20); // show first 20

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 20); // load 20 more each time
  };

  return (
    <div className="max-w-7xl mx-auto py-15">
      <PageHeader title="Just For You" />

      <div className="grid justify-center items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8">
        {flashSale.slice(0, visibleCount).map((item, idx) => (
          <div key={idx}>
            <div className="image">
              <Image
                src={item.productImage}
                alt={item.productName}
                width={200}
                height={200}
                className="w-full min-h-40"
              />
            </div>
            <div className="product-details">
              <h3 className="font-medium text-base">{item.productName}</h3>
              <p className="text-[#0084CB] font-medium text-base">
                ₹{item.productActualPrice}
              </p>
              <p className="font-medium text-[10px]">
                ₹{item.productDiscountPrice}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Show Load More only if there are more products */}
      {visibleCount < flashSale.length && (
        <div className="flex justify-center mt-8">
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
