'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronRight, 
  Star, 
  CheckCircle, 
  Heart, 
  Share2,
  Minus,
  Plus,
  ShieldCheck,
  User
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react'; 
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { ProductQASection } from './ProductQASection';

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
  | (T & { _id?: string; id?: string })
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
    return relatedData.categories.find(c => c._id === catId)?.name || 'Category';
  };

  const getStoreDetails = () => {
    const storeId = getEntityId(product.vendorStoreId);
    return relatedData.stores.find((store) => store._id === storeId);
  };

  const storeDetails = getStoreDetails();

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


  // ================= RENDER START =================
  return (
    <div className="min-h-screen bg-[#f2f4f8] font-sans text-gray-800 pb-12">
      
      {/* --- Breadcrumb --- */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3 text-xs sm:text-sm text-gray-500 flex items-center gap-2">
          <span className="cursor-pointer hover:text-[#00005e]" onClick={() => router.push('/')}>Home</span> 
          <ChevronRight size={14} />
          <span className="cursor-pointer hover:text-[#00005e]">{getCategoryName()}</span> 
          <ChevronRight size={14} />
          <span className="text-[#00005e] font-semibold truncate max-w-[250px]">{product.productTitle}</span>
        </div>
      </div>

      {/* --- Main Product Section --- */}
      <div className="container mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 rounded shadow-sm border border-gray-200">
          
          {/* Left: Image Gallery */}
          <div className="lg:col-span-4">
            <div className="border border-gray-200 rounded mb-4 bg-white flex items-center justify-center h-[400px] relative p-4">
              <Image 
                src={selectedImage} 
                alt={product.productTitle} 
                fill
                className="object-contain"
                priority
              />
              {discountPercent > 0 && (
                <span className="absolute top-3 right-3 bg-[#00005e] text-white text-xs font-bold px-2 py-1 rounded">
                  {discountPercent}% OFF
                </span>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
                {(product.photoGallery || [product.thumbnailImage]).map((img, idx) => (
                   <div 
                     key={idx} 
                     onClick={() => setSelectedImage(img)}
                     className={`w-16 h-16 border rounded cursor-pointer flex-shrink-0 relative bg-white transition-all ${selectedImage === img ? 'border-[#00005e] ring-1 ring-[#00005e]' : 'hover:border-gray-400'}`}
                   >
                      <Image src={img} alt={`thumb-${idx}`} fill className="object-contain p-1"/>
                   </div>
                ))}
            </div>
          </div>

          {/* Middle: Product Info */}
          <div className="lg:col-span-5 space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-[#00005e] mb-2 leading-tight">
                {product.productTitle}
              </h1>
              
              {/* Specs Pills */}
              <div className="flex flex-wrap gap-2 mb-3 text-xs">
                 <span className="bg-[#f2f4f8] px-3 py-1 rounded-full text-gray-600 border">
                   Price: <span className="font-bold text-[#00005e]">{formatPrice(product.discountPrice || product.productPrice)}</span>
                 </span>
                 <span className="bg-[#f2f4f8] px-3 py-1 rounded-full text-gray-600 border">
                   Code: <span className="font-bold text-gray-800">{product._id.slice(-6)}</span>
                 </span>
                 <span className="bg-[#f2f4f8] px-3 py-1 rounded-full text-gray-600 border">
                   Status: <span className={`font-bold ${product.stock ? 'text-green-600' : 'text-red-600'}`}>{product.stock ? 'In Stock' : 'Out of Stock'}</span>
                 </span>
              </div>
            </div>

            {/* Price Area */}
            <div className="flex items-end gap-3 pb-4 border-b border-dashed border-gray-300">
                <span className="text-3xl font-bold text-[#00005e]">
                   {formatPrice(product.discountPrice || product.productPrice)}
                </span>
                {product.discountPrice && (
                  <span className="text-gray-400 line-through text-lg mb-1">
                    {formatPrice(product.productPrice)}
                  </span>
                )}
            </div>

            {/* Selection: Color */}
            {colorOptions.length > 0 && (
                <div>
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">Color Family</span>
                    <div className="flex gap-2 flex-wrap">
                        {colorOptions.map((c) => (
                          <button 
                            key={c.id}
                            onClick={() => setSelectedColorId(c.id)}
                            className={`px-4 py-1.5 border rounded text-sm font-medium transition-colors ${selectedColorId === c.id ? 'bg-[#00005e] text-white border-[#00005e]' : 'bg-white hover:border-[#00005e] text-gray-700'}`}
                          >
                             {c.label}
                          </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Selection: Size */}
            {sizeOptions.length > 0 && (
                <div>
                    <span className="text-sm font-semibold text-gray-700 mb-2 block">Size</span>
                    <div className="flex gap-2 flex-wrap">
                        {sizeOptions.map((s) => (
                            <button 
                                key={s.id} 
                                onClick={() => setSelectedSizeId(s.id)}
                                className={`px-4 py-1.5 border rounded text-sm font-medium transition-colors ${selectedSizeId === s.id ? 'bg-[#00005e] text-white border-[#00005e]' : 'bg-white hover:border-[#00005e] text-gray-700'}`}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-2">
               <div className="flex items-center border border-gray-300 rounded h-12 w-32 bg-white">
                 <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center hover:bg-gray-100"><Minus size={16}/></button>
                 <span className="flex-1 text-center font-bold text-lg">{quantity}</span>
                 <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center hover:bg-gray-100"><Plus size={16}/></button>
               </div>

               <Button 
                 onClick={handleBuyNow}
                 disabled={isBuyingNow || !product.stock}
                 className="flex-1 h-12 bg-[#00005e] hover:bg-[#000040] text-white font-bold text-base uppercase tracking-wide shadow-sm"
               >
                  {isBuyingNow ? 'Processing...' : 'Buy Now'}
               </Button>
               
               <Button 
                 onClick={handleAddToCart}
                 disabled={cartLoading || isAddingToCart || !product.stock}
                 variant="outline"
                 className="flex-1 h-12 border-2 border-[#00005e] text-[#00005e] hover:bg-[#f0f4ff] font-bold text-base uppercase tracking-wide"
               >
                  {cartLoading || isAddingToCart ? 'Adding...' : 'Add to Cart'}
               </Button>
            </div>
            
            <div className="flex gap-6 text-sm text-gray-500 pt-2">
                 <button onClick={() => addToWishlist(product._id)} disabled={isWishlistLoading} className="flex items-center gap-2 hover:text-[#00005e] transition">
                    <Heart size={18}/> Add to Wishlist
                 </button>
                 <button onClick={handleShare} className="flex items-center gap-2 hover:text-[#00005e] transition">
                    <Share2 size={18}/> Share
                 </button>
            </div>
          </div>

          {/* Right: Sidebar Info */}
          <div className="lg:col-span-3 space-y-4">
             {/* Service Info */}
             <div className="bg-white p-4 rounded border border-gray-200">
                <div className="flex items-center gap-2 mb-3 border-b pb-2">
                    <ShieldCheck className="text-[#00005e]" size={20}/>
                    <span className="font-bold text-gray-700 text-sm">Service & Warranty</span>
                </div>
                <ul className="text-sm space-y-3 text-gray-600">
                    <li className="flex gap-2 items-start">
                        <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0"/> 
                        <span>100% Authentic Product</span>
                    </li>
                    <li className="flex gap-2 items-start">
                        <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0"/> 
                        <span>{product.warrantyPolicy ? 'Warranty Available' : 'No Warranty'}</span>
                    </li>
                    <li className="flex gap-2 items-start">
                        <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0"/> 
                        <span>7 Days Happy Return</span>
                    </li>
                </ul>
             </div>

             {/* Seller Info */}
             <div className="bg-[#f8f9fc] p-4 rounded border border-gray-200">
                 <div className="flex items-center gap-3 mb-3">
                    {storeDetails?.storeLogo ? (
                        <Image src={storeDetails.storeLogo} width={40} height={40} alt="Store" className="rounded-full border"/>
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-white border flex items-center justify-center text-[#00005e] font-bold">
                           {storeDetails?.storeName?.charAt(0) || 'S'}
                        </div>
                    )}
                    <div className="overflow-hidden">
                        <span className="text-xs text-gray-500 block">Sold By</span>
                        <span className="font-bold text-[#00005e] truncate block">{storeDetails?.storeName || 'Guptodhan'}</span>
                    </div>
                 </div>
                 <Button variant="outline" className="w-full border-[#00005e] text-[#00005e] hover:bg-[#00005e] hover:text-white text-xs font-bold h-9 uppercase">
                     Visit Store
                 </Button>
             </div>
          </div>
        </div>
      </div>

      {/* ================= TABS SECTION (Specification as Professional Table) ================= */}
      <div className="container mx-auto px-4 mt-8">
        <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
           <Tabs defaultValue="specification" className="w-full">
                {/* Tab Header */}
                <div className="bg-[#f2f4f8] border-b px-4">
                    <TabsList className="flex justify-start h-auto bg-transparent p-0 w-full overflow-x-auto">
                        <TabsTrigger 
                            value="specification" 
                            className="px-6 py-3 rounded-none font-bold text-gray-600 border-b-2 border-transparent data-[state=active]:bg-[#00005e] data-[state=active]:text-white data-[state=active]:border-[#00005e] transition-all"
                        >
                            Specification
                        </TabsTrigger>
                        <TabsTrigger 
                            value="description" 
                            className="px-6 py-3 rounded-none font-bold text-gray-600 border-b-2 border-transparent data-[state=active]:bg-[#00005e] data-[state=active]:text-white data-[state=active]:border-[#00005e] transition-all"
                        >
                            Description
                        </TabsTrigger>
                        <TabsTrigger 
                            value="reviews" 
                            className="px-6 py-3 rounded-none font-bold text-gray-600 border-b-2 border-transparent data-[state=active]:bg-[#00005e] data-[state=active]:text-white data-[state=active]:border-[#00005e] transition-all"
                        >
                            Reviews ({reviews.length})
                        </TabsTrigger>
                        <TabsTrigger 
                            value="qna" 
                            className="px-6 py-3 rounded-none font-bold text-gray-600 border-b-2 border-transparent data-[state=active]:bg-[#00005e] data-[state=active]:text-white data-[state=active]:border-[#00005e] transition-all"
                        >
                            Q&A
                        </TabsTrigger>
                    </TabsList>
                </div>

                <div className="p-6 min-h-[300px]">
                    
                    {/* Specification Tab (Professional Table Design) */}
                    <TabsContent value="specification">
                        <h3 className="text-xl font-bold text-[#00005e] mb-6">Technical Specifications</h3>
                        <div 
                          className="
                            w-full overflow-x-auto
                            
                            /* --- Table General Style --- */
                            [&_table]:w-full 
                            [&_table]:border-collapse 
                            [&_table]:text-sm 
                            [&_table]:border 
                            [&_table]:border-gray-200
                            
                            /* --- Table Rows --- */
                            [&_tr]:border-b 
                            [&_tr]:border-gray-200 
                            [&_tr:last-child]:border-0
                            
                            /* --- Table Cells (TD) --- */
                            [&_td]:p-4 
                            [&_td]:align-middle 
                            [&_td]:border-r 
                            [&_td]:border-gray-200 
                            [&_td:last-child]:border-r-0
                            
                            /* --- Key Column (First TD) Style --- */
                            [&_td:first-child]:bg-[#f9fafb] 
                            [&_td:first-child]:font-semibold 
                            [&_td:first-child]:text-[#00005e] 
                            [&_td:first-child]:w-[30%] 
                            [&_td:first-child]:min-w-[180px]
                            
                            /* --- Value Column (Last TD) Style --- */
                            [&_td:last-child]:bg-white 
                            [&_td:last-child]:text-gray-700
                            
                            /* --- Fallback for Paragraphs (If content is not a table) --- */
                            [&_p]:flex [&_p]:items-start [&_p]:gap-2 [&_p]:py-2 [&_p]:border-b [&_p]:border-gray-100
                            [&_strong]:min-w-[150px] [&_strong]:text-[#00005e] [&_strong]:font-bold
                          "
                          dangerouslySetInnerHTML={{ __html: product.specification || '<p class="text-gray-500">No specifications provided.</p>' }} 
                        />
                    </TabsContent>

                    {/* Description Tab */}
                    <TabsContent value="description">
                        <h3 className="text-xl font-bold text-[#00005e] mb-4">Description</h3>
                        <div 
                          className="prose max-w-none text-gray-700 text-sm leading-relaxed [&_h1]:text-[#00005e] [&_h2]:text-[#00005e] [&_ul]:list-disc [&_ul]:ml-5"
                          dangerouslySetInnerHTML={{ __html: product.fullDescription }} 
                        />
                    </TabsContent>

                    {/* Reviews Tab */}
                    <TabsContent value="reviews">
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
                                                    <Star 
                                                        key={star} 
                                                        size={24} 
                                                        onClick={() => setNewReviewRating(star)}
                                                        className={`cursor-pointer transition ${star <= newReviewRating ? 'text-orange-400 fill-orange-400' : 'text-gray-300'}`} 
                                                    />
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
                    </TabsContent>

                    {/* Q&A Tab */}
                    <TabsContent value="qna">
                          <ProductQASection productId={product._id} initialQA={product.qna || []} />
                    </TabsContent>
                </div>
           </Tabs>
        </div>
      </div>

    </div>
  );
}