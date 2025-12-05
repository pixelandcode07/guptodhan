'use client';

import Image from 'next/image';
import { Card, CardTitle } from '@/components/ui/card';
import { Store } from 'lucide-react';
import Link from 'next/link';
import { Product, StoreData } from './types';

interface StoreProductsProps {
  storeName: string;
  products: Product[];
}

export default function StoreProducts({ storeName, products }: StoreProductsProps) {
  const activeProducts = products.filter(p => p.status === 'active');

  return (
    <Card className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-100">
      <div className="p-3 sm:p-4 md:p-6 pb-1 sm:pb-2">
        <CardTitle className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
          <span className="block sm:inline">Products from {storeName}</span>
          {activeProducts.length > 0 && (
            <span className="block sm:inline text-xs sm:text-sm font-normal text-gray-500 sm:ml-2 mt-1 sm:mt-0">
              ({activeProducts.length} {activeProducts.length === 1 ? 'product' : 'products'})
            </span>
          )}
        </CardTitle>
      </div>
      <div className="px-3 sm:px-4 md:px-6 pb-3 sm:pb-4 md:pb-6">
        {activeProducts.length === 0 ? (
          <div className="text-center py-8 sm:py-12 text-gray-500">
            <Store className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
            <p className="text-base sm:text-lg font-medium">No products available from this store</p>
            <p className="text-xs sm:text-sm mt-2">Check back later for new products</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
            {activeProducts.map((product) => {
              const brandName = typeof product.brand === 'object' && product.brand !== null
                ? product.brand.name
                : 'No Brand';
              const finalPrice = product.discountPrice || product.productPrice;
              const originalPrice = product.discountPrice ? product.productPrice : null;
              const discountPercent = product.discountPrice && product.productPrice
                ? Math.round(((product.productPrice - product.discountPrice) / product.productPrice) * 100)
                : 0;

              return (
                <Link
                  key={product._id}
                  href={`/products/${product._id}`}
                  className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:border-[#0099cc]"
                >
                  <div className="relative aspect-square bg-gray-100">
                    <Image
                      src={product.thumbnailImage || '/placeholder-product.png'}
                      alt={product.productTitle}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                    />
                    {discountPercent > 0 && (
                      <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-red-500 text-white text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                        -{discountPercent}%
                      </div>
                    )}
                  </div>
                  <div className="p-2 sm:p-3">
                    <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 mb-1.5 sm:mb-2 group-hover:text-[#0099cc] transition-colors min-h-10 sm:min-h-12">
                      {product.productTitle}
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-1.5 sm:mb-2">
                      <span className="text-sm sm:text-base md:text-lg font-bold text-[#0099cc]">
                        ৳{finalPrice.toLocaleString()}
                      </span>
                      {originalPrice && (
                        <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                          ৳{originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500">
                      <span className="truncate flex-1 mr-1">{brandName}</span>
                      {product.stock !== undefined && (
                        <span className={`${product.stock > 0 ? 'text-green-600' : 'text-red-600'} shrink-0 text-[10px] sm:text-xs`}>
                          {product.stock > 0 ? 'In Stock' : 'Out'}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}

