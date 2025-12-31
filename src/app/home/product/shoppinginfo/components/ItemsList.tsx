'use client';

import React from 'react';
import Image from 'next/image';
import { BadgeCheck } from 'lucide-react';
import type { CartItem } from '../../shopping-cart/ShoppingCartContent';

export default function ItemsList({ items }: { items: CartItem[] }) {
  const totalItems = items.reduce((s, i) => s + i.product.quantity, 0);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">
        Items ({totalItems})
      </h2>

      <div className="bg-white rounded-lg border divide-y">
        {items.map(item => (
          <div key={item.id} className="p-4 hover:bg-gray-50 transition">
            {/* Seller */}
            <div className="flex items-center gap-2 mb-3 text-sm">
              <span className="font-medium text-gray-900">
                {item.seller.name}
              </span>
              <span className="flex items-center gap-1 text-blue-600 text-xs">
                Verified
                <BadgeCheck className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Row */}
            <div className="flex items-center gap-4">
              {/* Image */}
              <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                <Image
                  src={item.product.image}
                  alt={item.product.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">
                  {item.product.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.product.size} · {item.product.color}
                </p>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-sm font-semibold text-blue-600">
                  ৳ {item.product.price.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 line-through">
                  ৳ {item.product.originalPrice.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
