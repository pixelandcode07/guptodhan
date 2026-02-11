'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // ✅ Session Import
import { Button } from '@/components/ui/button';
import { Star, Heart, BadgeCheck, Minus, Plus, ShoppingCart, Zap, Store, MapPin, Truck, Banknote, RotateCcw, ShieldCheck } from 'lucide-react';
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
  const { data: session } = useSession(); // ✅ User Session Check
  const { addToCart, isLoading: cartLoading } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist, getWishlistItemId, isLoading: wishlistLoading } = useWishlist();
  
  const [quantity, setQuantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isProductInWishlist, setIsProductInWishlist] = useState(false);
  const [isWishlistToggling, setIsWishlistToggling] = useState(false);
  const [locationType, setLocationType] = useState<'dhaka' | 'outside'>('dhaka');

  // ✅ Store Logic: Store খুঁজে বের করার উন্নত পদ্ধতি (Fix Store Unavailable)
  const storeInfo = useMemo(() => {
    // ১. যদি প্রোডাক্টের ভেতরেই স্টোর অবজেক্ট থাকে (Populated)
    if (product.vendorStoreId && typeof product.vendorStoreId === 'object') {
      return {
        id: product.vendorStoreId._id || product.vendorStoreId.id,
        name: product.vendorStoreId.storeName,
        logo: product.vendorStoreId.storeLogo
      };
    }
    // ২. যদি প্রোডাক্টে শুধু ID থাকে, তাহলে relatedData.stores থেকে খুঁজবে
    if (product.vendorStoreId && typeof product.vendorStoreId === 'string' && relatedData?.stores) {
      const foundStore = relatedData.stores.find((s: any) => s._id === product.vendorStoreId || s.id === product.vendorStoreId);
      if (foundStore) {
        return {
          id: foundStore._id || foundStore.id,
          name: foundStore.storeName,
          logo: foundStore.storeLogo
        };
      }
    }
    return null;
  }, [product.vendorStoreId, relatedData?.stores]);

  // ✅ Wishlist Status Check
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (product?._id && session?.user) {
        const inWishlist = await isInWishlist(product._id);
        setIsProductInWishlist(inWishlist);
      }
    };
    checkWishlistStatus();
  }, [product?._id, isInWishlist, session?.user]);

  // ✅ Wishlist Toggle Handler
  const handleWishlist = async () => {
    if (!session?.user) {
      toast.error('Please login to add to wishlist');
      router.push('/auth/login'); 
      return;
    }

    if (!product?._id) return;
    
    setIsWishlistToggling(true);
    try {
      if (isProductInWishlist) {
        const wishlistItemId = await getWishlistItemId(product._id);
        if (wishlistItemId) {
          await removeFromWishlist(wishlistItemId);
          setIsProductInWishlist(false);
          toast.success('Removed from wishlist');
        }
      } else {
        const success = await addToWishlist(product._id, selectedColor || undefined, selectedSize || undefined);
        if (success) {
          setIsProductInWishlist(true);
          toast.success('Added to wishlist');
        }
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsWishlistToggling(false);
    }
  };

  // Variants & Pricing Logic
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

  const variantStock = selectedVariant?.stock ?? product.stock ?? 0;
  const variantPrice = selectedVariant?.price ?? product.productPrice ?? 0;
  const variantDiscountPrice = selectedVariant?.discountPrice ?? product.discountPrice;
  const finalPrice = variantDiscountPrice || variantPrice || 0;
  const discountPercent = calculateDiscountPercent(variantPrice, variantDiscountPrice);

  // Delivery Info Logic
  const deliveryCharge = locationType === 'dhaka' ? 70 : 130;
  const deliveryTime = locationType === 'dhaka' ? '1 - 4 day(s)' : '4 - 7 day(s)';
  const locationText = locationType === 'dhaka' ? 'Dhaka, Dhaka North, Banani Road No. 12 - 19' : 'Outside Dhaka, Sadar, Chattogram';

  const toggleLocation = () => {
    setLocationType(prev => prev === 'dhaka' ? 'outside' : 'dhaka');
    toast.success(`Location changed to ${locationType === 'dhaka' ? 'Outside Dhaka' : 'Inside Dhaka'}`);
  };

  // Cart Handlers
  const handleBuyNow = async () => {
    if (availableColors.length > 0 && !selectedColor) return toast.error('Please select a color');
    if (availableSizes.length > 0 && !selectedSize) return toast.error('Please select a size');
    
    setIsBuyingNow(true);
    try {
      await addToCart(product._id, quantity, { 
        skipModal: true, silent: true, 
        color: selectedColor || undefined, size: selectedSize || undefined 
      });
      router.push('/home/product/shoppinginfo?buyNow=true');
    } catch { toast.error('Failed to proceed'); } 
    finally { setIsBuyingNow(false); }
  };

  const handleAddToCart = async () => {
    if (availableColors.length > 0 && !selectedColor) return toast.error('Please select a color');
    if (availableSizes.length > 0 && !selectedSize) return toast.error('Please select a size');
    
    await addToCart(product._id, quantity, {
      color: selectedColor || undefined,
      size: selectedSize || undefined
    });
  };

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="bg-white rounded-lg border border-gray-100 p-5 md:p-6">
      {/* ✅ Flex Layout for Perfect Alignment */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* ================= LEFT SIDE: Product Info ================= */}
        <div className="flex-1 space-y-6">
          
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600 px-2 py-1 bg-blue-50 rounded">
                {getBrandName(product, relatedData?.brands)}
              </span>
              <button 
                onClick={handleWishlist} 
                disabled={isWishlistToggling || wishlistLoading} 
                className={`p-2 rounded-full border transition-all duration-200 ${
                  isProductInWishlist 
                    ? 'bg-red-50 text-red-500 border-red-100 scale-110' 
                    : 'border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-red-500'
                }`}
                title={isProductInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart size={20} fill={isProductInWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>
            
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">{product.productTitle}</h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full">
                <Star size={14} className="fill-current" />
                <span className="font-bold text-slate-700">{averageRating || '0'}</span>
                <span className="text-slate-500">({reviews.length} Reviews)</span>
              </div>
              <div className={`flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-full ${variantStock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                <BadgeCheck size={14} />
                {variantStock > 0 ? `${variantStock} In Stock` : 'Out of Stock'}
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Pricing */}
          <div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#EF4A23]">{formatPrice(finalPrice)}</span>
              {variantDiscountPrice && (
                <>
                  <span className="text-lg text-gray-400 line-through font-medium">{formatPrice(variantPrice)}</span>
                  <span className="bg-[#EF4A23]/10 text-[#EF4A23] text-xs font-bold px-2 py-1 rounded-md">-{discountPercent}% OFF</span>
                </>
              )}
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            {availableColors.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-2 block">Color: <span className="font-normal text-slate-500">{selectedColor}</span></label>
                <div className="flex gap-2 flex-wrap">
                  {availableColors.map((color) => (
                    <button key={color} onClick={() => onColorChange?.(color)} className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all ${selectedColor === color ? 'border-slate-900 bg-slate-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {availableSizes.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-2 block">Size: <span className="font-normal text-slate-500">{selectedSize}</span></label>
                <div className="flex gap-2 flex-wrap">
                  {availableSizes.map((size) => (
                    <button key={size} onClick={() => onSizeChange?.(size)} className={`min-w-[40px] h-9 flex items-center justify-center rounded border text-xs font-bold transition-all ${selectedSize === size ? 'border-slate-900 bg-slate-900 text-white' : 'border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-md">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-600"><Minus size={16}/></button>
                <span className="w-10 text-center text-sm font-bold border-x border-gray-100 py-1.5">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} disabled={quantity >= variantStock} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-600 disabled:opacity-50"><Plus size={16}/></button>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <Button onClick={handleBuyNow} disabled={isBuyingNow || variantStock === 0} className="flex-1 h-12 bg-[#00005E] hover:bg-[#000040] text-white font-bold rounded-md shadow-lg shadow-blue-900/10">
                <Zap size={18} className="mr-2" /> BUY NOW
              </Button>
              <Button onClick={handleAddToCart} disabled={cartLoading || variantStock === 0} variant="outline" className="flex-1 h-12 border-2 border-gray-200 text-gray-800 font-bold rounded-md hover:border-gray-800 hover:bg-transparent">
                <ShoppingCart size={18} className="mr-2" /> ADD TO CART
              </Button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: Sidebar (Delivery & Store) ================= */}
        {/* ✅ Merged here for perfect alignment */}
        <div className="w-full lg:w-[320px] shrink-0 space-y-5 border-t lg:border-t-0 lg:border-l lg:pl-8 border-gray-100 pt-6 lg:pt-0">
          
          {/* Delivery */}
          <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Delivery</h3>
              <button onClick={toggleLocation} className="text-[#0099cc] text-xs font-bold hover:underline">CHANGE</button>
            </div>
            
            <div className="flex gap-3 mb-3">
              <MapPin className="text-gray-400 shrink-0 mt-0.5" size={18} />
              <span className="text-sm text-gray-700 leading-snug">{locationText}</span>
            </div>

            <div className="space-y-2 pt-3 border-t border-gray-200/60">
              <div className="flex justify-between text-sm">
                <div className="flex gap-2 text-gray-600"><Truck size={16} /> <span>Standard Delivery</span></div>
                <span className="font-bold text-gray-900">৳{deliveryCharge}</span>
              </div>
              <p className="text-xs text-gray-400 pl-6">{deliveryTime}</p>
              <div className="flex gap-2 text-sm text-gray-600 pt-1"><Banknote size={16} /> <span>Cash on Delivery Available</span></div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-3 px-1">
            <div className="flex gap-3">
              <RotateCcw className="text-[#0099cc] shrink-0" size={20} />
              <div>
                <p className="text-sm font-semibold text-gray-800">7 Days Returns</p>
                <p className="text-xs text-gray-500">Change of mind not applicable</p>
              </div>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="text-[#0099cc] shrink-0" size={20} />
              <div>
                <p className="text-sm font-semibold text-gray-800">Warranty</p>
                <p className="text-xs text-gray-500">{product.warrantyPolicy ? 'Manufacturer Warranty' : 'Not Available'}</p>
              </div>
            </div>
          </div>

          {/* Sold By */}
          <div className="bg-gray-50/50 rounded-lg p-4 border border-gray-100">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sold By</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative">
                {storeInfo?.logo ? (
                  <Image src={storeInfo.logo} alt="Store" fill className="object-cover" />
                ) : (
                  <Store className="text-gray-300 w-6 h-6" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm text-gray-900 truncate" title={storeInfo?.name}>
                  {storeInfo?.name || 'Unknown Store'}
                </h4>
                <div className="flex items-center gap-1 text-xs text-[#0099cc]">
                  <BadgeCheck size={14} /> Verified Seller
                </div>
              </div>
            </div>

            <div className="flex text-center border-t border-gray-200/60 pt-3 mb-3">
              <div className="w-1/3 border-r border-gray-200"><p className="text-[10px] text-gray-400">Rating</p><p className="font-bold text-sm">92%</p></div>
              <div className="w-1/3 border-r border-gray-200"><p className="text-[10px] text-gray-400">Ship Time</p><p className="font-bold text-sm">98%</p></div>
              <div className="w-1/3"><p className="text-[10px] text-gray-400">Response</p><p className="font-bold text-sm">95%</p></div>
            </div>

            {storeInfo?.id ? (
              <Link href={`/home/visit-store/${storeInfo.id}`} className="block w-full">
                <Button variant="outline" className="w-full h-9 border-[#0099cc] text-[#0099cc] hover:bg-blue-50 text-xs font-bold uppercase">
                  Visit Store
                </Button>
              </Link>
            ) : (
              <Button disabled variant="outline" className="w-full h-9 border-gray-200 text-gray-400 text-xs font-bold uppercase">
                Store Unavailable
              </Button>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}