'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Star, Heart, Share2, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product, Review, ProductData } from './types';
import { getBrandName, formatPrice, calculateDiscountPercent } from './utils';
import { Label } from '@/components/ui/label';

interface ProductInfoProps {
  product: Product;
  reviews: Review[];
  averageRating: string;
  relatedData?: ProductData['relatedData'];
}

export default function ProductInfo({ product, reviews, averageRating, relatedData }: ProductInfoProps) {
  const router = useRouter();
  const { addToCart, isLoading: cartLoading, isAddingToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [quantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  
  // Variant selection state
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Check if product has variants
  const hasVariants = product.productOptions && product.productOptions.length > 0;

  // Extract unique colors and sizes from variants
  const availableColors = useMemo(() => {
    if (!hasVariants || !relatedData?.variantOptions?.colors) return [];
    const colorIds = new Set<string>();
    product.productOptions?.forEach(option => {
      option.color?.forEach(id => colorIds.add(id));
    });
    return relatedData.variantOptions.colors.filter(c => colorIds.has(c._id));
  }, [hasVariants, product.productOptions, relatedData?.variantOptions?.colors]);

  const availableSizes = useMemo(() => {
    if (!hasVariants || !relatedData?.variantOptions?.sizes) return [];
    const sizeIds = new Set<string>();
    product.productOptions?.forEach(option => {
      option.size?.forEach(id => sizeIds.add(id));
    });
    return relatedData.variantOptions.sizes.filter(s => sizeIds.has(s._id));
  }, [hasVariants, product.productOptions, relatedData?.variantOptions?.sizes]);

  // Find selected variant based on color and size
  const selectedVariant = useMemo(() => {
    if (!hasVariants) return null;
    
    // If both color and size are selected, find exact match
    if (selectedColor && selectedSize) {
      return product.productOptions?.find(option => 
        option.color?.includes(selectedColor) && option.size?.includes(selectedSize)
      ) || null;
    }
    
    // If only color is selected, find first variant with that color
    if (selectedColor) {
      return product.productOptions?.find(option => 
        option.color?.includes(selectedColor)
      ) || null;
    }
    
    // If only size is selected, find first variant with that size
    if (selectedSize) {
      return product.productOptions?.find(option => 
        option.size?.includes(selectedSize)
      ) || null;
    }
    
    // If nothing selected, return first variant
    return product.productOptions?.[0] || null;
  }, [hasVariants, product.productOptions, selectedColor, selectedSize]);

  // Calculate price and stock based on selected variant
  const displayPrice = useMemo(() => {
    if (selectedVariant) {
      return selectedVariant.discountPrice || selectedVariant.price || 0;
    }
    return product.discountPrice || product.productPrice || 0;
  }, [selectedVariant, product]);

  const displayOriginalPrice = useMemo(() => {
    if (selectedVariant && selectedVariant.discountPrice && selectedVariant.price) {
      return selectedVariant.price;
    }
    return product.discountPrice ? product.productPrice : null;
  }, [selectedVariant, product]);

  const displayStock = useMemo(() => {
    if (selectedVariant && selectedVariant.stock !== undefined) {
      return selectedVariant.stock;
    }
    return product.stock || 0;
  }, [selectedVariant, product]);

  const discountPercent = displayOriginalPrice && displayPrice
    ? calculateDiscountPercent(displayOriginalPrice, displayPrice)
    : (product.discountPrice && product.productPrice 
      ? calculateDiscountPercent(product.productPrice, product.discountPrice)
      : 0);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.productTitle,
          text: product.shortDescription,
          url: window.location.href,
        });
      } catch (error) { 
        console.log(error); 
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied!');
    }
  };

  const handleBuyNow = async () => {
    setIsBuyingNow(true);
    try {
      // Store product ID in sessionStorage for "Buy Now" mode
      sessionStorage.setItem('buyNowProductId', product._id);
      await addToCart(product._id, quantity, { skipModal: true, silent: true });
      router.push('/home/product/shoppinginfo?buyNow=true');
    } catch { 
      toast.error('Failed to proceed'); 
      sessionStorage.removeItem('buyNowProductId');
    } finally { 
      setIsBuyingNow(false); 
    }
  };

  const handleAddToCart = async () => {
    // TODO: Pass variant info (color, size) to addToCart when cart API supports it
    await addToCart(product._id, quantity);
  };

  // Get color name by ID
  const getColorName = (colorId: string): string => {
    const color = relatedData?.variantOptions?.colors?.find(c => c._id === colorId);
    return color?.colorName || color?.name || colorId;
  };

  // Get size name by ID
  const getSizeName = (sizeId: string): string => {
    const size = relatedData?.variantOptions?.sizes?.find(s => s._id === sizeId);
    return size?.name || size?.sizeName || sizeId;
  };

  return (
    <div className="p-4 sm:p-5 md:p-6">
      <h1 className="text-xl sm:text-2xl font-medium text-gray-800 mb-2 leading-snug">{product.productTitle}</h1>
      
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm mb-3 sm:mb-4 text-gray-500">
        <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
          <div className="flex text-orange-400">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={10} className="sm:w-3 sm:h-3" fill={s <= Math.round(Number(averageRating)) ? "currentColor" : "none"} />
            ))}
          </div>
          <span className="text-[10px] sm:text-xs font-bold text-gray-700 pt-0.5">{reviews.length} Ratings</span>
        </div>
        <span className="text-gray-300 hidden sm:inline">|</span>
        <span className="hover:text-[#0099cc] cursor-pointer transition-colors text-xs sm:text-sm">{product.qna?.length || 0} Q&A</span>
        <span className="text-gray-300 hidden sm:inline">|</span>
        <span className={`text-[10px] sm:text-xs flex items-center gap-1 ${displayStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
          <BadgeCheck size={12} className="sm:w-3.5 sm:h-3.5" /> 
          <span className="hidden sm:inline">{displayStock > 0 ? 'In Stock' : 'Out of Stock'}</span> ({displayStock})
        </span>
      </div>

      <div className="text-sm text-gray-500 mb-4">
        Brand: <span className="text-[#0099cc] font-medium cursor-pointer">{getBrandName(product, relatedData?.brands)}</span>
      </div>

      {/* Variant Selection */}
      {hasVariants && (
        <div className="mb-4 sm:mb-6 space-y-3">
          {availableColors.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Color: {selectedColor ? getColorName(selectedColor) : 'Select Color'}
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => {
                  const isSelected = selectedColor === color._id;
                  return (
                    <button
                      key={color._id}
                      onClick={() => setSelectedColor(color._id)}
                      className={`px-3 py-1.5 text-xs sm:text-sm rounded-md border-2 transition-all ${
                        isSelected
                          ? 'border-[#0099cc] bg-[#0099cc] text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-[#0099cc]'
                      }`}
                    >
                      {color.colorName || color.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {availableSizes.length > 0 && (
            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2 block">
                Size: {selectedSize ? getSizeName(selectedSize) : 'Select Size'}
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((size) => {
                  const isSelected = selectedSize === size._id;
                  return (
                    <button
                      key={size._id}
                      onClick={() => setSelectedSize(size._id)}
                      className={`px-3 py-1.5 text-xs sm:text-sm rounded-md border-2 transition-all ${
                        isSelected
                          ? 'border-[#0099cc] bg-[#0099cc] text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-[#0099cc]'
                      }`}
                    >
                      {size.name || size.sizeName}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
        <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0099cc]">
            {displayPrice > 0 ? formatPrice(displayPrice) : 'Price not available'}
          </span>
          {displayOriginalPrice && displayOriginalPrice > 0 && (
            <>
              <span className="text-sm sm:text-base md:text-lg text-gray-400 line-through decoration-gray-400">
                {formatPrice(displayOriginalPrice)}
              </span>
              {discountPercent > 0 && (
                <span className="bg-red-100 text-red-600 text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                  -{discountPercent}% OFF
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6 sm:mt-8">
        <motion.div className="flex-1 w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            onClick={handleBuyNow} 
            disabled={isBuyingNow || displayStock <= 0} 
            className="w-full h-10 sm:h-12 bg-[#0099cc] hover:bg-[#0088bb] text-white text-sm sm:text-base md:text-lg shadow-md hover:shadow-lg transition-all"
          >
            {isBuyingNow ? 'Processing...' : 'Buy Now'}
          </Button>
        </motion.div>
        <motion.div className="flex-1 w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            onClick={handleAddToCart} 
            disabled={cartLoading || isAddingToCart || displayStock <= 0} 
            className="w-full h-10 sm:h-12 bg-[#0e1133] hover:bg-[#1a1e4d] text-white text-sm sm:text-base md:text-lg shadow-md hover:shadow-lg transition-all"
          >
            {cartLoading || isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </Button>
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mt-4 sm:mt-6 pt-4 border-t border-gray-100">
        <button 
          onClick={() => addToWishlist(product._id)} 
          className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-xs sm:text-sm group w-full sm:w-auto justify-center sm:justify-start"
        >
          <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full group-hover:bg-red-50 transition-colors">
            <Heart size={16} className="sm:w-[18px] sm:h-[18px] group-hover:fill-red-500" />
          </div>
          <span className="hidden sm:inline">Add to Wishlist</span>
          <span className="sm:hidden">Wishlist</span>
        </button>
        <button 
          onClick={handleShare} 
          className="flex items-center gap-2 text-gray-500 hover:text-[#0099cc] transition-colors text-xs sm:text-sm group w-full sm:w-auto justify-center sm:justify-start"
        >
          <div className="p-1.5 sm:p-2 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors">
            <Share2 size={16} className="sm:w-[18px] sm:h-[18px]" />
          </div>
          <span className="hidden sm:inline">Share Product</span>
          <span className="sm:hidden">Share</span>
        </button>
      </div>
    </div>
  );
}

