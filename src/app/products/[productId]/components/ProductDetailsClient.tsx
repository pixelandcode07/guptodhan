'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronRight, 
  Star, 
  Heart, 
  Share2,
  MapPin,
  Info,
  Store,
  ShieldCheck,
  User,
  Home,
  CheckCircle2,
  Banknote,
  MessageCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react'; 
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { ProductQASection } from './ProductQASection';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Interfaces ---
interface Review {
  _id: string;
  reviewId: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  uploadedTime: string;
  rating: number;
  comment: string;
  userImage: string;
}

type EntityRef<T extends object = Record<string, unknown>> =
  | string
  | (T & { _id?: string; id?: string; name?: string; brandName?: string })
  | null
  | undefined;

interface ProductData {
  product: {
    _id: string;
    productTitle: string;
    shortDescription: string;
    fullDescription: string;
    specification: string;
    warrantyPolicy: string;
    photoGallery: string[];
    thumbnailImage: string;
    productPrice: number;
    discountPrice?: number;
    stock?: number;
    status: 'active' | 'inactive';
    vendorStoreId?: EntityRef<{ storeName?: string; storeLogo?: string }>;
    category?: EntityRef<{ name?: string }>;
    brand?: EntityRef<{ name?: string; brandName?: string }>;
    createdAt: string;
    productOptions?: Array<{
      productImage?: string;
      color?: string;
      size?: string;
     }>;
    qna?: any[];
  };
  relatedData: {
    categories: Array<{ _id: string; name: string }>;
    stores: Array<{
      _id: string;
      storeName: string;
      storeAddress?: string;
      storePhone?: string;
      storeEmail?: string;
      vendorShortDescription?: string;
      storeLogo?: string;
      fullDescription?: string;
    }>;
    variantOptions?: {
      colors?: Array<{ _id: string; name?: string; colorName?: string }>;
      sizes?: Array<{ _id: string; name?: string; sizeName?: string }>;
    };
  };
}

interface ProductDetailsClientProps {
  productData: ProductData;
}

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const tabContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" }
    }
};

const imageFadeVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const breadcrumbContainerVariants = {
    hidden: { opacity: 0 },
    visible: { 
        opacity: 1, 
        transition: { staggerChildren: 0.1, delayChildren: 0.2 } 
    }
};

const breadcrumbItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
};

export default function ProductDetailsClient({ productData }: ProductDetailsClientProps) {
  const router = useRouter();
  const { data: session } = useSession(); 
  const { product, relatedData } = productData;
  const { addToCart, isLoading: cartLoading, isAddingToCart } = useCart();
  const { addToWishlist, isLoading: isWishlistLoading } = useWishlist();
  
  // --- States ---
  const [selectedImage, setSelectedImage] = useState(product.thumbnailImage);
  const [quantity, setQuantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);
  
  // Delivery Location State
  const [locationType, setLocationType] = useState<'dhaka' | 'outside'>('dhaka');
  
  // Reviews State
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  
  // Review Form State
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // --- Helpers ---
  const getEntityId = (value: EntityRef): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      if (typeof value._id === 'string') return value._id;
      if (typeof value.id === 'string') return value.id;
    }
    return '';
  };

  const getCategoryName = () => {
    const catId = getEntityId(product.category);
    const foundCat = relatedData.categories.find(c => c._id === catId);
    if (foundCat) return foundCat.name;
    if (typeof product.category === 'object' && product.category !== null) {
        return product.category.name || 'Category';
    }
    return 'Category';
  };

  const getBrandName = () => {
    if (typeof product.brand === 'object' && product.brand !== null) {
        return product.brand.name || product.brand.brandName || 'No Brand';
    }
    return 'No Brand';
  };

  const getStoreDetails = () => {
    const storeId = getEntityId(product.vendorStoreId);
    return relatedData.stores.find((store) => store._id === storeId);
  };

  const storeDetails = getStoreDetails();

  // --- Delivery Logic ---
  const deliveryCharge = locationType === 'dhaka' ? 70 : 130;
  const deliveryTime = locationType === 'dhaka' ? '1 - 4 day(s)' : '4 - 7 day(s)';
  const locationText = locationType === 'dhaka' 
        ? 'Dhaka, Dhaka North, Banani Road No. 12 - 19' 
        : 'Outside Dhaka, Sadar, Chattogram';

  const toggleLocation = () => {
      setLocationType(prev => prev === 'dhaka' ? 'outside' : 'dhaka');
      toast.success(`Location changed to ${locationType === 'dhaka' ? 'Outside Dhaka' : 'Inside Dhaka'}`);
  };

  // --- Options Logic ---
  const colorLabelLookup = useMemo(() => {
    const map = new Map<string, string>();
    (relatedData.variantOptions?.colors ?? []).forEach((color) => {
      if (!color?._id) return;
      const label = color.name || color.colorName;
      if (label) map.set(color._id, label);
    });
    return map;
  }, [relatedData.variantOptions?.colors]);

  const sizeLabelLookup = useMemo(() => {
    const map = new Map<string, string>();
    (relatedData.variantOptions?.sizes ?? []).forEach((size) => {
      if (!size?._id) return;
      const label = size.name || size.sizeName;
      if (label) map.set(size._id, label);
    });
    return map;
  }, [relatedData.variantOptions?.sizes]);

  const colorOptions = useMemo(() => {
    const map = new Map<string, { id: string; label: string; image?: string }>();
    (product.productOptions ?? []).forEach((option) => {
      const optionImage = option.productImage?.trim().length ? option.productImage : undefined;
      const colors = Array.isArray(option.color) ? option.color : option.color ? [option.color] : [];
      
      colors.forEach((colorValue: any) => {
        if (typeof colorValue !== 'string') return;
        const id = colorValue.trim();
        if (!id) return;
        const label = colorLabelLookup.get(id) || id;
        if (map.has(id)) {
            const existing = map.get(id)!;
            if (!existing.image && optionImage) existing.image = optionImage;
        } else {
            map.set(id, { id, label, image: optionImage });
        }
      });
    });
    return Array.from(map.values());
  }, [product.productOptions, colorLabelLookup]);

  const sizeOptions = useMemo(() => {
    const seen = new Set<string>();
    const list: Array<{ id: string; label: string }> = [];
    (product.productOptions ?? []).forEach((option) => {
      const sizes = Array.isArray(option.size) ? option.size : option.size ? [option.size] : [];
      sizes.forEach((sizeValue: any) => {
        if (typeof sizeValue !== 'string') return;
        const id = sizeValue.trim();
        if (!id || seen.has(id)) return;
        seen.add(id);
        const label = sizeLabelLookup.get(id) || id;
        list.push({ id, label });
      });
    });
    return list;
  }, [product.productOptions, sizeLabelLookup]);

  useEffect(() => {
    if (colorOptions.length > 0 && !selectedColorId) setSelectedColorId(colorOptions[0].id);
  }, [colorOptions, selectedColorId]);

  useEffect(() => {
    if (sizeOptions.length > 0 && !selectedSizeId) setSelectedSizeId(sizeOptions[0].id);
  }, [sizeOptions, selectedSizeId]);


  // --- Handlers ---
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.productTitle,
          text: product.shortDescription,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleBuyNow = async () => {
    setIsBuyingNow(true);
    try {
      await addToCart(product._id, quantity, { skipModal: true, silent: true });
      router.push('/home/product/shoppinginfo');
    } catch (error) {
      console.error('Error in buy now:', error);
      toast.error('Failed to proceed to checkout');
    } finally {
      setIsBuyingNow(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // --- Reviews ---
  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const response = await fetch(`/api/v1/product-review/product-review-product/${product._id}`);
      const data = await response.json();
      if (data.success) setReviews(data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  }, [product._id]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleSubmitReview = async () => {
    if (!session?.user) {
        toast.error('Please login to submit a review');
        return;
    }
    if (newReviewRating === 0) {
        toast.error('Please select a rating star');
        return;
    }

    setIsSubmittingReview(true);
    const payload = {
        reviewId: `REV-${Date.now()}`,
        productId: product._id,
        userId: (session.user as any).id || (session.user as any)._id,
        userName: session.user.name || 'Anonymous',
        userEmail: session.user.email,
        rating: newReviewRating,
        comment: newReviewComment,
        userImage: session.user.image || 'https://placehold.co/100x100?text=User',
        reviewImages: []
    };

    try {
        const response = await fetch('/api/v1/product-review', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        if (result.success) {
            toast.success('Review submitted successfully!');
            setNewReviewRating(0);
            setNewReviewComment('');
            fetchReviews();
        } else {
            toast.error(result.message || 'Failed to submit review');
        }
    } catch (error) {
        console.error(error);
        toast.error('Something went wrong!');
    } finally {
        setIsSubmittingReview(false);
    }
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const discountPercent = product.discountPrice 
    ? Math.round(((product.productPrice - product.discountPrice) / product.productPrice) * 100) 
    : 0;

  const selectedColorName = colorOptions.find(c => c.id === selectedColorId)?.label;
  const selectedSizeName = sizeOptions.find(s => s.id === selectedSizeId)?.label;


  // ================= RENDER START =================
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#f2f4f8] font-sans text-gray-800 pb-12"
    >
      
      {/* --- DYNAMIC BREADCRUMB SECTION --- */}
      <div className="bg-white shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3">
            <motion.div 
                className="flex items-center flex-wrap gap-1.5 text-xs sm:text-sm text-gray-500"
                variants={breadcrumbContainerVariants}
                initial="hidden"
                animate="visible"
            >
                <Link href="/">
                    <motion.div 
                        variants={breadcrumbItemVariants}
                        whileHover={{ scale: 1.05, color: "#0099cc", x: 2 }}
                        className="flex items-center gap-1 cursor-pointer transition-colors duration-200"
                    >
                        <Home size={14} />
                        <span>Home</span>
                    </motion.div>
                </Link>

                <motion.div variants={breadcrumbItemVariants} className="text-gray-400">
                    <ChevronRight size={14} />
                </motion.div>

                <Link href={`/category/${getEntityId(product.category)}`}>
                    <motion.div 
                        variants={breadcrumbItemVariants}
                        whileHover={{ scale: 1.05, color: "#0099cc", x: 2 }}
                        className="cursor-pointer transition-colors duration-200 font-medium"
                    >
                        {getCategoryName()}
                    </motion.div>
                </Link>

                <motion.div variants={breadcrumbItemVariants} className="text-gray-400">
                    <ChevronRight size={14} />
                </motion.div>

                <motion.div 
                    variants={breadcrumbItemVariants}
                    whileHover={{ scale: 1.05, color: "#0099cc", x: 2 }}
                    className="cursor-pointer transition-colors duration-200 font-medium"
                >
                    {getBrandName()}
                </motion.div>

                <motion.div variants={breadcrumbItemVariants} className="text-gray-400">
                    <ChevronRight size={14} />
                </motion.div>

                <motion.div 
                    variants={breadcrumbItemVariants}
                    className="text-[#D83088] font-medium truncate max-w-[150px] sm:max-w-[300px]"
                >
                    {product.productTitle}
                </motion.div>
            </motion.div>
        </div>
      </div>


      {/* --- Main Product Section --- */}
      <div className="container mx-auto px-4 mt-4">
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 bg-white p-4 rounded shadow-sm border border-gray-200"
        >
          
          {/* Left: Image Gallery */}
          <div className="lg:col-span-4">
            <div className="border-0 rounded mb-2 bg-white flex items-center justify-center h-[350px] sm:h-[400px] relative overflow-hidden">
              <AnimatePresence mode='wait'>
                <motion.div
                   key={selectedImage}
                   variants={imageFadeVariants}
                   initial="initial"
                   animate="animate"
                   exit="exit"
                   className="relative w-full h-full"
                >
                   <Image 
                     src={selectedImage} 
                     alt={product.productTitle} 
                     fill
                     className="object-contain"
                     priority
                   />
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {(product.photoGallery || [product.thumbnailImage]).map((img, idx) => (
                   <motion.div 
                     key={idx} 
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => setSelectedImage(img)}
                     className={`w-16 h-16 border rounded cursor-pointer flex-shrink-0 relative bg-white transition-all overflow-hidden ${selectedImage === img ? 'border-[#0099cc] ring-1 ring-[#0099cc]' : 'border-gray-200 hover:border-gray-400'}`}
                   >
                      <Image src={img} alt={`thumb-${idx}`} fill className="object-cover"/>
                   </motion.div>
                ))}
            </div>
          </div>

          {/* Middle: Product Info */}
          <div className="lg:col-span-5 space-y-4 px-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-normal text-gray-900 mb-2 leading-tight">
                {product.productTitle}
              </h1>
              
              <div className="flex items-center gap-4 text-sm mb-3">
                <div className="flex items-center gap-1">
                    <div className="flex text-orange-400">
                         {[1,2,3,4,5].map((s) => (
                            <Star key={s} size={14} fill={s <= Math.round(Number(averageRating)) ? "currentColor" : "none"} />
                         ))}
                    </div>
                    <span className="text-[#0099cc] hover:underline cursor-pointer">Rating {reviews.length || 58}</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-[#0099cc] hover:underline cursor-pointer">2 Answered Questions</span>
              </div>

              <div className="flex items-center gap-2 text-xs sm:text-sm mb-3">
                 <span className="text-gray-500">Brand:</span>
                 <span className="text-[#0099cc] cursor-pointer font-medium">{getBrandName()}</span>
                 <span className="text-gray-300">|</span>
                 <span className="text-[#0099cc] cursor-pointer hover:underline">More {getCategoryName()} from {getBrandName()}</span>
              </div>

              <div className="border-t border-b py-3 border-gray-100">
                 <div className="flex items-center gap-2">
                    <span className="text-3xl font-medium text-[#0099cc]">
                       {formatPrice(product.discountPrice || product.productPrice)}
                    </span>
                 </div>
                 {product.discountPrice && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-gray-400 line-through text-sm">
                        {formatPrice(product.productPrice)}
                      </span>
                      <span className="text-gray-900 text-sm">
                         -{discountPercent}%
                      </span>
                    </div>
                 )}
              </div>
            </div>

            {/* Options Section */}
            <div className="space-y-4">
                {/* Color */}
                {colorOptions.length > 0 && (
                    <div>
                        <div className="flex items-center gap-1 mb-2">
                            <span className="text-gray-500 text-sm">Available Color:</span>
                            <span className="font-bold text-gray-800 text-sm">{selectedColorName}</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {colorOptions.map((c) => (
                              <motion.button 
                                key={c.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setSelectedColorId(c.id)}
                                className={`relative h-10 min-w-[40px] border rounded flex items-center justify-center overflow-hidden transition-all ${selectedColorId === c.id ? 'border-[#0099cc] ring-1 ring-[#0099cc]' : 'border-gray-200 hover:border-gray-400'}`}
                              >
                                 {c.image ? (
                                     <Image src={c.image} alt={c.label} width={38} height={38} className="object-cover w-full h-full"/>
                                 ) : (
                                     <span className="px-2 text-xs font-medium">{c.label}</span>
                                 )}
                              </motion.button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Size */}
                {sizeOptions.length > 0 && (
                    <div>
                        <div className="flex items-center gap-1 mb-2">
                            <span className="text-gray-500 text-sm">Select Size:</span>
                            <span className="font-bold text-gray-800 text-sm">{selectedSizeName}</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {sizeOptions.map((s) => (
                                <motion.button 
                                    key={s.id} 
                                    whileHover={{ scale: 1.05, backgroundColor: "#f0f9ff" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedSizeId(s.id)}
                                    className={`h-9 px-4 border rounded text-sm font-medium transition-all ${selectedSizeId === s.id ? 'border-[#0099cc] text-[#0099cc] bg-[#f0f9ff]' : 'border-gray-200 hover:border-[#0099cc] text-gray-700'}`}
                                >
                                    {s.label}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex gap-3 mt-2">
                   <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                       <Button 
                         onClick={handleBuyNow}
                         disabled={isBuyingNow || !product.stock}
                         className="w-full h-11 bg-[#0099cc] hover:bg-[#0088bb] text-white font-medium text-base rounded-sm shadow-none"
                       >
                         {isBuyingNow ? 'Processing...' : 'Buy Now'}
                       </Button>
                   </motion.div>
                   
                   <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                       <Button 
                         onClick={handleAddToCart}
                         disabled={cartLoading || isAddingToCart || !product.stock}
                         className="w-full h-11 bg-[#0e1133] hover:bg-[#1a1e4d] text-white font-medium text-base rounded-sm shadow-none"
                       >
                         {cartLoading || isAddingToCart ? 'Adding...' : 'Add to Cart'}
                       </Button>
                   </motion.div>
                </div>
            </div>

            <div className="flex gap-6 text-sm text-gray-500 pt-2 border-t mt-4 border-gray-100">
                 <button onClick={() => addToWishlist(product._id)} disabled={isWishlistLoading} className="flex items-center gap-2 hover:text-[#0099cc] transition group">
                    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                        <Heart size={16} className="group-hover:text-[#0099cc]"/>
                    </motion.div>
                    <span className="text-xs">Add to Wishlist</span>
                 </button>
                 <button onClick={handleShare} className="flex items-center gap-2 hover:text-[#0099cc] transition group">
                    <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
                        <Share2 size={16} className="group-hover:text-[#0099cc]"/>
                    </motion.div>
                    <span className="text-xs">Share</span>
                 </button>
            </div>
          </div>

          {/* ================= RIGHT SIDEBAR (DYNAMIC) ================= */}
          <div className="lg:col-span-3 space-y-0 bg-[#fafafa] h-fit">
             
             {/* Delivery Option Section */}
             <div className="bg-[#fafafa] p-4">
                 <h3 className="text-xs font-medium text-gray-500 uppercase mb-4 tracking-wide">Delivery option</h3>
                 
                 {/* Dynamic Location Address */}
                 <div className="flex items-start gap-3 mb-5">
                    <MapPin className="text-gray-500 mt-1 shrink-0" size={20} />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                             <span className="text-sm text-gray-800 font-normal leading-snug">
                                {locationText}
                             </span>
                             <button 
                                onClick={toggleLocation}
                                className="text-[#0099cc] text-xs font-bold uppercase hover:underline ml-2 shrink-0"
                             >
                                CHANGE
                             </button>
                        </div>
                    </div>
                 </div>
                 
                 {/* Dynamic Standard Delivery */}
                 <div className="flex items-start gap-3 mb-4">
                    <div className="w-[20px] flex justify-center mt-0.5">
                        <Store className="text-gray-500" size={20} />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center">
                             <span className="text-sm font-normal text-gray-800">Standard Delivery</span>
                             <motion.span 
                                key={deliveryCharge}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm font-bold text-gray-800"
                             >
                                Tk {deliveryCharge}
                             </motion.span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{deliveryTime}</p>
                    </div>
                 </div>

                 {/* Cash on Delivery */}
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-[20px] flex justify-center">
                        <div className="border border-gray-400 rounded-full p-[3px]">
                            <Banknote size={12} className="text-gray-600"/>
                        </div>
                    </div>
                    <span className="text-sm text-gray-800">Cash on Delivery Available</span>
                 </div>
                 
                 <div className="border-t border-gray-200 my-4"></div>

                 {/* Service Section */}
                 <div className="flex items-start gap-3">
                    <div className="w-[20px] flex justify-center mt-0.5">
                        <Info className="text-gray-500" size={20} />
                    </div>
                    <div className="flex-1">
                        <span className="text-sm font-medium text-gray-800 block mb-1">Service</span>
                        
                        <span className="text-xs text-gray-500 block mb-0.5">7 Days Returns</span>
                        <span className="text-xs text-gray-400 block mb-1">Change of mind is not applicable</span>
                        
                        <span className="text-xs text-gray-500 block font-medium">
                            {product.warrantyPolicy ? product.warrantyPolicy : 'Warranty not available'}
                        </span>
                    </div>
                 </div>
             </div>

             {/* Sold By Section */}
             <div className="bg-white border p-4 mt-3 rounded-sm">
                 <p className="text-xs text-gray-500 mb-3">Sold by</p>
                 
                 <div className="flex justify-between items-start mb-5">
                    <div className="flex gap-3 overflow-hidden">
                       {/* Dynamic Store Logo */}
                       {storeDetails?.storeLogo ? (
                          <Image src={storeDetails.storeLogo} width={30} height={30} alt="Store" className="rounded-sm border object-cover w-[30px] h-[30px]"/>
                       ) : (
                          <div className="w-[30px] h-[30px] rounded-sm bg-gray-100 border flex items-center justify-center text-[#0099cc] font-bold shrink-0">
                             {storeDetails?.storeName?.charAt(0) || 'S'}
                          </div>
                       )}
                       
                       <div className="flex flex-col">
                           <div className="flex items-center gap-1">
                                <span className="font-medium text-gray-800 text-sm truncate max-w-[120px]" title={storeDetails?.storeName}>
                                    {storeDetails?.storeName || 'BD FASHION HOUSE'}
                                </span>
                                <CheckCircle2 size={14} className="text-[#0099cc] fill-white" /> 
                           </div>
                       </div>
                    </div>
                    
                    <button className="text-[#0099cc] px-2 py-1 text-xs uppercase font-medium flex items-center gap-1 hover:bg-blue-50 rounded transition-colors">
                        CHAT
                    </button>
                 </div>

                 {/* Ratings Box */}
                 <div className="grid grid-cols-3 divide-x border border-gray-100 bg-white py-2 mb-2">
                    <div className="text-center px-1">
                        <span className="block text-gray-400 text-[10px] mb-1">Ship on Time</span>
                        <span className="block text-gray-700 font-bold text-lg leading-none">98%</span>
                    </div>
                    <div className="text-center px-1">
                        <span className="block text-gray-400 text-[10px] mb-1">Chat Response</span>
                        <span className="block text-gray-700 font-bold text-lg leading-none">90%</span>
                    </div>
                    <div className="text-center px-1">
                        <span className="block text-gray-400 text-[10px] mb-1">Rating</span>
                        <span className="block text-gray-700 font-bold text-lg leading-none">89%</span>
                    </div>
                 </div>

                 <div className="text-center mt-4 border-t pt-2 border-gray-50">
                    <Link href={`/store/${storeDetails?._id}`}>
                        <span className="text-[#0099cc] text-xs font-bold uppercase cursor-pointer hover:underline">
                            Visit Store
                        </span>
                    </Link>
                 </div>
             </div>
          </div>
        </motion.div>
      </div>

      {/* ================= TABS SECTION (WITH ANIMATION) ================= */}
      <div className="container mx-auto px-4 mt-8">
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden"
        >
           <Tabs defaultValue="specification" className="w-full">
                {/* Tab Header */}
                <div className="bg-[#f2f4f8] border-b px-4">
                    <TabsList className="flex justify-start h-auto bg-transparent p-0 w-full overflow-x-auto">
                        {['specification', 'description', 'reviews', 'qna'].map((tab) => (
                             <TabsTrigger 
                                key={tab}
                                value={tab} 
                                className="px-6 py-3 rounded-none font-bold text-gray-600 border-b-2 border-transparent data-[state=active]:bg-[#00005e] data-[state=active]:text-white data-[state=active]:border-[#00005e] transition-all capitalize"
                            >
                                {tab === 'reviews' ? `Reviews (${reviews.length})` : tab === 'qna' ? 'Q&A' : tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="p-6 min-h-[300px]">
                    
                    {/* Specification Tab */}
                    <TabsContent value="specification">
                        <motion.div variants={tabContentVariants} initial="hidden" animate="visible">
                            <h3 className="text-xl font-bold text-[#00005e] mb-6">Technical Specifications</h3>
                            <div 
                              className="w-full overflow-x-auto [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_table]:border [&_table]:border-gray-200 [&_tr]:border-b [&_tr]:border-gray-200 [&_tr:last-child]:border-0 [&_td]:p-4 [&_td]:align-middle [&_td]:border-r [&_td]:border-gray-200 [&_td:last-child]:border-r-0 [&_td:first-child]:bg-[#f9fafb] [&_td:first-child]:font-semibold [&_td:first-child]:text-[#00005e] [&_td:first-child]:w-[30%] [&_td:first-child]:min-w-[180px] [&_td:last-child]:bg-white [&_td:last-child]:text-gray-700 [&_p]:flex [&_p]:items-start [&_p]:gap-2 [&_p]:py-2 [&_p]:border-b [&_p]:border-gray-100 [&_strong]:min-w-[150px] [&_strong]:text-[#00005e] [&_strong]:font-bold"
                              dangerouslySetInnerHTML={{ __html: product.specification || '<p class="text-gray-500">No specifications provided.</p>' }} 
                            />
                        </motion.div>
                    </TabsContent>

                    {/* Description Tab */}
                    <TabsContent value="description">
                        <motion.div variants={tabContentVariants} initial="hidden" animate="visible">
                            <h3 className="text-xl font-bold text-[#00005e] mb-4">Description</h3>
                            <div 
                              className="prose max-w-none text-gray-700 text-sm leading-relaxed [&_h1]:text-[#00005e] [&_h2]:text-[#00005e] [&_ul]:list-disc [&_ul]:ml-5"
                              dangerouslySetInnerHTML={{ __html: product.fullDescription }} 
                            />
                        </motion.div>
                    </TabsContent>

                    {/* Reviews Tab */}
                    <TabsContent value="reviews">
                        <motion.div variants={tabContentVariants} initial="hidden" animate="visible">
                            <h3 className="text-xl font-bold text-[#00005e] mb-6">Customer Reviews</h3>
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                                {/* Left: Summary & Form */}
                                <div className="lg:col-span-4 space-y-6">
                                    <div className="bg-[#f8f9fc] p-6 rounded border text-center">
                                        <div className="text-5xl font-bold text-[#00005e] mb-2">{averageRating}</div>
                                        <div className="flex justify-center text-orange-400 mb-2 text-lg">
                                            {[1,2,3,4,5].map((s) => (
                                                <Star key={s} fill={s <= Math.round(Number(averageRating)) ? "currentColor" : "none"} className={s > Math.round(Number(averageRating)) ? "text-gray-300" : ""} />
                                            ))}
                                        </div>
                                        <p className="text-gray-500 text-sm">{reviews.length} Verified Reviews</p>
                                    </div>

                                    {/* Review Form */}
                                    <div className="bg-white border p-5 rounded">
                                        <h4 className="font-bold text-gray-800 mb-3 text-sm">Write a Review</h4>
                                        {!session?.user ? (
                                            <div className="text-center py-4">
                                                <User className="mx-auto mb-2 text-gray-400"/>
                                                <p className="text-xs text-gray-500 mb-3">Please login to write a review</p>
                                                <Button size="sm" variant="outline" onClick={() => router.push('/auth/login')}>Login</Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <motion.div key={star} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}>
                                                            <Star 
                                                                size={24} 
                                                                onClick={() => setNewReviewRating(star)}
                                                                className={`cursor-pointer transition ${star <= newReviewRating ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`} 
                                                            />
                                                        </motion.div>
                                                    ))}
                                                </div>
                                                <textarea 
                                                    className="w-full p-3 border rounded text-sm focus:outline-none focus:border-[#00005e] bg-gray-50"
                                                    rows={3}
                                                    placeholder="What did you like or dislike?"
                                                    value={newReviewComment}
                                                    onChange={(e) => setNewReviewComment(e.target.value)}
                                                />
                                                <Button 
                                                    onClick={handleSubmitReview} 
                                                    disabled={isSubmittingReview}
                                                    className="w-full bg-[#00005e] hover:bg-[#000040] text-white"
                                                >
                                                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right: Review List */}
                                <div className="lg:col-span-8 space-y-4">
                                    {reviewsLoading ? <p>Loading...</p> : reviews.length === 0 ? (
                                        <p className="text-gray-500 italic">No reviews yet.</p>
                                    ) : (
                                        reviews.map((review) => (
                                            <div key={review._id} className="border-b pb-4 last:border-0">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-[#00005e] font-bold">
                                                            {review.userName.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-800">{review.userName}</p>
                                                            <div className="flex text-orange-400 text-xs mt-0.5">
                                                                {[...Array(5)].map((_, i) => (
                                                                    <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""}/>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <span className="text-xs text-gray-400">{new Date(review.uploadedTime).toLocaleDateString()}</span>
                                                </div>
                                                <p className="text-gray-600 text-sm ml-12 mt-2">{review.comment}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </TabsContent>

                    {/* Q&A Tab */}
                    <TabsContent value="qna">
                          <motion.div variants={tabContentVariants} initial="hidden" animate="visible">
                             <ProductQASection productId={product._id} initialQA={product.qna || []} />
                          </motion.div>
                    </TabsContent>
                </div>
           </Tabs>
        </motion.div>
      </div>

    </motion.div>
  );
}