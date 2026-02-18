'use client';

import Image from 'next/image';
import Link from 'next/link';

interface RelatedProductsProps {
  products: any[];
  categoryName?: string;
  categorySlug?: string;
}

export default function RelatedProducts({ products, categoryName, categorySlug }: RelatedProductsProps) {
  if (!products?.length) {
    console.log('❌ No related products to display');
    return null;
  }

  console.log('✅ Related Products:', products.length);
  console.log('📦 Category:', categoryName, '| Slug:', categorySlug);

  // ✅ Ensure slug is properly formatted (no spaces)
  const formattedSlug = categorySlug?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="mt-12 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 px-1">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">You Might Also Like</h2>
          <p className="text-slate-500 text-sm">More picks from {categoryName || 'this category'}</p>
        </div>
        {formattedSlug && (
          <Link 
            href={`/category/${formattedSlug}`}
            className="text-sm font-bold text-blue-600 hover:underline"
          >
            View All Products
          </Link>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {products.map((product: any) => {
          const finalPrice = product.discountPrice || product.productPrice;
          const discountPercent = product.discountPrice 
            ? Math.round(((product.productPrice - product.discountPrice) / product.productPrice) * 100) 
            : 0;

          return (
            <Link
              key={product._id}
              href={`/products/${product.slug}`}
              className="group bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full"
            >
              <div className="relative aspect-[4/5] bg-slate-50 p-2 overflow-hidden">
                <Image
                  src={product.thumbnailImage || '/placeholder.png'}
                  alt={product.productTitle}
                  fill
                  className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                />
                {discountPercent > 0 && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-sm">
                    {discountPercent}% OFF
                  </div>
                )}
              </div>

              <div className="p-4 flex flex-col flex-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 truncate">
                  {typeof product.brand === 'object' ? product.brand.name : 'Generic'}
                </p>
                <h3 className="text-[13px] font-medium text-slate-700 line-clamp-2 mb-3 leading-snug group-hover:text-blue-600 transition-colors">
                  {product.productTitle}
                </h3>
                
                <div className="mt-auto pt-2 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900">৳{finalPrice.toLocaleString()}</span>
                  </div>
                  {product.discountPrice && (
                    <span className="text-[11px] text-slate-400 line-through">৳{product.productPrice.toLocaleString()}</span>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}