'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Star, Heart, Share2, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product, Review, ProductData } from './types';
import { Product, Review, ProductData } from './types';
import { getBrandName, formatPrice, calculateDiscountPercent } from './utils';

interface ProductInfoProps {
  product: Product;
  reviews: Review[];
  averageRating: string;
  relatedData?: ProductData['relatedData'];
  relatedData?: ProductData['relatedData'];
}

export default function ProductInfo({ product, reviews, averageRating, relatedData }: ProductInfoProps) {
export default function ProductInfo({ product, reviews, averageRating, relatedData }: ProductInfoProps) {
  const router = useRouter();
  const { addToCart, isLoading: cartLoading, isAddingToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [quantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const discountPercent = product.discountPrice && product.productPrice 
    ? calculateDiscountPercent(product.productPrice, product.discountPrice)
    : 0;
  
  const finalPrice = product.discountPrice || product.productPrice || 0;
  const originalPrice = product.discountPrice ? product.productPrice : null;

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
    await addToCart(product._id, quantity);
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
        <span className="text-green-600 text-[10px] sm:text-xs flex items-center gap-1">
          <BadgeCheck size={12} className="sm:w-3.5 sm:h-3.5" /> <span className="hidden sm:inline">In Stock</span> ({product.stock})
        </span>
      </div>

      <div className="text-sm text-gray-500 mb-4">
        Brand: <span className="text-[#0099cc] font-medium cursor-pointer">{getBrandName(product, relatedData?.brands)}</span>
      </div>

      <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
        <div className="flex flex-wrap items-baseline gap-2 sm:gap-3">
          <span className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0099cc]">
            {finalPrice > 0 ? formatPrice(finalPrice) : 'Price not available'}
          </span>
          {product.discountPrice && originalPrice && originalPrice > 0 && (
            <>
              <span className="text-sm sm:text-base md:text-lg text-gray-400 line-through decoration-gray-400">
                {formatPrice(originalPrice)}
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
            disabled={isBuyingNow || !product.stock} 
            className="w-full h-10 sm:h-12 bg-[#0099cc] hover:bg-[#0088bb] text-white text-sm sm:text-base md:text-lg shadow-md hover:shadow-lg transition-all"
          >
            {isBuyingNow ? 'Processing...' : 'Buy Now'}
          </Button>
        </motion.div>
        <motion.div className="flex-1 w-full" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            onClick={handleAddToCart} 
            disabled={cartLoading || isAddingToCart || !product.stock} 
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

