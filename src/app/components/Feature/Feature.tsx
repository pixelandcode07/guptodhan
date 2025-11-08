'use client';

import React from 'react';
import PageHeader from '../../../components/ReusableComponents/PageHeader';
import { ShopByCategory } from './ShopByCategory';
import { FeatureProps } from '@/types/FeaturedCategoryType';



export default function Feature({ featuredData }: FeatureProps) {
  return (
    <div className="bg-gray-100 mb-0 my-3 md:p-6 mt-2 md:max-w-[90vw] mx-auto">
      <div className="hidden lg:flex justify-center">
        <PageHeader
          title="Featured Category"
        // buttonLabel="Add Feature"
        // onButtonClick={() => console.log("Add Feature clicked")}
        />
      </div>
      <div className=" lg:hidden">
        <PageHeader
          title="Featured Category"
          buttonLabel="View All"
          // onButtonClick={() => router.push('/view/all/products')}
          buttonHref="/home/view/all/flash-sell/products"
        />
      </div>
      <main className=" flex flex-col items-center justify-between">
        <ShopByCategory featuredData={featuredData} />
      </main>
    </div>
  );
}