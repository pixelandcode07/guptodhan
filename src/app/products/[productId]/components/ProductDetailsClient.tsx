'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { containerVariants } from './constants';
import { ProductDetailsClientProps, Review } from './types';
import ProductBreadcrumb from './ProductBreadcrumb';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductSidebar from './ProductSidebar';
import ProductTabs from './ProductTabs';
import RelatedProducts from './RelatedProducts';

export default function ProductDetailsClient({ productData }: ProductDetailsClientProps) {
  const { product } = productData;
  const [reviews, setReviews] = useState<Review[]>(product.reviews || []);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return '0';
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const handleReviewsUpdate = (updatedReviews: Review[]) => {
    setReviews(updatedReviews);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#f2f4f8] font-sans text-gray-800 pb-12"
    >
      <ProductBreadcrumb product={product} />

      <div className="container mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* === LEFT: Product Main (9 Cols) === */}
          <div className="lg:col-span-9 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <ProductImageGallery product={product} />
              <ProductInfo 
                product={product} 
                reviews={reviews} 
                averageRating={averageRating}
                relatedData={productData.relatedData}
              />
            </div>
          </div>

          {/* === RIGHT: Sidebar (3 Cols) === */}
          <ProductSidebar product={product} />
        </div>
      </div>

      {/* ================= TABS SECTION ================= */}
      <ProductTabs 
        product={product} 
        reviews={reviews} 
        onReviewsUpdate={handleReviewsUpdate}
      />

      {/* ================= RELATED PRODUCTS SECTION ================= */}
      {productData.relatedProducts && productData.relatedProducts.length > 0 && (
        <div className="container mx-auto px-3 sm:px-4 md:px-6 mt-4 sm:mt-6 md:mt-8">
          <RelatedProducts 
            products={productData.relatedProducts}
            categoryName={
              typeof product.category === 'object' && product.category !== null
                ? product.category.name
                : undefined
            }
          />
        </div>
      )}
    </motion.div>
  );
}
