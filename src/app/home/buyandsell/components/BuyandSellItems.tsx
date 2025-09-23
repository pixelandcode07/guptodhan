// 'use client'

import PageHeader from '@/components/ReusableComponents/PageHeader'
import { categories } from '@/data/buy_sell_data'
import Image from 'next/image'
import React from 'react'

export default function BuyandSellItems() {
  return (
    <div>
      <div className='border-b border-gray-200 pb-6 mb-6'>
        <PageHeader title="Buy and Sell Items" />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 justify-start items-start gap-4'>
        {categories.map((catItems, idx) => (
          <div key={idx} className='justify-self-start flex justify-center items-center gap-4 mb-6'>
            <div className="image">
              <Image src={catItems.logo} alt={catItems.name} width={30} height={30} />
            </div>
            <h1>
              {catItems.name}
            </h1>
          </div>
        ))}
      </div>
    </div>
  )
}
