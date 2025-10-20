'use client'

import PageHeader from '@/components/ReusableComponents/PageHeader'
import Image from 'next/image'
import React from 'react'

interface CategoryDataType {
  _id: string
  name: string
  icon?: string
  status: 'active' | 'inactive'
  adCount?: number
}

interface BuyandSellItemsProps {
  allCategory: CategoryDataType[]
}

export default function BuyandSellItems({ allCategory }: BuyandSellItemsProps) {
  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <PageHeader title="Buy and Sell Items" />
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
        {allCategory?.map((cat) => (
          <div
            key={cat._id}
            className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all cursor-pointer"
          >
            {/* Category Icon */}
            <div className="flex-shrink-0">
              <Image
                src={cat.icon || '/placeholder.png'}
                alt={cat.name}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>

            {/* Category Info */}
            <div className="flex flex-col">
              <span className="font-medium text-gray-800 text-sm">{cat.name}</span>
              <span className="text-xs text-gray-500">{cat.adCount ?? 0} ads</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
