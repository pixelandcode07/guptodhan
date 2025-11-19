'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Package, Store, Tag, DollarSign, ShoppingCart, CreditCard, Heart, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { ProductQASection } from './ProductQASection';

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
    productId: string;
    productTitle: string;
    shortDescription: string;
    fullDescription: string;
    specification: string;
    warrantyPolicy: string;
    productTag?: string[];
    videoUrl?: string;
    photoGallery: string[];
    thumbnailImage: string;
    productPrice: number;
    discountPrice?: number;
    stock?: number;
    sku?: string;
    rewardPoints?: number;
    status: 'active' | 'inactive';
    vendorStoreId?: EntityRef<{ storeName?: string }>;
    category?: EntityRef<{ name?: string }>;
    subCategory?: EntityRef<{ name?: string }>;
    childCategory?: EntityRef<{ name?: string }>;
    brand?: EntityRef<{ name?: string; brandName?: string }>;
    productModel?: EntityRef<{ name?: string }>;
    flag?: EntityRef<{ name?: string }>;
    warranty?: EntityRef<{ warrantyName?: string }>;
    weightUnit?: EntityRef<{ name?: string }>;
    createdAt: string;
    updatedAt: string;
    productOptions?: Array<{
      productImage?: string;
      unit?: string;
      simType?: string;
      warranty?: string;
      condition?: string;
      stock?: number;
      price?: number;
      discountPrice?: number;
      color?: string;
      size?: string;
    }>;
    qna?: Array<{
      _id?: string;
      qaId?: string;
      userName?: string;
      userEmail?: string;
      userImage?: string;
      question?: string;
      createdAt?: string;
      answer?: {
        answeredByName?: string;
        answeredByEmail?: string;
        answerText?: string;
        createdAt?: string;
      };
    }>;
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
    brands: Array<{ _id: string; name?: string; brandName?: string }>;
    subCategories: Array<{ _id: string; subCategoryName: string }>;
    childCategories: Array<{ _id: string; childCategoryName: string }>;
    models: Array<{ _id: string; modelName: string; name?: string }>;
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
  const { product, relatedData } = productData;
  const { addToCart, isLoading: cartLoading, isAddingToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(product.thumbnailImage);
 
  const [quantity, setQuantity] = useState(1);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  const colorLabelLookup = useMemo(() => {
    const map = new Map<string, string>();
    (relatedData.variantOptions?.colors ?? []).forEach((color) => {
      if (!color?._id) return;
      const label = color.name || color.colorName;
      if (label) {
        map.set(color._id, label);
      }
    });
    return map;
  }, [relatedData.variantOptions?.colors]);

  const sizeLabelLookup = useMemo(() => {
    const map = new Map<string, string>();
    (relatedData.variantOptions?.sizes ?? []).forEach((size) => {
      if (!size?._id) return;
      const label = size.name || size.sizeName;
      if (label) {
        map.set(size._id, label);
      }
    });
    return map;
  }, [relatedData.variantOptions?.sizes]);

  const colorOptions = useMemo(() => {
    const map = new Map<string, { id: string; label: string; image?: string }>();

    (product.productOptions ?? []).forEach((option) => {
      const optionImage =
        typeof option.productImage === 'string' && option.productImage.trim().length > 0
          ? option.productImage
          : undefined;

      const colors = Array.isArray(option.color)
        ? option.color
        : option.color
        ? [option.color]
        : [];

      colors.forEach((colorValue) => {
        if (typeof colorValue !== 'string') return;
        const id = colorValue.trim();
        if (!id) return;
        const label = colorLabelLookup.get(id) || id;

        if (map.has(id)) {
          const existing = map.get(id)!;
          if (!existing.image && optionImage) {
            existing.image = optionImage;
          }
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
      const sizes = Array.isArray(option.size)
        ? option.size
        : option.size
        ? [option.size]
        : [];

      sizes.forEach((sizeValue) => {
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

  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [selectedSizeId, setSelectedSizeId] = useState<string | null>(null);

  const selectedColorLabel =
    colorOptions.find((option) => option.id === selectedColorId)?.label || null;
  const selectedSizeLabel =
    sizeOptions.find((option) => option.id === selectedSizeId)?.label || null;

  useEffect(() => {
    if (colorOptions.length === 0) {
      setSelectedColorId(null);
      return;
    }
    setSelectedColorId((prev) =>
      prev && colorOptions.some((option) => option.id === prev)
        ? prev
        : colorOptions[0].id
    );
  }, [colorOptions]);

  const handleColorSelection = (colorId: string) => {
    setSelectedColorId(colorId);
  };

  useEffect(() => {
    if (sizeOptions.length === 0) {
      setSelectedSizeId(null);
      return;
    }
    setSelectedSizeId((prev) =>
      prev && sizeOptions.some((option) => option.id === prev)
        ? prev
        : sizeOptions[0].id
    );
  }, [sizeOptions]);
  
  // Review state management
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const getEntityId = (value: EntityRef): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object') {
      if (typeof value._id === 'string') return value._id;
      if (typeof value.id === 'string') return value.id;
    }
    return '';
  };

  // Helper functions to get names by ID using server data
  const getCategoryName = (categoryRef: EntityRef) => {
    const categoryId = getEntityId(categoryRef);
    const category = relatedData.categories.find(cat => cat._id === categoryId);
    return category?.name || 'N/A';
  };

  const getStoreName = (storeRef: EntityRef) => {
    const storeId = getEntityId(storeRef);
    const store = relatedData.stores.find(store => store._id === storeId);
    return store?.storeName || 'N/A';
  };


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Fetch reviews for the product
  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    setReviewsError(null);
    
    try {
      const response = await fetch(`/api/v1/product-review/product-review-product/${product._id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch reviews: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to fetch reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setReviewsError(error instanceof Error ? error.message : 'Failed to fetch reviews');
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, [product._id]);

  // Load reviews when component mounts
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleBack = () => {
    router.back();
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
      // Add product to cart first (skip modal for Buy Now)
      await addToCart(product._id, quantity, { skipModal: true, silent: true });
      // Redirect to checkout page
      router.push('/home/product/shoppinginfo');
    } catch (error) {
      console.error('Error in buy now:', error);
      toast.error('Failed to proceed to checkout');
    } finally {
      setIsBuyingNow(false);
    }
  };

  const { addToWishlist, isLoading: isWishlistLoading } = useWishlist();

  const getStoreDetails = () => {
    const storeId = getEntityId(product.vendorStoreId);
    if (!storeId) return undefined;
    return relatedData.stores.find((store) => store._id === storeId);
  };

  const storeDetails = getStoreDetails();

  const handleWishlist = async () => {
    await addToWishlist(product._id);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.productTitle,
        text: product.shortDescription,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Product link copied to clipboard!');
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={handleBack} className="flex items-center gap-2 w-full sm:w-auto">
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Button>

        {/* Main Product Information */}
        <div className="flex flex-col xl:flex-row gap-4 lg:gap-6">
         {/* Product Images */}
         <Card className="w-full xl:w-96 flex-shrink-0">
           <CardHeader className="pb-3">
             <CardTitle className="flex items-center gap-2 text-lg">
               <Package className="w-4 h-4" />
               Product Images
             </CardTitle>
           </CardHeader>
           <CardContent className="pt-0">
             <div className="space-y-3">
               {/* Main Image */}
               <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                 <Image
                   src={selectedImage}
                   alt={product.productTitle}
                   fill
                   className="object-cover"
                   priority
                 />
               </div>
               
               {/* Thumbnail Gallery */}
               {product.photoGallery && product.photoGallery.length > 1 && (
                 <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                   {product.photoGallery.map((image, index) => (
                     <button
                       key={index}
                       onClick={() => setSelectedImage(image)}
                       className={`aspect-square relative bg-gray-100 rounded-lg overflow-hidden border-2 ${
                         selectedImage === image ? 'border-blue-500' : 'border-transparent'
                       }`}
                     >
                       <Image
                         src={image}
                         alt={`${product.productTitle} ${index + 1}`}
                         fill
                         className="object-cover"
                       />
                     </button>
                   ))}
                 </div>
               )}
             </div>
           </CardContent>
         </Card>

          {/* Product Details */}
          <Card className="flex-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <span className="flex items-center gap-2 text-lg">
                <Package className="w-4 h-4" />
                Product Information
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleWishlist} 
                  disabled={isWishlistLoading}
                  className="flex-1 sm:flex-none"
                >
                  <Heart className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Wishlist</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare} className="flex-1 sm:flex-none">
                  <Share2 className="w-4 h-4 mr-1" />
                  <span className="hidden sm:inline">Share</span>
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {/* Product Title */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{product.productTitle}</h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">{product.shortDescription}</p>
            </div>

            {/* Status Badge */}
            <div>
              <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                {product.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-green-600" />
                  <span className="text-xl sm:text-2xl font-bold text-green-600">
                    {formatPrice(product.productPrice)}
                  </span>
                </div>
                {product.discountPrice && (
                  <span className="text-base sm:text-lg text-gray-500 line-through">
                    {formatPrice(product.discountPrice)}
                  </span>
                )}
              </div>
              {product.discountPrice && (
                <div className="text-sm text-red-600 font-medium">
                  Save {formatPrice(product.productPrice - product.discountPrice)}
                </div>
              )}
            </div>

            {/* Product Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
             
             
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Store:</span>
                <span className="font-medium">
                  {product.vendorStoreId ? getStoreName(product.vendorStoreId) : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">
                  {product.category ? getCategoryName(product.category) : 'N/A'}
                </span>
              </div>

              
             
             
            
            </div>

            {colorOptions.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Available Colors:</span>
                  <span className="font-medium text-gray-900">
                    {selectedColorLabel || 'Select a color'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {colorOptions.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => handleColorSelection(color.id)}
                      className={`flex w-20 flex-col items-center gap-1 rounded-xl border p-1 transition ${
                        selectedColorId === color.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 bg-white hover:border-blue-200'
                      }`}
                    >
                      <div className="h-12 w-full overflow-hidden rounded-lg border border-gray-200">
                        {color.image ? (
                          <Image
                            src={color.image}
                            alt={color.label}
                            width={80}
                            height={80}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs font-medium text-gray-600">
                            {color.label}
                          </div>
                        )}
                      </div>
                      <span className="text-xs font-medium text-gray-700">
                        {color.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {sizeOptions.length > 0 && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Select Size:</span>
                  <span className="font-medium text-gray-900">
                    {selectedSizeLabel || 'Select a size'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => setSelectedSizeId(size.id)}
                      className={`px-3 py-1.5 rounded-lg border text-sm uppercase ${
                        selectedSizeId === size.id
                          ? 'border-blue-600 text-blue-600 bg-blue-50'
                          : 'border-gray-300 text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            )}


            {/* Quantity Selector */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Quantity</h4>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-r-none border-r-0 h-10 w-10"
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center h-10 flex items-center justify-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-l-none border-l-0 h-10 w-10"
                  >
                    +
                  </Button>
                </div>
               
              </div>
            </div>

            {/* E-commerce Actions */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={cartLoading || isAddingToCart || !product.stock || product.status !== 'active'}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 h-12"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {cartLoading || isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={isBuyingNow || !product.stock || product.status !== 'active'}
                  className="flex-1 bg-green-600 hover:bg-green-700 h-12"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isBuyingNow ? 'Processing...' : 'Buy Now'}
                </Button>
              </div>
              
              {(!product.stock || product.status !== 'active') && (
                <div className="text-center">
                  <Badge variant="destructive" className="text-sm">
                    {!product.stock ? 'Out of Stock' : 'Product Inactive'}
                  </Badge>
                </div>
              )}
             </div>
           </CardContent>
         </Card>

          {/* Service Guarantees Sidebar */}
          <Card className="w-full xl:w-80 flex-shrink-0">
           <CardContent className="p-4 sm:p-6">
             <div className="space-y-4">
               {/* Easy Shipping & Returns */}
               <div className="flex items-start space-x-3 pb-4 border-b border-gray-200">
                 <div className="flex-shrink-0">
                   <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="font-semibold text-gray-900 text-sm">Easy Shipping & Returns</h3>
                   <p className="text-xs text-gray-500 mt-1">For all orders</p>
                 </div>
               </div>

               {/* Secure Payment */}
               <div className="flex items-start space-x-3 pb-4 border-b border-gray-200">
                 <div className="flex-shrink-0">
                   <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="font-semibold text-gray-900 text-sm">Secure Payment</h3>
                   <p className="text-xs text-gray-500 mt-1">We ensure secure payment</p>
                 </div>
               </div>

               {/* Money Back Guarantee */}
               <div className="flex items-start space-x-3">
                 <div className="flex-shrink-0">
                   <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                   </svg>
                 </div>
                 <div>
                   <h3 className="font-semibold text-gray-900 text-sm">Money Back Guarantee</h3>
                   <p className="text-xs text-gray-500 mt-1">Any back within 21 days</p>
                 </div>
               </div>
             </div>
           </CardContent>
         </Card>
       </div>

       {/* Product Details Tabs */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 h-auto">
              <TabsTrigger value="description" className="text-xs sm:text-sm py-2">Description</TabsTrigger>
              <TabsTrigger value="specifications" className="text-xs sm:text-sm py-2">Specifications</TabsTrigger>
              <TabsTrigger value="warranty" className="text-xs sm:text-sm py-2">Warranty</TabsTrigger>
              <TabsTrigger value="vendorInformation" className="text-xs sm:text-sm py-2">Vendor Info</TabsTrigger>
              <TabsTrigger value="customersReviews" className="text-xs sm:text-sm py-2">Reviews</TabsTrigger>
              <TabsTrigger value="questions" className="text-xs sm:text-sm py-2">Q&amp;A</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: product.fullDescription }} />
              </div>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: product.specification }} />
              </div>
            </TabsContent>
            
            <TabsContent value="warranty" className="mt-6">
              <div className="prose max-w-none">
                <div dangerouslySetInnerHTML={{ __html: product.warrantyPolicy }} />
              </div>
            </TabsContent>
            
            <TabsContent value="vendorInformation" className="mt-6">
              {storeDetails ? (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Vendor Information</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-3">
                          {storeDetails.storeLogo ? (
                            <Image
                              src={storeDetails.storeLogo}
                              alt={storeDetails.storeName}
                              width={48}
                              height={48}
                              className="rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold">
                              {storeDetails.storeName?.charAt(0)?.toUpperCase() || 'S'}
                            </div>
                          )}
                          <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">Store Name</p>
                            <p className="text-base font-semibold text-gray-900">{storeDetails.storeName}</p>
                          </div>
                        </div>
                        {storeDetails.vendorShortDescription && (
                          <p className="text-sm text-gray-600">{storeDetails.vendorShortDescription}</p>
                        )}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 space-y-3">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Contact</p>
                          <p className="text-sm text-gray-700">
                            {storeDetails.storePhone || 'Phone unavailable'}
                          </p>
                          <p className="text-sm text-blue-600 break-words">
                            {storeDetails.storeEmail || 'Email unavailable'}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                          <p className="text-sm text-gray-700">
                            {storeDetails.storeAddress || 'Address not provided'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="lg:col-span-1">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-gray-900">Store Description</h4>
                          {storeDetails.fullDescription ? (
                            <div className="text-sm text-gray-600 prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: storeDetails.fullDescription }}
                            />
                          ) : (
                            <p className="text-sm text-gray-500">
                              Detailed vendor description is not available.
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
                  Vendor details are not available for this product.
                </div>
              )}
            </TabsContent>
            <TabsContent value="customersReviews" className="mt-4 sm:mt-6">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <h3 className="text-lg font-semibold">Customer Reviews</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchReviews}
                    disabled={reviewsLoading}
                    className="w-full sm:w-auto"
                  >
                    {reviewsLoading ? 'Loading...' : 'Refresh'}
                  </Button>
                </div>
                
                {reviewsError && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-600 text-sm">{reviewsError}</p>
                  </div>
                )}
                
                {reviewsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">Loading reviews...</span>
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.map((review) => (
                      <Card key={review._id}>
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                                {review.userImage ? (
                                  <Image
                                    src={review.userImage}
                                    alt={review.userName}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
                                ) : (
                                  <span className="text-gray-600 font-semibold">
                                    {review.userName.charAt(0).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-semibold text-sm truncate">{review.userName}</h4>
                                <div className="flex items-center space-x-1">
                                  {[...Array(5)].map((_, i) => (
                                    <span
                                      key={i}
                                      className={`text-sm ${
                                        i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                      }`}
                                    >
                                      ★
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(review.uploadedTime).toLocaleDateString()}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="questions" className="mt-6">
              <ProductQASection productId={product._id} initialQA={product.qna ?? []} />
            </TabsContent>
              </Tabs>
        </CardContent>
      </Card>

    </div>
  );
}