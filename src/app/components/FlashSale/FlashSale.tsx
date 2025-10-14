'use client';

import PageHeader from '@/components/ReusableComponents/PageHeader';
import { flashSale } from '@/data/flash_sale_data';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Banner from '../../../../public/img/banner2.jpg';
import Link from 'next/link';

export default function FlashSale() {
  const router = useRouter();
  const [itemsToShow, setItemsToShow] = useState(6);

  useEffect(() => {
    const updateItems = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(2); // mobile
      } else if (window.innerWidth < 1024) {
        setItemsToShow(4); // tablet
      } else {
        setItemsToShow(6); // laptop/desktop
      }
    };

    updateItems();
    window.addEventListener('resize', updateItems);
    return () => window.removeEventListener('resize', updateItems);
  }, []);

  return (
    <div className="bg-gray-100 pt-15">
      <div className="max-w-7xl mx-auto">
        <PageHeader
          title="Flash Sale"
          buttonLabel="Shop All Products"
          onButtonClick={() => router.push('/view/all/products')}
        />

        {/* Product Grid */}
        <div className="grid justify-center items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 px-4">
          {flashSale.slice(0, itemsToShow).map((item, idx) => (
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

        {/* Banner Section */}
        <div className="banner pt-5 lg:py-10 px-4">
          <Image
            src={Banner}
            width={1000}
            height={300}
            alt="banner"
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
}
