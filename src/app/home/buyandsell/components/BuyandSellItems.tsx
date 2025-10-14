'use client'

import PageHeader from '@/components/ReusableComponents/PageHeader'
import Image from 'next/image'
import React from 'react'
import { CategoryDataType } from './BuyandSellHome'

interface SubCategoryType {
  _id: string;
  name: string;
  category: string;
  icon?: string;
  status: 'active' | 'inactive';
}

interface ExtendedCategoryDataType extends CategoryDataType {
  subCategories?: SubCategoryType[];
}

interface BuyandSellItemsProps {
  allCategory: ExtendedCategoryDataType[];
}

export default function BuyandSellItems({ allCategory }: BuyandSellItemsProps) {
  return (
    <div>
      <div className='border-b border-gray-200 pb-6 mb-6'>
        <PageHeader title="Buy and Sell Items" />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 justify-start items-start gap-4'>
        {allCategory?.map((catItems) => {
          const subCount = catItems.subCategories?.length || 0;
          return (
            <div
              key={catItems._id}
              className='justify-self-start flex justify-center items-center gap-4 mb-6'
            >
              <div className="image">
                <Image
                  src={catItems?.icon ?? '/placeholder.png'}
                  alt={catItems.name}
                  width={30}
                  height={30}
                />
              </div>
              <h1 className='font-medium text-gray-700'>
                {catItems.name}
                {subCount > 0 && (
                  <span className='text-sm text-gray-500 ml-1'>
                    ({subCount})
                  </span>
                )}
              </h1>
            </div>
          )
        })}
      </div>
    </div>
  )
}
