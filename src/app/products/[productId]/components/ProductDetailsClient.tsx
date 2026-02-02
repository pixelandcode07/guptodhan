'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProductDetailsClientProps, Review } from './types';
import { containerVariants } from './constants';
import ProductBreadcrumb from './ProductBreadcrumb';
import ProductImageGallery from './ProductImageGallery';
// ✅ Import the new merged component
import ProductTabs from './ProductTabs';
import RelatedProducts from './RelatedProducts';
import ProductMainInfo from './ProductSidebar';

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
    if (!reviews || reviews.length === 0) return '0';
    const total = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
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

  const categoryName = product.category && typeof product.category === 'object' ? product.category.name : undefined;

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="min-h-screen font-sans text-gray-800 pb-12">
      <ProductBreadcrumb product={product} relatedData={productData.relatedData} />
      
      <div className="container mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left: Images */}
          <div className="lg:col-span-5"> {/* Image Gallery কে আলাদা কলামে রাখা হয়েছে */}
            <div className="sticky top-24">
              <ProductImageGallery 
                product={product}
                selectedColor={selectedColor}
                selectedSize={selectedSize}
                onColorChange={handleColorChange}
                onSizeChange={(size: string) => setSelectedSize(size)}
              />
            </div>
          </div>
          
          {/* Right: Merged Info & Sidebar */}
          <div className="lg:col-span-7">
            <ProductMainInfo 
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
      
      <ProductTabs product={product} reviews={reviews} onReviewsUpdate={setReviews} />
      
      {productData.relatedProducts && productData.relatedProducts.length > 0 && (
        <div className="container mx-auto px-3 sm:px-4 md:px-6 mt-4 sm:mt-6 md:mt-8">
          <RelatedProducts products={productData.relatedProducts} categoryName={categoryName} />
        </div>
      )}
    </motion.div>
  );
}