'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Star, Heart, BadgeCheck, Minus, Plus, ShoppingCart, Zap, Store } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/contexts/WishlistContext';
import { getBrandName, formatPrice, calculateDiscountPercent } from './utils';
import { fadeInUp } from './constants';

export default function ProductInfo({
  product,
  reviews,
  averageRating,
  relatedData,
  onColorChange,
  onSizeChange,
  selectedColor = '',
  selectedSize = '',
}: any) {
  const router = useRouter();
  const { addToCart, isLoading: cartLoading, isAddingToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist, getWishlistItemId, isLoading: wishlistLoading } = useWishlist();
  const [quantity, setQuantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isProductInWishlist, setIsProductInWishlist] = useState(false);
  const [isWishlistToggling, setIsWishlistToggling] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (product?._id) {
        const inWishlist = await isInWishlist(product._id);
        setIsProductInWishlist(inWishlist);
      }
    };
    checkWishlistStatus();
  }, [product?._id, isInWishlist]);

  const handleWishlist = async () => {
    if (!product?._id) return;
    
    setIsWishlistToggling(true);
    try {
      if (isProductInWishlist) {
        const wishlistItemId = await getWishlistItemId(product._id);
        if (wishlistItemId) {
          await removeFromWishlist(wishlistItemId);
          setIsProductInWishlist(false);
        }
      } else {
        const success = await addToWishlist(product._id);
        if (success) {
          setIsProductInWishlist(true);
        }
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
    } finally {
      setIsWishlistToggling(false);
    }
  };

  // কালার এবং সাইজ লিস্ট ফিল্টারিং
  const availableColors = useMemo(() => {
    if (!product.productOptions) return [];
    const colors = product.productOptions.map((opt: any) => Array.isArray(opt.color) ? opt.color[0] : opt.color);
    return Array.from(new Set(colors)).filter(Boolean) as string[];
  }, [product.productOptions]);

  const availableSizes = useMemo(() => {
    if (!selectedColor || !product.productOptions) return [];
    const matchingOptions = product.productOptions.filter((opt: any) => {
      const optColor = Array.isArray(opt.color) ? opt.color[0] : opt.color;
      return optColor === selectedColor;
    });
    const sizes = matchingOptions.flatMap((opt: any) => Array.isArray(opt.size) ? opt.size : [opt.size]);
    return Array.from(new Set(sizes)).filter(Boolean) as string[];
  }, [selectedColor, product.productOptions]);

  const selectedVariant = useMemo(() => {
    if (!selectedColor || !product.productOptions) return null;
    return product.productOptions.find((opt: any) => {
      const optColor = Array.isArray(opt.color) ? opt.color[0] : opt.color;
      const optSize = Array.isArray(opt.size) ? opt.size[0] : opt.size;
      return optColor === selectedColor && (selectedSize ? optSize === selectedSize : true);
    });
  }, [selectedColor, selectedSize, product.productOptions]);

  // প্রাইস এবং স্টক লজিক (ভ্যারিয়েন্ট না থাকলে মেইন প্রোডাক্ট থেকে নিবে)
  const variantStock = selectedVariant?.stock ?? product.stock ?? 0;
  const variantPrice = selectedVariant?.price ?? product.productPrice ?? 0;
  const variantDiscountPrice = selectedVariant?.discountPrice ?? product.discountPrice;
  const finalPrice = variantDiscountPrice || variantPrice || 0;
  const discountPercent = calculateDiscountPercent(variantPrice, variantDiscountPrice);

  const handleBuyNow = async () => {
    // কালার বা সাইজ কেবল তখনই চাবে যদি সেগুলো প্রোডাক্টে ডিফাইন করা থাকে
    if (availableColors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    setIsBuyingNow(true);
    try {
      sessionStorage.setItem('buyNowProductId', product._id);
      await addToCart(product._id, quantity, { skipModal: true, silent: true });
      router.push('/home/product/shoppinginfo?buyNow=true');
    } catch {
      toast.error('Failed to proceed');
    } finally {
      setIsBuyingNow(false);
    }
  };

  const handleAddToCart = async () => {
    if (availableColors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    await addToCart(product._id, quantity);
  };

  return (
    <motion.div className="p-5 md:p-8 space-y-7 bg-white" variants={fadeInUp} initial="hidden" animate="visible">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 px-2 py-1 bg-blue-50 rounded">
            {getBrandName(product, relatedData?.brands)}
          </span>
          <button 
            onClick={handleWishlist}
            disabled={isWishlistToggling || wishlistLoading}
            className={`p-2 rounded-full border border-gray-100 transition-colors ${
              isProductInWishlist 
                ? 'bg-red-50 text-red-500 hover:bg-red-100' 
                : 'hover:bg-red-50 hover:text-red-500'
            }`}
            title={isProductInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart size={18} fill={isProductInWishlist ? 'currentColor' : 'none'} />
          </button>
        </div>
        <h1 className="text-xl md:text-2xl font-semibold text-slate-900 leading-tight">{product.productTitle}</h1>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1 text-amber-500">
            <Star size={16} className="fill-current" />
            <span className="font-semibold text-slate-700">{averageRating || '0'}</span>
            <span className="text-slate-400">({reviews.length} Reviews)</span>
          </div>
          <span className="h-4 w-[1px] bg-slate-200"></span>
          <div className="flex items-center gap-1.5 text-emerald-600 font-medium italic">
            <BadgeCheck size={16} />
            {variantStock > 0 ? `${variantStock} Items Available` : 'Out of Stock'}
          </div>
        </div>
      </div>

      <div className="py-5 border-y border-slate-50 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-slate-900">{formatPrice(finalPrice)}</span>
            {discountPercent > 0 && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">-{discountPercent}%</span>}
          </div>
          {variantDiscountPrice && <span className="text-sm text-slate-400 line-through">{formatPrice(variantPrice)}</span>}
        </div>
        <div className="text-right">
          <p className="text-[11px] text-slate-400 uppercase tracking-tighter">Sold by</p>
          <div className="flex items-center gap-1 justify-end text-slate-700 font-semibold hover:text-blue-600 cursor-pointer transition-colors">
            <Store size={14} />
            <span className="text-sm">Guptodhan Store</span>
          </div>
        </div>
      </div>

      {/* Color UI (Only shows if colors exist) */}
      {availableColors.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-900">Color: <span className="font-normal text-slate-500">{selectedColor}</span></label>
          <div className="flex gap-3 flex-wrap">
            {availableColors.map((color) => (
              <button
                key={color} onClick={() => onColorChange?.(color)}
                className={`px-4 py-2 rounded-md text-xs font-medium border-2 transition-all ${selectedColor === color ? 'border-slate-900 bg-slate-900 text-white shadow-lg' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300'}`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Size UI (Only shows if sizes exist) */}
      {availableSizes.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-semibold text-slate-900">Size: <span className="font-normal text-slate-500">{selectedSize}</span></label>
          <div className="flex gap-2 flex-wrap">
            {availableSizes.map((size) => (
              <button
                key={size} onClick={() => onSizeChange?.(size)}
                className={`min-w-[48px] h-10 flex items-center justify-center rounded-md border-2 text-xs font-bold transition-all ${selectedSize === size ? 'border-slate-900 bg-white text-slate-900 ring-1 ring-slate-900' : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'}`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-5 pt-2">
        <div className="flex items-center gap-6">
          <label className="text-sm font-semibold text-slate-900">Quantity</label>
          <div className="flex items-center bg-slate-100 rounded-lg p-1">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-all"><Minus size={16}/></button>
            <span className="w-10 text-center text-sm font-bold">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} disabled={quantity >= variantStock} className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-md transition-all"><Plus size={16}/></button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={handleBuyNow} disabled={isBuyingNow || variantStock === 0} className="flex-[1.5] h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xl active:scale-95 transition-all">
            <Zap size={18} className="mr-2 fill-current text-amber-400" /> <span className="uppercase tracking-wider font-bold">Buy Now</span>
          </Button>
          <Button onClick={handleAddToCart} disabled={cartLoading || variantStock === 0} variant="outline" className="flex-1 h-14 border-2 border-slate-900 text-slate-900 rounded-xl font-bold uppercase active:scale-95 transition-all">
            <ShoppingCart size={18} className="mr-2" /> Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}