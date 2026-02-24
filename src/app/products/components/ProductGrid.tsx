import React from 'react'
import { Product } from '../FilterContent'
import Link from 'next/link'

export default function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map(p => (
        <div key={p._id} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow group">
          
          {/* ইমেজ সেকশনে ক্লিক করলে স্লাগ দিয়ে লিঙ্কে যাবে */}
          <Link href={`/product/${p.slug}`} className="block relative h-48 w-full bg-gray-100 overflow-hidden">
            <img 
              src={p.thumbnailImage || '/img/placeholder.png'} 
              alt={p.productTitle} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
            />
            {p.discountPrice && p.discountPrice < p.productPrice && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                SALE
              </span>
            )}
          </Link>

          <div className="p-3">
            {p.brand && (
              <div className="text-[10px] text-gray-500 uppercase tracking-wide mb-1">
                {p.brand.name}
              </div>
            )}
            
            {/* টাইটেল লিঙ্কেও স্লাগ ব্যবহার করা হয়েছে */}
            <Link href={`/product/${p.slug}`} className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-blue-600 mb-2 min-h-[40px]">
              {p.productTitle}
            </Link>
            
            <div className="flex items-center gap-2 mt-1">
              <span className="text-blue-600 font-bold text-base">
                ৳{(p.discountPrice || p.productPrice).toLocaleString()}
              </span>
              
              {p.discountPrice && p.discountPrice < p.productPrice && (
                <span className="text-xs text-gray-400 line-through">
                  ৳{p.productPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}