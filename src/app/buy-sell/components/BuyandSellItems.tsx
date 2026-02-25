'use client';

import PageHeader from '@/components/ReusableComponents/PageHeader';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface CategoryDataType {
  _id: string;
  name: string;
  slug: string; // ✅ Slug added to interface
  icon?: string;
  status: 'active' | 'inactive';
  adCount?: number;
}

interface BuyandSellItemsProps {
  allCategory: CategoryDataType[];
}

export default function BuyandSellItems({ allCategory }: BuyandSellItemsProps) {
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const displayedCategories = isMobile ? allCategory?.slice(0, 4) : allCategory;

  return (
    <div className="space-y-6">
      {/* Headers */}
      <div className="mb-6 hidden md:block">
        <PageHeader title="Buy and Sell Items" />
      </div>
      <div className="md:hidden">
        <PageHeader
          title="Browse item by categories"
          buttonLabel="View All"
          buttonHref="/home/view/all/flash-sell/products"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
        {displayedCategories?.map((cat) => (
          <Link
            key={cat._id}
            // ✅ FIX: Using cat.slug instead of cat._id
            href={`/buy-sell/category-items/${cat.slug}`} 
            className="group flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex shrink-0">
              <Image
                src={cat.icon || '/placeholder.png'}
                alt={cat.name}
                width={40}
                height={40}
                className="object-contain group-hover:scale-110 transition-transform"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <span className="font-medium text-gray-800 text-sm truncate">{cat.name}</span>
              <span className="text-xs text-gray-500">{cat.adCount ?? 0} ads</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}