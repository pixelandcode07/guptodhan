'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProductDetailsClientProps, Review } from './types';
import { containerVariants } from './constants';
import ProductBreadcrumb from './ProductBreadcrumb';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ProductSidebar from './ProductSidebar';
import ProductTabs from './ProductTabs';
import RelatedProducts from './RelatedProducts';

export default function ProductDetailsClient({ productData }: ProductDetailsClientProps) {
  const { product } = productData;
  const [reviews, setReviews] = useState<Review[]>(product.reviews || []);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  useEffect(() => {
    if (product.productOptions && product.productOptions.length > 0) {
      const firstOption = product.productOptions[0];
      const firstColor = Array.isArray(firstOption.color) ? firstOption.color[0] : firstOption.color;
      const firstSize = Array.isArray(firstOption.size) ? firstOption.size[0] : firstOption.size;

      if (firstColor) setSelectedColor(firstColor);
      if (firstSize) setSelectedSize(firstSize);
    }
  }, [product.productOptions]);

  const averageRating = (() => {
    if (reviews.length === 0) return '0';
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  })();

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const variant = product.productOptions?.find((option) => {
      const optionColor = Array.isArray(option.color) ? option.color[0] : option.color;
      return optionColor === color;
    });
    
    if (variant && variant.size) {
      const newSize = Array.isArray(variant.size) ? variant.size[0] : variant.size;
      setSelectedSize(newSize || '');
    }
  };

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={containerVariants}
      className="min-h-screen bg-[#f2f4f8] font-sans text-gray-800 pb-12"
    >
      <ProductBreadcrumb product={product} relatedData={productData.relatedData} />
      <div className="container mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-9">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <ProductImageGallery 
                  product={product}
                  selectedColor={selectedColor}
                  selectedSize={selectedSize}
                  onColorChange={handleColorChange}
                  onSizeChange={(size: string) => setSelectedSize(size)}
                />
                <ProductInfo 
                  product={product} 
                  reviews={reviews} 
                  averageRating={averageRating}
                  relatedData={productData.relatedData}
                  onColorChange={handleColorChange}
                  onSizeChange={(size: string) => setSelectedSize(size)}
                  selectedColor={selectedColor}
                  selectedSize={selectedSize}
                />
              </div>
            </div>
          </div>
          <ProductSidebar product={product} />
        </div>
      </div>
      <ProductTabs product={product} reviews={reviews} onReviewsUpdate={setReviews} />
      {productData.relatedProducts && productData.relatedProducts.length > 0 && (
        <div className="container mx-auto px-3 sm:px-4 md:px-6 mt-4 sm:mt-6 md:mt-8">
          <RelatedProducts 
            products={productData.relatedProducts}
            categoryName={typeof product.category === 'object' ? product.category.name : undefined}
          />
        </div>
      )}
    </motion.div>
  );
}