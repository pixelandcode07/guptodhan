"use client"

import React from 'react'
import Image from 'next/image'
import { BadgeCheck } from 'lucide-react'
import type { CartItem } from '../../shopping-cart/ShoppingCartContent'

export default function ItemsList({ items }: { items: CartItem[] }) {
  const totalItems = items.reduce((s, i) => s + i.product.quantity, 0)

  return (
    <div className="space-y-4">
      <div className="text-2xl font-semibold text-gray-900">Item ({totalItems} Items)</div>

      <div className="space-y-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-6 shadow-sm">
            {/* Seller row */}
            <div className="flex items-center gap-3 text-sm mb-4">
              <span className="text-gray-900 font-semibold text-lg">{item.seller.name}</span>
              <span className="text-blue-600 flex items-center gap-1">
                <span className="text-sm">Verified Seller</span>
                <BadgeCheck className="w-4 h-4" />
              </span>
            </div>

            {/* Content row */}
            <div className="flex gap-4">
              <div className="w-28 h-28 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                <Image src={item.product.image} alt={item.product.name} width={112} height={112} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{item.product.name}</div>
                <div className="text-sm text-gray-600 mt-2">Size: {item.product.size} , Color: {item.product.color}</div>
                <div className="mt-3 flex items-baseline gap-3">
                  <span className="text-blue-600 font-semibold text-lg">৳ {item.product.price.toLocaleString()}</span>
                  <span className="text-gray-400 line-through text-sm">৳ {item.product.originalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
