'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Star, Heart, Share2, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { Product, Review } from './types';
import { getBrandName, formatPrice, calculateDiscountPercent } from './utils';

interface ProductInfoProps {
  product: Product;
  reviews: Review[];
  averageRating: string;
}

export default function ProductInfo({ product, reviews, averageRating }: ProductInfoProps) {
  const router = useRouter();
  const { addToCart, isLoading: cartLoading, isAddingToCart } = useCart();
  const { addToWishlist } = useWishlist();
  const [quantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const discountPercent = calculateDiscountPercent(product.productPrice, product.discountPrice);

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
    <div className="p-6">
      <h1 className="text-2xl font-medium text-gray-800 mb-2 leading-snug">{product.productTitle}</h1>
      
      <div className="flex items-center gap-3 text-sm mb-4 text-gray-500">
        <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
          <div className="flex text-orange-400">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={12} fill={s <= Math.round(Number(averageRating)) ? "currentColor" : "none"} />
            ))}
          </div>
          <span className="text-xs font-bold text-gray-700 pt-0.5">{reviews.length} Ratings</span>
        </div>
        <span className="text-gray-300">|</span>
        <span className="hover:text-[#0099cc] cursor-pointer transition-colors">{product.qna?.length || 0} Q&A</span>
        <span className="text-gray-300">|</span>
        <span className="text-green-600 text-xs flex items-center gap-1">
          <BadgeCheck size={14} /> In Stock ({product.stock})
        </span>
      </div>

      <div className="text-sm text-gray-500 mb-4">
        Brand: <span className="text-[#0099cc] font-medium cursor-pointer">{getBrandName(product)}</span>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-[#0099cc]">
            {formatPrice(product.discountPrice || product.productPrice)}
          </span>
          {product.discountPrice && (
            <>
              <span className="text-lg text-gray-400 line-through decoration-gray-400">
                {formatPrice(product.productPrice)}
              </span>
              <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded">
                -{discountPercent}% OFF
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            onClick={handleBuyNow} 
            disabled={isBuyingNow || !product.stock} 
            className="w-full h-12 bg-[#0099cc] hover:bg-[#0088bb] text-white text-lg shadow-md hover:shadow-lg transition-all"
          >
            {isBuyingNow ? 'Processing...' : 'Buy Now'}
          </Button>
        </motion.div>
        <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            onClick={handleAddToCart} 
            disabled={cartLoading || isAddingToCart || !product.stock} 
            className="w-full h-12 bg-[#0e1133] hover:bg-[#1a1e4d] text-white text-lg shadow-md hover:shadow-lg transition-all"
          >
            {cartLoading || isAddingToCart ? 'Adding...' : 'Add to Cart'}
          </Button>
        </motion.div>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
        <button 
          onClick={() => addToWishlist(product._id)} 
          className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-sm group"
        >
          <div className="p-2 bg-gray-100 rounded-full group-hover:bg-red-50 transition-colors">
            <Heart size={18} className="group-hover:fill-red-500" />
          </div>
          Add to Wishlist
        </button>
        <button 
          onClick={handleShare} 
          className="flex items-center gap-2 text-gray-500 hover:text-[#0099cc] transition-colors text-sm group"
        >
          <div className="p-2 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors">
            <Share2 size={18} />
          </div>
          Share Product
        </button>
      </div>
    </div>
  );
}

