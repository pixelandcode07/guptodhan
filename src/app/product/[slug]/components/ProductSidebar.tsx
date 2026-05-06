'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  Star, Heart, BadgeCheck, Minus, Plus, ShoppingCart, Zap, Store,
  MapPin, Truck, Banknote, RotateCcw, ShieldCheck, ChevronDown, X
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/contexts/WishlistContext';
import { getBrandName, formatPrice, calculateDiscountPercent } from './utils';
import { fadeInUp } from './constants';

// ─── Helpers ───────────────────────────────────────────────────────────────────
const getColorName = (color: any): string => {
  if (!color) return '';
  if (typeof color === 'string') return color;
  if (typeof color === 'object' && color !== null) return color.colorName || color.name || '';
  return '';
};

const getSizeName = (size: any): string => {
  if (!size) return '';
  if (typeof size === 'string') return size;
  if (typeof size === 'object' && size !== null) return size.size || size.name || '';
  return '';
};

/** Parse "..., district:Narayanganj, ..." style address string */
const parseDistrictFromAddress = (address: string): string => {
  if (!address) return '';
  const match = address.match(/district:([^,]+)/i);
  return match ? match[1].trim() : '';
};

interface DeliveryCharge {
  _id: string;
  divisionName: string;
  districtName: string;
  districtNameBangla: string;
  deliveryCharge: number;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function ProductMainInfo({
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
  const { data: session } = useSession();
  const { addToCart, isLoading: cartLoading } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist, getWishlistItemId, isLoading: wishlistLoading } = useWishlist();

  const [quantity, setQuantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isProductInWishlist, setIsProductInWishlist] = useState(false);
  const [isWishlistToggling, setIsWishlistToggling] = useState(false);

  // ── Delivery state ────────────────────────────────────────────────────────────
  const [deliveryCharges, setDeliveryCharges] = useState<DeliveryCharge[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState<DeliveryCharge | null>(null);
  const [showDistrictPicker, setShowDistrictPicker] = useState(false);
  const [districtSearch, setDistrictSearch] = useState('');
  const [deliveryLoading, setDeliveryLoading] = useState(true);
  const pickerRef = useRef<HTMLDivElement>(null);

  // ─── Store Info ───────────────────────────────────────────────────────────────
  const storeInfo = useMemo(() => {
    const vendor = product.vendorStoreId;
    let id = null;
    let name = 'Unknown Store';
    let logo = null;

    if (vendor && typeof vendor === 'object') {
      name = vendor.storeName || name;
      logo = vendor.storeLogo || logo;
      id = vendor._id || vendor.id || null;
    }

    if (!id && relatedData?.stores?.length > 0) {
      if (name !== 'Unknown Store') {
        const foundByName = relatedData.stores.find((s: any) => s.storeName === name);
        if (foundByName) {
          id = foundByName._id || foundByName.id;
          if (!logo) logo = foundByName.storeLogo;
        }
      }
      if (!id && vendor && typeof vendor === 'string') {
        const foundById = relatedData.stores.find((s: any) => s._id === vendor || s.id === vendor);
        if (foundById) {
          id = foundById._id || foundById.id;
          name = foundById.storeName;
          logo = foundById.storeLogo;
        }
      }
    }

    return id ? { id, name, logo } : null;
  }, [product.vendorStoreId, relatedData?.stores]);

  // ─── Wishlist Status ──────────────────────────────────────────────────────────
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (product?._id && session?.user) {
        const inWishlist = await isInWishlist(product._id);
        setIsProductInWishlist(inWishlist);
      }
    };
    checkWishlistStatus();
  }, [product?._id, isInWishlist, session?.user]);

  // ─── Delivery Charge Logic ────────────────────────────────────────────────────
  /**
   * RULE:
   * 1. product.shippingCost set আছে → fixed charge, district দেখার দরকার নেই
   * 2. shippingCost নেই → API থেকে district-wise charge আনো
   * a. User logged in → profile address থেকে district বের করো
   * b. User logged in নয় → default 130
   */
  const hasFixedShipping = !!(product?.shippingCost && product.shippingCost > 0);

  useEffect(() => {
    // Fixed shipping হলে API call দরকার নেই
    if (hasFixedShipping) {
      setDeliveryLoading(false);
      return;
    }

    const initDelivery = async () => {
      setDeliveryLoading(true);
      try {
        // Fetch all delivery charges with cache: 'no-store' to get latest updates from admin panel
        const chargesRes = await fetch('/api/v1/delivery-charge', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const chargesData = await chargesRes.json();
        const charges: DeliveryCharge[] = chargesData?.data ?? [];
        setDeliveryCharges(charges);

        // If not logged in → default 130
        if (!session?.user) {
          setDeliveryLoading(false);
          return;
        }

        // Fetch user profile to get district (also bypassing cache)
        const profileRes = await fetch('/api/v1/profile/me', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const profileData = await profileRes.json();
        const address: string = profileData?.data?.address ?? '';
        const userDistrict = parseDistrictFromAddress(address);

        if (userDistrict && charges.length > 0) {
          const matched = charges.find(
            (c) => c.districtName.toLowerCase() === userDistrict.toLowerCase()
          );
          if (matched) setSelectedDistrict(matched);
        }
      } catch (err) {
        console.error('Delivery charge fetch error:', err);
      } finally {
        setDeliveryLoading(false);
      }
    };

    initDelivery();
  }, [session?.user, hasFixedShipping]);

  // Close district picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowDistrictPicker(false);
      }
    };
    if (showDistrictPicker) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDistrictPicker]);

  // ── Computed delivery values ──────────────────────────────────────────────────
  const deliveryCharge = useMemo(() => {
    if (hasFixedShipping) return product.shippingCost;
    if (selectedDistrict) return selectedDistrict.deliveryCharge;
    return 130; // default when not logged in or district not matched
  }, [hasFixedShipping, product?.shippingCost, selectedDistrict]);

  const deliveryLocationText = useMemo(() => {
    if (selectedDistrict) {
      return `${selectedDistrict.districtName}, ${selectedDistrict.divisionName} Division`;
    }
    return 'Bangladesh (Default)';
  }, [selectedDistrict]);

  const filteredDistricts = useMemo(() => {
    if (!districtSearch) return deliveryCharges;
    const q = districtSearch.toLowerCase();
    return deliveryCharges.filter(
      (c) =>
        c.districtName.toLowerCase().includes(q) ||
        c.districtNameBangla.includes(districtSearch) ||
        c.divisionName.toLowerCase().includes(q)
    );
  }, [deliveryCharges, districtSearch]);

  // Group districts by division for better UX
  const groupedDistricts = useMemo(() => {
    const groups: Record<string, DeliveryCharge[]> = {};
    filteredDistricts.forEach((d) => {
      if (!groups[d.divisionName]) groups[d.divisionName] = [];
      groups[d.divisionName].push(d);
    });
    return groups;
  }, [filteredDistricts]);

  // ─── Handlers ─────────────────────────────────────────────────────────────────
  const handleWishlist = async () => {
    if (!session?.user) {
      toast.error('Please login to add to wishlist');
      const loginButton = document.getElementById('login-modal-btn');
      if (loginButton) loginButton.click();
      else toast.info('Please click the Login button at the top.');
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
      console.error('Wishlist error:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setIsWishlistToggling(false);
    }
  };

  const handleDistrictSelect = (district: DeliveryCharge) => {
    setSelectedDistrict(district);
    setShowDistrictPicker(false);
    setDistrictSearch('');
    toast.success(`Delivery charge updated for ${district.districtName}`);
  };

  const handleBuyNow = async () => {
    if (availableColors.length > 0 && !selectedColor) return toast.error('Please select a color');
    if (availableSizes.length > 0 && !selectedSize) return toast.error('Please select a size');

    if (!session?.user) {
      toast.error('Please login to complete your purchase');
      localStorage.setItem('redirectAfterLogin', '/products/shoppinginfo?buyNow=true');
      sessionStorage.setItem('buyNowProductId', product._id);
      const loginButton =
        document.getElementById('login-modal-btn') ||
        document.getElementById('login-modal-btn-mobile');
      if (loginButton) loginButton.click();
      return;
    }

    setIsBuyingNow(true);
    try {
      await addToCart(product._id, quantity, {
        skipModal: true, silent: true,
        color: selectedColor || undefined, size: selectedSize || undefined,
      });
      sessionStorage.setItem('buyNowProductId', product._id);
      router.push('/products/shoppinginfo?buyNow=true');
    } catch {
      toast.error('Failed to process buy now');
    } finally {
      setIsBuyingNow(false);
    }
  };

  const handleAddToCart = async () => {
    if (availableColors.length > 0 && !selectedColor) return toast.error('Please select a color');
    if (availableSizes.length > 0 && !selectedSize) return toast.error('Please select a size');
    await addToCart(product._id, quantity, {
      color: selectedColor || undefined,
      size: selectedSize || undefined,
    });
  };

  // ─── Variant Logic ────────────────────────────────────────────────────────────
  const availableColors = useMemo(() => {
    if (!product.productOptions) return [];
    const colors = product.productOptions.map((opt: any) => {
      const rawColor = Array.isArray(opt.color) ? opt.color[0] : opt.color;
      return getColorName(rawColor);
    });
    return Array.from(new Set(colors)).filter(Boolean) as string[];
  }, [product.productOptions]);

  const availableSizes = useMemo(() => {
    if (!selectedColor || !product.productOptions) return [];
    const matchingOptions = product.productOptions.filter((opt: any) => {
      const rawColor = Array.isArray(opt.color) ? opt.color[0] : opt.color;
      return getColorName(rawColor) === selectedColor;
    });
    const sizes = matchingOptions.flatMap((opt: any) => {
      const rawSizes = Array.isArray(opt.size) ? opt.size : [opt.size];
      return rawSizes.map((s: any) => getSizeName(s));
    });
    return Array.from(new Set(sizes)).filter(Boolean) as string[];
  }, [selectedColor, product.productOptions]);

  const selectedVariant = useMemo(() => {
    if (!selectedColor || !product.productOptions) return null;
    return product.productOptions.find((opt: any) => {
      const rawColor = Array.isArray(opt.color) ? opt.color[0] : opt.color;
      const rawSize = Array.isArray(opt.size) ? opt.size[0] : opt.size;
      const colorMatch = getColorName(rawColor) === selectedColor;
      const sizeMatch = selectedSize ? getSizeName(rawSize) === selectedSize : true;
      return colorMatch && sizeMatch;
    });
  }, [selectedColor, selectedSize, product.productOptions]);

  const variantStock = selectedVariant?.stock ?? product.stock ?? 0;
  const variantPrice = selectedVariant?.price ?? product.productPrice ?? 0;
  const variantDiscountPrice = selectedVariant?.discountPrice ?? product.discountPrice;
  const finalPrice = variantDiscountPrice || variantPrice || 0;
  const discountPercent = calculateDiscountPercent(variantPrice, variantDiscountPrice);

  // ─── Render ───────────────────────────────────────────────────────────────────
  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 md:p-6 shadow-sm">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">

        {/* ── LEFT: Product Info ──────────────────────────────────────────────── */}
        <div className="flex-1 space-y-4 sm:space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blue-600 px-2 py-1 bg-blue-50 rounded">
                {getBrandName(product, relatedData?.brands)}
              </span>
              <button
                onClick={handleWishlist}
                disabled={isWishlistToggling || wishlistLoading}
                className={`p-2 rounded-full border transition-all duration-200 ${isProductInWishlist
                  ? 'bg-red-50 text-red-500 border-red-100 scale-110'
                  : 'border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-red-500'
                  }`}
                title="Add to wishlist"
              >
                <Heart size={20} fill={isProductInWishlist ? 'currentColor' : 'none'} />
              </button>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight break-words">
              {product.productTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm">
              <div className="flex items-center gap-1 text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                <Star size={14} className="fill-current" />
                <span className="font-bold text-slate-700">{averageRating || '0'}</span>
                <span className="text-slate-500">({reviews.length} Reviews)</span>
              </div>
              <div className={`flex items-center gap-1.5 font-medium px-2 py-0.5 rounded-full border ${variantStock > 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                <BadgeCheck size={14} />
                {variantStock > 0 ? `${variantStock} In Stock` : 'Out of Stock'}
              </div>
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* Pricing */}
          <div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-2xl sm:text-3xl font-extrabold text-[#EF4A23]">{formatPrice(finalPrice)}</span>
              {variantDiscountPrice && (
                <>
                  <span className="text-sm sm:text-lg text-gray-400 line-through font-medium">{formatPrice(variantPrice)}</span>
                  <span className="bg-[#EF4A23]/10 text-[#EF4A23] text-xs font-bold px-2 py-1 rounded-md">-{discountPercent}% OFF</span>
                </>
              )}
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            {availableColors.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-2 block">
                  Color: <span className="font-normal text-slate-500">{selectedColor}</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => onColorChange?.(color)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold border transition-all ${selectedColor === color
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                        }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {availableSizes.length > 0 && (
              <div>
                <label className="text-sm font-semibold text-slate-900 mb-2 block">
                  Size: <span className="font-normal text-slate-500">{selectedSize}</span>
                </label>
                <div className="flex gap-2 flex-wrap">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => onSizeChange?.(size)}
                      className={`min-w-[40px] h-9 px-2 flex items-center justify-center rounded border text-xs font-bold transition-all ${selectedSize === size
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-gray-200 text-gray-600 hover:border-gray-400'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity & Actions */}
          <div className="flex flex-col gap-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-200 rounded-md">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-600">
                  <Minus size={16} />
                </button>
                <span className="w-10 text-center text-sm font-bold border-x border-gray-100 py-1.5">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} disabled={quantity >= variantStock} className="w-9 h-9 flex items-center justify-center hover:bg-gray-50 text-gray-600 disabled:opacity-50">
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="flex gap-3 w-full">
              <Button onClick={handleBuyNow} disabled={isBuyingNow || variantStock === 0} className="flex-1 h-12 bg-[#00005E] hover:bg-[#000040] text-white font-bold rounded-md shadow-lg shadow-blue-900/10 uppercase tracking-wide text-xs sm:text-sm">
                <Zap size={18} className="mr-2" /> Buy Now
              </Button>
              <Button onClick={handleAddToCart} disabled={cartLoading || variantStock === 0} variant="outline" className="flex-1 h-12 border-2 border-gray-200 text-gray-800 font-bold rounded-md hover:border-gray-800 hover:bg-transparent uppercase tracking-wide text-xs sm:text-sm">
                <ShoppingCart size={18} className="mr-2" /> Add to Cart
              </Button>
            </div>

            {product.shortDescription && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600 leading-relaxed">{product.shortDescription}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Sidebar ──────────────────────────────────────────────────── */}
        <div className="w-full lg:w-[320px] xl:w-[350px] shrink-0 flex flex-col gap-4 border-t lg:border-t-0 lg:border-l lg:pl-8 border-gray-100 pt-6 lg:pt-0">

          {/* ── Delivery Card ─────────────────────────────────────────────────── */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 relative">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Delivery</h3>

              {/* CHANGE button — only show when district-based (no fixed shipping) */}
              {!hasFixedShipping && !deliveryLoading && deliveryCharges.length > 0 && (
                <button
                  onClick={() => setShowDistrictPicker((v) => !v)}
                  className="text-[#0099cc] text-xs font-bold hover:underline flex items-center gap-1"
                >
                  CHANGE <ChevronDown size={12} className={`transition-transform ${showDistrictPicker ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>

            {/* Location text */}
            <div className="flex gap-3 mb-3 items-start">
              <MapPin className="text-gray-400 shrink-0 mt-0.5" size={18} />
              <span className="text-sm text-gray-700 leading-snug">
                {hasFixedShipping
                  ? 'All over Bangladesh'
                  : deliveryLocationText
                }
              </span>
            </div>

            {/* Charge info */}
            <div className="space-y-2.5 pt-3 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <div className="flex gap-2 text-gray-600 font-medium">
                  <Truck size={16} /> Standard Delivery
                </div>
                {deliveryLoading ? (
                  <span className="text-gray-400 text-xs animate-pulse">Loading...</span>
                ) : (
                  <span className="font-bold text-gray-900">৳{deliveryCharge}</span>
                )}
              </div>

              {/* Fixed shipping badge */}
              {hasFixedShipping && (
                <p className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100 font-medium">
                  Vendor fixed shipping rate
                </p>
              )}

              {/* Not logged in notice */}
              {!hasFixedShipping && !session?.user && !deliveryLoading && (
                <p className="text-xs text-gray-400 pl-6">Login to see your district rate</p>
              )}

              <div className="flex gap-2 text-sm text-gray-600 font-medium">
                <Banknote size={16} /> Cash on Delivery Available
              </div>
            </div>

            {/* ── District Picker Dropdown ─────────────────────────────────────── */}
            {showDistrictPicker && !hasFixedShipping && (
              <div
                ref={pickerRef}
                className="absolute left-0 right-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden"
                style={{ maxHeight: '360px' }}
              >
                {/* Search */}
                <div className="p-3 border-b border-gray-100 sticky top-0 bg-white">
                  <div className="flex items-center gap-2">
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search district..."
                      value={districtSearch}
                      onChange={(e) => setDistrictSearch(e.target.value)}
                      className="flex-1 text-sm border border-gray-200 rounded-md px-3 py-1.5 outline-none focus:border-[#0099cc] transition-colors"
                    />
                    <button
                      onClick={() => { setShowDistrictPicker(false); setDistrictSearch(''); }}
                      className="text-gray-400 hover:text-gray-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* District list grouped by division */}
                <div className="overflow-y-auto" style={{ maxHeight: '280px' }}>
                  {Object.keys(groupedDistricts).length === 0 ? (
                    <p className="text-center text-sm text-gray-400 py-6">No district found</p>
                  ) : (
                    Object.entries(groupedDistricts).map(([division, districts]) => (
                      <div key={division}>
                        <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 sticky top-0">
                          {division}
                        </div>
                        {districts.map((d) => (
                          <button
                            key={d._id}
                            onClick={() => handleDistrictSelect(d)}
                            className={`w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-blue-50 transition-colors text-sm ${selectedDistrict?._id === d._id ? 'bg-blue-50 text-[#0099cc] font-semibold' : 'text-gray-700'
                              }`}
                          >
                            <span>
                              {d.districtName}
                              <span className="text-gray-400 text-xs ml-1">({d.districtNameBangla})</span>
                            </span>
                            <span className="font-bold text-gray-900 shrink-0 ml-2">৳{d.deliveryCharge}</span>
                          </button>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ── Services Card ─────────────────────────────────────────────────── */}
          <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Services</h3>
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

          {/* ── Sold By Card ──────────────────────────────────────────────────── */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Sold By</h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white border border-gray-200 rounded-lg flex items-center justify-center overflow-hidden relative shrink-0">
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
                <div className="flex items-center gap-1 text-xs text-[#0099cc] font-medium mt-0.5">
                  <BadgeCheck size={14} fill="#e0f2fe" /> Verified Seller
                </div>
              </div>
            </div>

            <div className="flex text-center border-t border-gray-100 pt-3 mb-4 bg-gray-50 rounded-md p-2">
              <div className="w-1/3 border-r border-gray-200">
                <p className="text-[10px] text-gray-400 uppercase">Rating</p>
                <p className="font-bold text-sm text-gray-800">92%</p>
              </div>
              <div className="w-1/3 border-r border-gray-200">
                <p className="text-[10px] text-gray-400 uppercase">Ship Time</p>
                <p className="font-bold text-sm text-gray-800">98%</p>
              </div>
              <div className="w-1/3">
                <p className="text-[10px] text-gray-400 uppercase">Response</p>
                <p className="font-bold text-sm text-gray-800">95%</p>
              </div>
            </div>

            {storeInfo?.id ? (
              <Link href={`/home/visit-store/${storeInfo.id}`} className="block w-full">
                <Button variant="outline" className="w-full h-10 border-[#0099cc] text-[#0099cc] hover:bg-blue-50 text-xs font-bold uppercase transition-all">
                  Visit Store
                </Button>
              </Link>
            ) : (
              <Button disabled variant="outline" className="w-full h-10 border-gray-200 text-gray-400 text-xs font-bold uppercase">
                Store Unavailable
              </Button>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}