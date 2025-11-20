'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  BadgeCheck, // Blue Badge
  Banknote,
  User,
  Home,
  UploadCloud, // Upload Icon
  X
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

// --- Interfaces ---
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
  reviewImages?: string[]; 
}

interface QA {
    _id: string;
    question: string;
    answer?: {
        answerText: string;
        answeredByName: string;
        answeredByEmail: string;
    };
    status: string;
    createdAt: string;
}

type EntityRef<T extends object = Record<string, unknown>> =
  | string
  | (T & { _id?: string; id?: string; name?: string; storeName?: string; storeLogo?: string })
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
    brand?: EntityRef<{ name?: string }>;
    createdAt: string;
    productOptions?: Array<{
      productImage?: string;
      color?: string;
      size?: string;
     }>;
    reviews?: Review[];
    qna?: QA[];
  };
  relatedData: {
    categories: Array<{ _id: string; name: string }>;
    stores: Array<{
      _id: string;
      storeName: string;
      storeLogo?: string;
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

// --- Animations ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

const imageFade = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, transition: { duration: 0.2 } }
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
  
  // Location State
  const [locationType, setLocationType] = useState<'dhaka' | 'outside'>('dhaka');
  
  // Reviews State
  const [reviews, setReviews] = useState<Review[]>(product.reviews || []);
  const [isReviewsLoading, setIsReviewsLoading] = useState(false);
  
  // Review Form State
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewFiles, setReviewFiles] = useState<File[]>([]); // Image Files
  const [previewUrls, setPreviewUrls] = useState<string[]>([]); // Preview URLs
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Helpers ---
  const getEntityId = (value: EntityRef): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') return value._id || value.id || '';
    return '';
  };

  const getCategoryName = () => {
    if (typeof product.category === 'object' && product.category !== null) {
        return product.category.name || 'Category';
    }
    return 'Category';
  };

  const getBrandName = () => {
    if (typeof product.brand === 'object' && product.brand !== null) {
        return product.brand.name || 'No Brand';
    }
    return 'No Brand';
  };

  const getStoreDetails = () => {
    if (typeof product.vendorStoreId === 'object' && product.vendorStoreId !== null) {
        return {
            _id: product.vendorStoreId._id,
            storeName: product.vendorStoreId.storeName,
            storeLogo: product.vendorStoreId.storeLogo
        };
    }
    return null;
  };
  const storeDetails = getStoreDetails();

  // --- Logic ---
  const deliveryCharge = locationType === 'dhaka' ? 70 : 130;
  const deliveryTime = locationType === 'dhaka' ? '1 - 4 day(s)' : '4 - 7 day(s)';
  const locationText = locationType === 'dhaka' 
        ? 'Dhaka, Dhaka North, Banani Road No. 12 - 19' 
        : 'Outside Dhaka, Sadar, Chattogram';

  const toggleLocation = () => {
      setLocationType(prev => prev === 'dhaka' ? 'outside' : 'dhaka');
      toast.success(`Location changed to ${locationType === 'dhaka' ? 'Outside Dhaka' : 'Inside Dhaka'}`);
  };

  // --- Image Handlers ---
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
        const files = Array.from(e.target.files);
        if (reviewFiles.length + files.length > 3) {
            toast.error('You can upload maximum 3 images');
            return;
        }
        setReviewFiles((prev) => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls((prev) => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    const newFiles = reviewFiles.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    URL.revokeObjectURL(previewUrls[index]);
    setReviewFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  // --- Submit Review (ERROR FIXED HERE) ---
  const handleSubmitReview = async () => {
    if (!session?.user) {
        toast.error('Please login to submit a review');
        return;
    }
    if (newReviewRating === 0) {
        toast.error('Please select a rating');
        return;
    }

    setIsSubmittingReview(true);

    // Creating FormData
    const formData = new FormData();
    
    // Appending text fields
    formData.append('reviewId', `REV-${Date.now()}`);
    formData.append('productId', product._id);
    formData.append('userId', (session.user as any).id || (session.user as any)._id);
    formData.append('userName', session.user.name || 'Anonymous');
    formData.append('userEmail', session.user.email || '');
    formData.append('rating', newReviewRating.toString());
    formData.append('comment', newReviewComment);
    formData.append('userImage', session.user.image || 'https://placehold.co/100x100?text=User');

    // Appending images
    // NOTE: The field name 'reviewImages' must match what your backend expects
    reviewFiles.forEach((file) => {
        formData.append('reviewImages', file);
    });

    try {
        // IMPORTANT: Do NOT set 'Content-Type': 'application/json' manually for FormData
        // The browser will automatically set 'multipart/form-data' with the correct boundary
        const response = await fetch('/api/v1/product-review', {
            method: 'POST',
            body: formData, 
        });

        // Handle response
        // If the backend crashes, response.json() causes "No number after minus sign..." or "Unexpected token..."
        const result = await response.json();

        if (result.success) {
            toast.success('Review submitted successfully!');
            // Reset Form
            setNewReviewRating(0);
            setNewReviewComment('');
            setReviewFiles([]);
            setPreviewUrls([]);
            if (fileInputRef.current) fileInputRef.current.value = ''; // Reset input
            fetchReviews(); // Refresh reviews
        } else {
            toast.error(result.message || 'Failed to submit review');
            console.error('Server Error:', result);
        }
    } catch (error) {
        console.error('Submit Error:', error);
        // This usually catches the JSON parse error if the server returns raw text/html instead of JSON
        toast.error('Something went wrong! Check console for details.');
    } finally {
        setIsSubmittingReview(false);
    }
  };

  const fetchReviews = useCallback(async () => {
    setIsReviewsLoading(true);
    try {
      const response = await fetch(`/api/v1/product-review/product-review-product/${product._id}`);
      const data = await response.json();
      if (data.success) setReviews(data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setIsReviewsLoading(false);
    }
  }, [product._id]);

  // --- Other Actions ---
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.productTitle,
          text: product.shortDescription,
          url: window.location.href,
        });
      } catch (error) { console.log(error); }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied!');
    }
  };

  const handleBuyNow = async () => {
    setIsBuyingNow(true);
    try {
      await addToCart(product._id, quantity, { skipModal: true, silent: true });
      router.push('/home/product/shoppinginfo');
    } catch (error) { toast.error('Failed to proceed'); } 
    finally { setIsBuyingNow(false); }
  };

  const handleAddToCart = async () => {
    await addToCart(product._id, quantity);
  };

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const discountPercent = product.discountPrice 
    ? Math.round(((product.productPrice - product.discountPrice) / product.productPrice) * 100) 
    : 0;

  const formatPrice = (price: number) => new Intl.NumberFormat('en-BD', { style: 'currency', currency: 'BDT', minimumFractionDigits: 0 }).format(price);


  // ================= RENDER UI =================
  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#f2f4f8] font-sans text-gray-800 pb-12"
    >
      {/* --- Breadcrumb --- */}
      <div className="bg-white shadow-sm sticky top-0 z-20 border-b border-gray-100">
        <div className="container mx-auto px-4 py-3">
            <div className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-gray-500">
                <Link href="/" className="hover:text-[#0099cc] flex items-center gap-1 transition-colors">
                    <Home size={14} /> Home
                </Link>
                <ChevronRight size={14} className="text-gray-300" />
                <Link href={`/category/${getEntityId(product.category)}`} className="hover:text-[#0099cc] transition-colors">
                    {getCategoryName()}
                </Link>
                <ChevronRight size={14} className="text-gray-300" />
                <span className="text-[#0099cc] font-medium truncate max-w-[200px]">
                    {product.productTitle}
                </span>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* === LEFT: Product Main (9 Cols) === */}
          <div className="lg:col-span-9 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                
                {/* Image Gallery */}
                <div className="p-4 border-b md:border-b-0 md:border-r border-gray-100">
                   <div className="relative h-[400px] w-full bg-white rounded-md flex items-center justify-center overflow-hidden mb-4 group">
                      <AnimatePresence mode='wait'>
                        <motion.div
                           key={selectedImage}
                           variants={imageFade}
                           initial="initial"
                           animate="animate"
                           exit="exit"
                           className="relative w-full h-full"
                        >
                           <Image 
                             src={selectedImage} 
                             alt={product.productTitle} 
                             fill 
                             className="object-contain hover:scale-110 transition-transform duration-500 cursor-zoom-in"
                           />
                        </motion.div>
                      </AnimatePresence>
                   </div>
                   
                   <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-200">
                       {(product.photoGallery || [product.thumbnailImage]).map((img, idx) => (
                           <motion.div 
                             key={idx}
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                             onClick={() => setSelectedImage(img)}
                             className={`relative w-16 h-16 border-2 rounded-md cursor-pointer overflow-hidden flex-shrink-0 ${selectedImage === img ? 'border-[#0099cc]' : 'border-gray-200'}`}
                           >
                               <Image src={img} alt="thumb" fill className="object-cover" />
                           </motion.div>
                       ))}
                   </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                   <h1 className="text-2xl font-medium text-gray-800 mb-2 leading-snug">{product.productTitle}</h1>
                   
                   <div className="flex items-center gap-3 text-sm mb-4 text-gray-500">
                       <div className="flex items-center gap-1 bg-orange-50 px-2 py-1 rounded-full border border-orange-100">
                           <div className="flex text-orange-400">
                               {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= Math.round(Number(averageRating)) ? "currentColor" : "none"} />)}
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
                       Brand: <span className="text-[#0099cc] font-medium cursor-pointer">{getBrandName()}</span>
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
                           <Button onClick={handleBuyNow} disabled={isBuyingNow || !product.stock} className="w-full h-12 bg-[#0099cc] hover:bg-[#0088bb] text-white text-lg shadow-md hover:shadow-lg transition-all">
                             {isBuyingNow ? 'Processing...' : 'Buy Now'}
                           </Button>
                       </motion.div>
                       <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                           <Button onClick={handleAddToCart} disabled={cartLoading || isAddingToCart || !product.stock} className="w-full h-12 bg-[#0e1133] hover:bg-[#1a1e4d] text-white text-lg shadow-md hover:shadow-lg transition-all">
                             {cartLoading || isAddingToCart ? 'Adding...' : 'Add to Cart'}
                           </Button>
                       </motion.div>
                   </div>

                   <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100">
                        <button onClick={() => addToWishlist(product._id)} className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors text-sm group">
                            <div className="p-2 bg-gray-100 rounded-full group-hover:bg-red-50 transition-colors">
                                <Heart size={18} className="group-hover:fill-red-500" />
                            </div>
                            Add to Wishlist
                        </button>
                        <button onClick={handleShare} className="flex items-center gap-2 text-gray-500 hover:text-[#0099cc] transition-colors text-sm group">
                            <div className="p-2 bg-gray-100 rounded-full group-hover:bg-blue-50 transition-colors">
                                <Share2 size={18} />
                            </div>
                            Share Product
                        </button>
                   </div>
                </div>
             </div>
          </div>

          {/* === RIGHT: Sidebar (3 Cols) === */}
          <div className="lg:col-span-3 space-y-4">
             
             {/* Delivery Info */}
             <motion.div variants={fadeInUp} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                 <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Delivery Options</h3>
                 <div className="flex items-start gap-3 mb-4">
                    <MapPin className="text-[#0099cc] shrink-0 mt-0.5" size={20} />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                             <span className="text-sm text-gray-700 leading-tight">{locationText}</span>
                             <button onClick={toggleLocation} className="text-[#0099cc] text-xs font-bold hover:underline ml-2">CHANGE</button>
                        </div>
                    </div>
                 </div>
                 <div className="border-t border-gray-100 my-3"></div>
                 <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-2 text-sm text-gray-700">
                         <Store size={18} className="text-gray-400" /> Standard Delivery
                     </div>
                     <span className="font-bold text-sm">Tk {deliveryCharge}</span>
                 </div>
                 <p className="text-xs text-gray-400 ml-7 mb-3">{deliveryTime}</p>
                 <div className="flex items-center gap-2 text-sm text-gray-700 ml-1">
                     <div className="p-0.5 border rounded-sm border-gray-300"><Banknote size={14} className="text-gray-500"/></div>
                     Cash on Delivery Available
                 </div>
             </motion.div>

             {/* Service Info */}
             <motion.div variants={fadeInUp} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                 <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Services</h3>
                 <div className="flex items-start gap-3">
                    <Info className="text-[#0099cc] shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="text-sm font-medium text-gray-800">7 Days Returns</p>
                        <p className="text-xs text-gray-400 mb-2">Change of mind not applicable</p>
                        <p className="text-sm font-medium text-gray-800">Warranty</p>
                        <p className="text-xs text-gray-500">{product.warrantyPolicy ? 'See Description' : 'Not Available'}</p>
                    </div>
                 </div>
             </motion.div>

             {/* Sold By (With Blue Badge) */}
             <motion.div variants={fadeInUp} className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                 <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Sold By</h3>
                 
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-center overflow-hidden relative">
                        {storeDetails?.storeLogo ? (
                            <Image src={storeDetails.storeLogo} alt="Store" fill className="object-cover"/>
                        ) : (
                            <Store className="text-gray-300" />
                        )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex items-center gap-1">
                             <h4 className="font-bold text-gray-800 truncate" title={storeDetails?.storeName}>
                                 {storeDetails?.storeName || 'Unknown Store'}
                             </h4>
                             <BadgeCheck size={16} className="text-[#0099cc] fill-blue-50" />
                        </div>
                        <p className="text-xs text-gray-500">Verified Seller</p>
                    </div>
                 </div>

                 <div className="flex justify-between border-t border-gray-100 pt-3 text-center">
                     <div className="w-1/3 border-r border-gray-100">
                         <p className="text-[10px] text-gray-400">Rating</p>
                         <p className="text-lg font-bold text-gray-700">92%</p>
                     </div>
                     <div className="w-1/3 border-r border-gray-100">
                         <p className="text-[10px] text-gray-400">Ship Time</p>
                         <p className="text-lg font-bold text-gray-700">98%</p>
                     </div>
                     <div className="w-1/3">
                         <p className="text-[10px] text-gray-400">Response</p>
                         <p className="text-lg font-bold text-gray-700">95%</p>
                     </div>
                 </div>

                 <div className="mt-4">
                    {storeDetails?._id ? (
                        <Link href={`/store/${storeDetails._id}`} className="block w-full">
                            <Button variant="outline" className="w-full border-[#0099cc] text-[#0099cc] hover:bg-blue-50 text-xs uppercase font-bold">
                                Visit Store
                            </Button>
                        </Link>
                    ) : (
                        <Button disabled variant="outline" className="w-full text-xs uppercase">Visit Store</Button>
                    )}
                 </div>
             </motion.div>

          </div>
        </div>
      </div>

      {/* ================= TABS SECTION ================= */}
      <div className="container mx-auto px-4 mt-8">
         <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
            <Tabs defaultValue="specification" className="w-full">
                <div className="bg-[#f9fafb] border-b border-gray-200 px-6">
                    <TabsList className="flex h-auto bg-transparent p-0 gap-8">
                        {['specification', 'description', 'reviews', 'qna'].map((tab) => (
                             <TabsTrigger 
                                key={tab}
                                value={tab} 
                                className="px-0 py-4 rounded-none font-medium text-gray-500 border-b-2 border-transparent data-[state=active]:text-[#0099cc] data-[state=active]:border-[#0099cc] data-[state=active]:bg-transparent transition-all capitalize text-base"
                            >
                                {tab === 'reviews' ? `Reviews (${reviews.length})` : tab === 'qna' ? 'Questions' : tab}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>

                <div className="p-6 md:p-8 min-h-[300px]">
                    
                    {/* Specification */}
                    <TabsContent value="specification">
                        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                            <h3 className="text-lg font-bold text-gray-800 mb-6">Product Specification</h3>
                            <div 
                              className="w-full [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm [&_td]:p-3 [&_td]:border-b [&_td]:border-gray-100 [&_td:first-child]:text-gray-500 [&_td:first-child]:w-1/3 [&_td:last-child]:text-gray-800 [&_li]:mb-2"
                              dangerouslySetInnerHTML={{ __html: product.specification || '<p class="text-gray-400">No Data.</p>' }} 
                            />
                        </motion.div>
                    </TabsContent>

                    {/* Description */}
                    <TabsContent value="description">
                        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Product Description</h3>
                            <div 
                              className="prose max-w-none text-gray-600 text-sm leading-relaxed"
                              dangerouslySetInnerHTML={{ __html: product.fullDescription }} 
                            />
                        </motion.div>
                    </TabsContent>

                    {/* Reviews with Images */}
                    <TabsContent value="reviews">
                        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                {/* Review Input */}
                                <div className="lg:col-span-4 space-y-6">
                                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm text-center">
                                        <div className="text-6xl font-bold text-gray-800 mb-2">{averageRating}</div>
                                        <div className="flex justify-center gap-1 text-orange-400 mb-2">
                                            {[1,2,3,4,5].map(s => <Star key={s} fill={s <= Math.round(Number(averageRating)) ? "currentColor" : "none"} />)}
                                        </div>
                                        <p className="text-sm text-gray-400">{reviews.length} Verified Reviews</p>
                                    </div>

                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                        <h4 className="font-bold text-gray-800 mb-4">Write a Review</h4>
                                        {!session?.user ? (
                                            <div className="text-center py-6">
                                                <p className="text-sm text-gray-500 mb-4">Please sign in to write a review</p>
                                                <Button onClick={() => router.push('/auth/login')} variant="outline" className="w-full">Sign In</Button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex gap-2 justify-center mb-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <motion.button 
                                                            key={star} whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
                                                            onClick={() => setNewReviewRating(star)}
                                                            className="focus:outline-none"
                                                        >
                                                            <Star size={28} fill={star <= newReviewRating ? "#facc15" : "none"} className={star <= newReviewRating ? "text-yellow-400" : "text-gray-300"} />
                                                        </motion.button>
                                                    ))}
                                                </div>
                                                
                                                <textarea 
                                                    className="w-full p-4 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0099cc] focus:border-transparent outline-none resize-none bg-white"
                                                    rows={3}
                                                    placeholder="Write your experience..."
                                                    value={newReviewComment}
                                                    onChange={(e) => setNewReviewComment(e.target.value)}
                                                />

                                                {/* Image Upload Box */}
                                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors text-center">
                                                    <input 
                                                        type="file" id="review-img-upload" multiple accept="image/*" className="hidden"
                                                        onChange={handleImageSelect} ref={fileInputRef}
                                                    />
                                                    <label htmlFor="review-img-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                                        <UploadCloud size={24} className="text-gray-400" />
                                                        <span className="text-xs font-medium text-[#0099cc]">Click to upload photos</span>
                                                        <span className="text-[10px] text-gray-400">Max 3 images</span>
                                                    </label>
                                                </div>

                                                {/* Previews */}
                                                {previewUrls.length > 0 && (
                                                    <div className="flex gap-2 mt-2">
                                                        {previewUrls.map((url, idx) => (
                                                            <div key={idx} className="relative w-16 h-16 rounded-md overflow-hidden border border-gray-200 group">
                                                                <Image src={url} alt="preview" fill className="object-cover" />
                                                                <button onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-black/50 text-white p-0.5 hover:bg-red-500 transition-colors">
                                                                    <X size={12} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}

                                                <Button onClick={handleSubmitReview} disabled={isSubmittingReview} className="w-full bg-[#0e1133] hover:bg-[#2a2d5c] text-white h-10 rounded-lg">
                                                    {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Reviews List */}
                                <div className="lg:col-span-8">
                                    {isReviewsLoading ? <div className="text-center py-10">Loading...</div> : reviews.length === 0 ? (
                                        <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                            No reviews yet. Be the first to review!
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            {reviews.map((review) => (
                                                <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                                                                {review.userImage?.includes('http') ? (
                                                                    <Image src={review.userImage} alt={review.userName} fill className="object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">{review.userName.charAt(0)}</div>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h5 className="font-bold text-gray-800 text-sm">{review.userName}</h5>
                                                                <div className="flex text-orange-400 text-xs mt-0.5">
                                                                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill={i < review.rating ? "currentColor" : "none"} className={i >= review.rating ? "text-gray-300" : ""} />)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span className="text-xs text-gray-400">{new Date(review.uploadedTime).toLocaleDateString()}</span>
                                                    </div>
                                                    
                                                    <p className="text-gray-600 text-sm pl-[52px]">{review.comment}</p>

                                                    {/* Display Review Images */}
                                                    {review.reviewImages && review.reviewImages.length > 0 && (
                                                        <div className="flex gap-2 mt-3 pl-[52px]">
                                                            {review.reviewImages.map((img, i) => (
                                                                <div key={i} className="relative w-20 h-20 rounded border border-gray-100 overflow-hidden cursor-zoom-in hover:opacity-90 transition-opacity">
                                                                    <Image src={img} alt="Review Image" fill className="object-cover" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </TabsContent>

                    {/* QnA */}
                    <TabsContent value="qna">
                        <ProductQASection productId={product._id} initialQA={product.qna || []} />
                    </TabsContent>
                </div>
            </Tabs>
         </div>
      </div>
    </motion.div>
  );
}