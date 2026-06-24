'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ProductDetailsClientProps, Review } from './types';
import { containerVariants } from './constants';
import ProductBreadcrumb from './ProductBreadcrumb';
import ProductImageGallery from './ProductImageGallery';
import ProductTabs from './ProductTabs';
import RelatedProducts from './RelatedProducts';
import ProductMainInfo from './ProductSidebar';
import { processProduct } from './dataFormatHandler';

export default function ProductDetailsClient({ productData }: ProductDetailsClientProps) {
  // ✅ Process product data
  const processedProduct = useMemo(() => processProduct(productData.product), [productData.product]);
  
  const { product } = { ...productData, product: processedProduct };
  const [reviews, setReviews] = useState<Review[]>(product.reviews || []);
  
  // ✅ States for variants
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<string>(''); // ✅ NEW: Country State
  
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  // ✅ Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoadingReviews(true);
        const response = await fetch(`/api/v1/product-review/product-review-product/${product._id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setReviews(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setReviews(product.reviews || []);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    if (product._id) {
      fetchReviews();
    }
  }, [product._id]);

  // ✅ Set Initial Variants (Color, Size, Country)
  useEffect(() => {
    if (product.productOptions && product.productOptions.length > 0) {
      const firstOption = product.productOptions[0];
      const firstColor = Array.isArray(firstOption.color) ? firstOption.color[0] : firstOption.color;
      const firstSize = Array.isArray(firstOption.size) ? firstOption.size[0] : firstOption.size;
      const firstCountry = Array.isArray(firstOption.country) ? firstOption.country[0] : firstOption.country; // ✅ NEW

      if (firstColor) setSelectedColor(firstColor);
      if (firstSize) setSelectedSize(firstSize);
      if (firstCountry) setSelectedCountry(firstCountry); // ✅ NEW
    }
  }, [product.productOptions]);

  const averageRating = (() => {
    if (!reviews || reviews.length === 0) return '0';
    const total = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (total / reviews.length).toFixed(1);
  })();

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    const variant = product.productOptions?.find((option: any) => {
      const optionColor = Array.isArray(option.color) ? option.color[0] : option.color;
      return optionColor === color;
    });
    if (variant) {
      const newSize = Array.isArray(variant.size) ? variant.size[0] : variant.size;
      const newCountry = Array.isArray(variant.country) ? variant.country[0] : variant.country; // ✅ NEW
      
      setSelectedSize(newSize || '');
      setSelectedCountry(newCountry || ''); // ✅ NEW
    }
  };

  const categoryName = product.category && typeof product.category === 'object' ? product.category.name : undefined;

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants} className="min-h-screen font-sans text-gray-800 pb-12">
      <ProductBreadcrumb product={product} relatedData={productData.relatedData} />
      
      <div className="container mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-5">
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
          
          <div className="lg:col-span-7">
            <ProductMainInfo 
              product={product} 
              reviews={reviews} 
              averageRating={averageRating}
              relatedData={productData.relatedData}
              onColorChange={handleColorChange}
              onSizeChange={(size: string) => setSelectedSize(size)}
              onCountryChange={(country: string) => setSelectedCountry(country)} // ✅ NEW
              selectedColor={selectedColor}
              selectedSize={selectedSize}
              selectedCountry={selectedCountry} // ✅ NEW
            />
          </div>

        </div>
      </div>
      
      <ProductTabs 
        product={product} 
        reviews={reviews} 
        onReviewsUpdate={setReviews}
        isLoadingReviews={isLoadingReviews}
      />
      
      {productData.relatedProducts && productData.relatedProducts.length > 0 && (
        <div className="container mx-auto px-3 sm:px-4 md:px-6 mt-4 sm:mt-6 md:mt-8">
          <RelatedProducts products={productData.relatedProducts} categoryName={categoryName} />
        </div>
      )}
    </motion.div>
  );
}