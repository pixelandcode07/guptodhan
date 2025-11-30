'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { Product } from './types';
import { getEntityId, getCategoryName } from './utils';

interface ProductBreadcrumbProps {
  product: Product;
}

export default function ProductBreadcrumb({ product }: ProductBreadcrumbProps) {
  return (
    <div className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-gray-500">
          <Link href="/" className="hover:text-[#0099cc] flex items-center gap-1 transition-colors">
            <Home size={14} /> Home
          </Link>
          <ChevronRight size={14} className="text-gray-300" />
          <Link href={`/category/${getEntityId(product.category)}`} className="hover:text-[#0099cc] transition-colors">
            {getCategoryName(product)}
          </Link>
          <ChevronRight size={14} className="text-gray-300" />
          <span className="text-[#0099cc] font-medium truncate max-w-[200px]">
            {product.productTitle}
          </span>
        </div>
      </div>
    </div>
  );
}

