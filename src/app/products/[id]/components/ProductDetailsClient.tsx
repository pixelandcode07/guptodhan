'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Package, Store, Tag, DollarSign, ShoppingCart, CreditCard, Heart, Share2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { useWishlist } from '@/contexts/WishlistContext';

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
    vendorStoreId?: string;
    category?: string;
    subCategory?: string;
    childCategory?: string;
    brand?: string;
    productModel?: string;
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
  };
  relatedData: {
    categories: Array<{ _id: string; name: string }>;
    stores: Array<{ _id: string; storeName: string; storeAddress?: string }>;
    brands: Array<{ _id: string; brandName: string }>;
    subCategories: Array<{ _id: string; subCategoryName: string }>;
    childCategories: Array<{ _id: string; childCategoryName: string }>;
    models: Array<{ _id: string; modelName: string }>;
  };
}

interface ProductDetailsClientProps {
  productData: ProductData;
}

export default function ProductDetailsClient({ productData }: ProductDetailsClientProps) {
  const router = useRouter();
  const { product, relatedData } = productData;
  const [selectedImage, setSelectedImage] = useState(product.thumbnailImage);
 
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);

  // Helper functions to get names by ID using server data
  const getCategoryName = (categoryId: string) => {
    const category = relatedData.categories.find(cat => cat._id === categoryId);
    return category?.name || 'N/A';
  };

  const getStoreName = (storeId: string) => {
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


  const handleBack = () => {
    router.back();
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      // TODO: Implement add to cart functionality
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Product added to cart successfully!');
    } catch {
      toast.error('Failed to add product to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    setIsBuyingNow(true);
    try {
      // TODO: Implement buy now functionality
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Redirecting to checkout...');
      // router.push('/checkout');
    } catch {
      toast.error('Failed to proceed to checkout');
    } finally {
      setIsBuyingNow(false);
    }
  };

  const { addToWishlist, isLoading: isWishlistLoading } = useWishlist();

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
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="outline" onClick={handleBack} className="flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </Button>

        {/* Main Product Information */}
        <div className="flex flex-col lg:flex-row gap-6">
         {/* Product Images */}
         <Card className="w-full lg:w-96 flex-shrink-0">
           <CardHeader>
             <CardTitle className="flex items-center gap-2">
               <Package className="w-5 h-5" />
               Product Images
             </CardTitle>
           </CardHeader>
           <CardContent>
             <div className="space-y-4">
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
                 <div className="grid grid-cols-4 gap-2">
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
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Product Information
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleWishlist}
                  disabled={isWishlistLoading}
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Wishlist
                </Button>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Product Title */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{product.productTitle}</h2>
              <p className="text-gray-600 mt-1">{product.shortDescription}</p>
            </div>

            {/* Status Badge */}
            <div>
              <Badge variant={product.status === 'active' ? 'default' : 'secondary'}>
                {product.status === 'active' ? 'Active' : 'Inactive'}
              </Badge>
            </div>

            {/* Pricing */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {formatPrice(product.productPrice)}
                </span>
                {product.discountPrice && (
                  <span className="text-lg text-gray-500 line-through">
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
            <div className="grid grid-cols-2 gap-4 text-sm">
             
             
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


            {/* Quantity Selector */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-700">Quantity</h4>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="rounded-r-none border-r-0"
                  >
                    -
                  </Button>
                  <span className="px-4 py-2 text-sm font-medium min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="rounded-l-none border-l-0"
                  >
                    +
                  </Button>
                </div>
               
              </div>
            </div>

            {/* E-commerce Actions */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || !product.stock || product.status !== 'active'}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={isBuyingNow || !product.stock || product.status !== 'active'}
                  className="flex-1 bg-green-600 hover:bg-green-700"
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
          <Card className="w-full lg:w-80 flex-shrink-0">
           <CardContent className="p-6">
             <div className="space-y-4">
               {/* Easy Shipping & Returns */}
               <div className="flex items-start space-x-3 pb-4 border-b border-gray-200">
                 <div className="flex-shrink-0">
                   <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                   <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                   <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <CardContent className="p-6">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="warranty">Warranty</TabsTrigger>
              <TabsTrigger value="vendorInformation">Vendor Information</TabsTrigger>
              <TabsTrigger value="customersReviews">Customers Reviews</TabsTrigger>
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
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Vendor Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <h4 className="text-lg font-semibold">Vendor Name</h4>
                          <p className="text-gray-600">John Doe</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
            </TabsContent>
            <TabsContent value="customersReviews" className="mt-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Customers Reviews</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="text-lg font-semibold">Customer Name</h4>
                        <p className="text-gray-600">John Doe</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
              </Tabs>
        </CardContent>
      </Card>

    </div>
  );
} 