'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';

interface ProductDetailsProps {
  productId: string;
}

interface CartItem {
  id: string;
  seller: {
    name: string;
    verified: boolean;
  };
  product: {
    id: string;
    name: string;
    image: string;
    size: string;
    color: string;
    price: number;
    originalPrice: number;
    quantity: number;
  };
}

interface ProductData {
  _id: string;
  productTitle: string;
  productPrice: number;
  discountPrice?: number;
  thumbnailImage: string;
  photoGallery: string[];
  shortDescription: string;
  fullDescription: string;
  specification: string;
  warrantyPolicy: string;
  stock?: number;
  rewardPoints?: number;
  sku?: string;
  category: { _id: string; name: string };
  brand?: { _id: string; name: string };
  productModel?: { _id: string; name: string };
  warranty: string;
  vendorStoreId: { _id: string; storeName: string };
  createdAt: string;
  updatedAt: string;
}

export default function ProductDetails({ productId }: ProductDetailsProps) {
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/product/${productId}`);
        const productData = response.data.data;
        setProduct(productData);
        
        // Set initial selected image
        if (productData.photoGallery && productData.photoGallery.length > 0) {
          setSelectedImage(productData.photoGallery[0]);
        } else if (productData.thumbnailImage) {
          setSelectedImage(productData.thumbnailImage);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      const cartItem: CartItem = {
        id: product._id,
        seller: {
          name: product.vendorStoreId?.storeName || 'Store',
          verified: true,
        },
        product: {
          id: product._id,
          name: product.productTitle,
          image: product.thumbnailImage,
          size: 'Standard',
          color: 'Default',
          price: product.discountPrice || product.productPrice,
          originalPrice: product.productPrice,
          quantity: 1,
        },
      };

      const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItemIndex = existingCart.findIndex((item: CartItem) => item.product.id === product._id);

      if (existingItemIndex >= 0) {
        existingCart[existingItemIndex].product.quantity += 1;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem('cart', JSON.stringify(existingCart));

      toast.success('Product added to cart successfully!', {
        description: `${product.productTitle} has been added to your cart.`,
        duration: 3000,
      });

      setTimeout(() => {
        router.push('/home/products/shopping-cart');
      }, 1500);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading product details...</span>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error || 'Product not found'}</p>
      </div>
    );
  }

  // Get images array (photoGallery or fallback to thumbnail)
  const images = product.photoGallery && product.photoGallery.length > 0 
    ? product.photoGallery 
    : [product.thumbnailImage];

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6 border rounded-lg bg-white shadow">
      {/* Left: Images */}
      <div>
        <div className="border rounded-md flex items-center justify-center">
          <Image
            src={selectedImage || product.thumbnailImage}
            alt={product.productTitle}
            width={400}
            height={400}
            className="w-[400px] h-[400px] object-contain"
          />
        </div>

        <div className="flex gap-3 mt-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`border rounded-md p-1 ${
                selectedImage === img ? 'border-blue-500' : 'border-gray-200'
              }`}>
              <Image src={img} alt={`thumb-${idx}`} width={60} height={60} />
            </button>
          ))}
        </div>
      </div>

      {/* Right: Details */}
      <div>
        <h2 className="text-xl font-semibold">{product.productTitle}</h2>

        {/* Short Description */}
        {product.shortDescription && (
          <p className="text-gray-600 mt-2">{product.shortDescription}</p>
        )}

        {/* Store */}
        <p className="text-sm mt-4">
          <div className="flex gap-2">
            <div className="">
              <Image
                src={product.thumbnailImage}
                alt="Store"
                width={50}
                height={50}
                className="rounded"
              />
            </div>
            <div className="flex flex-col gap-1 justify-center">
              <span className="font-medium">Store</span>
              <span className="text-blue-600 underline ml-1 cursor-pointer">
                Explore All Products
              </span>
            </div>
          </div>
        </p>

        {/* Price */}
        <div className="mt-3">
          <p className="text-2xl font-bold text-blue-600">
            ৳ {product.productPrice.toLocaleString()}
          </p>
          {product.discountPrice && (
            <p className="text-sm line-through text-gray-400">
              ৳ {product.discountPrice.toLocaleString()}
            </p>
          )}
        </div>

        {/* Product Info */}
        <div className="mt-4 space-y-3">
          {product.sku && (
            <div>
              <p className="text-sm font-medium">Product Code:</p>
              <p className="text-gray-600">{product.sku}</p>
            </div>
          )}
          
          {product.stock !== undefined && (
            <div>
              <p className="text-sm font-medium">Stock:</p>
              <p className="text-gray-600">{product.stock} available</p>
            </div>
          )}
          
          {product.rewardPoints && (
            <div>
              <p className="text-sm font-medium">Reward Points:</p>
              <p className="text-gray-600">{product.rewardPoints} points</p>
            </div>
          )}
          
          {product.warranty && (
            <div>
              <p className="text-sm font-medium">Warranty:</p>
              <p className="text-gray-600">{product.warranty}</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-6">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
            Buy Now
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={handleAddToCart}
          >
            Add To Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
