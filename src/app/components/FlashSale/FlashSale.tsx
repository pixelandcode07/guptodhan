'use client';

import PageHeader from '@/components/ReusableComponents/PageHeader';
import { flashSale } from '@/data/flash_sale_data';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import Banner from '../../../../public/img/banner2.jpg';
import Link from 'next/link';

export default function FlashSale() {
  const router = useRouter();
  return (
    <div className="max-w-7xl mx-auto py-15">
      <PageHeader
        title="Flash Sale"
        buttonLabel="Shop All Products"
        onButtonClick={() => router.push('/view/all/products')}
      />
      <div className="grid justify-center items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-8">
        {flashSale.slice(0, 6).map((item, idx) => (
          <div key={idx}>
            <Link href={`/products/${item.productName}`}>
              <div className="image">
                <Image
                  src={item.productImage}
                  alt="Product Image"
                  width={200}
                  height={200}
                  className="w-full min-h-40"
                />
              </div>
            </Link>
            <div className="product-details ">
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
      <div className="banner py-10">
        <Image
          src={Banner}
          width={1000}
          height={300}
          alt="banner"
          className="w-full"
        />
      </div>
    </div>
  );
}
