'use client';

import React, { useState, useEffect } from 'react';
import ShoppingCartContent from './ShoppingCartContent';
import HeroNav from '@/app/components/Hero/HeroNav';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { toast } from 'sonner';

// Cart item type definition
export type CartItem = {
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
};

// Recommendation type definition
export type Recommendation = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
};

const mockRecommendations = [
  {
    id: 'r1',
    name: 'Philips Epilator',
    price: 4500,
    originalPrice: 5000,
    image: '/img/product/p-1.png',
  },
  {
    id: 'r2',
    name: 'Pet House',
    price: 3200,
    originalPrice: 3800,
    image: '/img/product/p-2.png',
  },
  {
    id: 'r3',
    name: 'Panasonic Epilator',
    price: 2800,
    originalPrice: 3200,
    image: '/img/product/p-3.png',
  },
  {
    id: 'r4',
    name: 'Hair Dryer',
    price: 1500,
    originalPrice: 1800,
    image: '/img/product/p-4.png',
  },
  {
    id: 'r5',
    name: 'Curling Iron',
    price: 2200,
    originalPrice: 2500,
    image: '/img/product/p-5.png',
  },
  {
    id: 'r6',
    name: 'Smart Watch',
    price: 8900,
    originalPrice: 9500,
    image: '/img/product/p-1.png',
  },
];

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();

  // Cart management functions
  const updateCartInStorage = (newCartItems: CartItem[]) => {
    localStorage.setItem('cart', JSON.stringify(newCartItems));
    setCartItems(newCartItems);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    const item = cartItems.find(item => item.id === itemId);
    const updatedCart = cartItems.map(item => 
      item.id === itemId 
        ? { ...item, product: { ...item.product, quantity: newQuantity } }
        : item
    );
    updateCartInStorage(updatedCart);
    
    // Show toast for quantity update
    if (item) {
      toast.success('Quantity updated!', {
        description: `${item.product.name} quantity changed to ${newQuantity}.`,
        duration: 2000,
      });
    }
  };

  const handleRemoveItem = (itemId: string) => {
    const item = cartItems.find(item => item.id === itemId);
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    updateCartInStorage(updatedCart);
    
    // Show toast for item removal
    if (item) {
      toast.success('Item removed!', {
        description: `${item.product.name} has been removed from your cart.`,
        duration: 2000,
      });
    }
  };

  const handleAddToCart = async (productId: string) => {
    try {
      // Check if product is already in cart
      const existingItemIndex = cartItems.findIndex(item => item.product.id === productId);
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already exists
        const updatedCart = cartItems.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, product: { ...item.product, quantity: item.product.quantity + 1 } }
            : item
        );
        updateCartInStorage(updatedCart);
        
        // Show toast for quantity update
        toast.success('Quantity updated!', {
          description: `${cartItems[existingItemIndex].product.name} quantity increased.`,
          duration: 2000,
        });
      } else {
        // Fetch product details and add to cart
        const response = await axios.get(`/api/v1/product/${productId}`);
        const productData = response.data.data;
        
        const newCartItem: CartItem = {
          id: productData._id,
          seller: {
            name: productData.vendorStoreId?.storeName || 'Store',
            verified: true,
          },
          product: {
            id: productData._id,
            name: productData.productTitle,
            image: productData.thumbnailImage,
            size: 'Standard',
            color: 'Default',
            price: productData.discountPrice || productData.productPrice,
            originalPrice: productData.productPrice,
            quantity: 1,
          },
        };
        
        const updatedCart = [...cartItems, newCartItem];
        updateCartInStorage(updatedCart);
        
        // Show toast for new item added
        toast.success('Product added to cart!', {
          description: `${productData.productTitle} has been added to your cart.`,
          duration: 2000,
        });
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('Failed to add product to cart', {
        description: 'Please try again later.',
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    // Load cart items from localStorage and fetch recommendations
    const loadCartData = async () => {
      try {
        const savedCart = localStorage.getItem('cart');
        let cartData: CartItem[] = [];
        
        if (savedCart) {
          cartData = JSON.parse(savedCart);
        }

        // Check if there's a product ID in URL parameters to add
        const productId = searchParams?.get('add');
        if (productId) {
          // Check if product is already in cart
          const existingItemIndex = cartData.findIndex(item => item.product.id === productId);
          
          if (existingItemIndex >= 0) {
            // Update quantity if product already exists
            cartData[existingItemIndex].product.quantity += 1;
          } else {
            // Fetch product details and add to cart
            try {
              const response = await axios.get(`/api/v1/product/${productId}`);
              const productData = response.data.data;
              
              const newCartItem: CartItem = {
                id: productData._id,
                seller: {
                  name: productData.vendorStoreId?.storeName || 'Store',
                  verified: true,
                },
                product: {
                  id: productData._id,
                  name: productData.productTitle,
                  image: productData.thumbnailImage,
                  size: 'Standard',
                  color: 'Default',
                  price: productData.discountPrice || productData.productPrice,
                  originalPrice: productData.productPrice,
                  quantity: 1,
                },
              };
              
              cartData.push(newCartItem);
            } catch (error) {
              console.error('Error fetching product details:', error);
            }
          }
          
          // Save updated cart to localStorage
          localStorage.setItem('cart', JSON.stringify(cartData));
          
          // Remove the add parameter from URL
          const url = new URL(window.location.href);
          url.searchParams.delete('add');
          window.history.replaceState({}, '', url.toString());
        }
        
        setCartItems(cartData);

        // Fetch dynamic recommendations
        try {
          const recommendationsResponse = await axios.get('/api/v1/product');
          const allProducts = recommendationsResponse.data.data;
          
          // Convert products to recommendation format and take first 6
          const dynamicRecommendations: Recommendation[] = allProducts
            .slice(0, 6)
            .map((product: {
              _id: string;
              productTitle: string;
              productPrice: number;
              discountPrice?: number;
              thumbnailImage: string;
            }) => ({
              id: product._id,
              name: product.productTitle,
              price: product.discountPrice || product.productPrice,
              originalPrice: product.productPrice,
              image: product.thumbnailImage,
            }));
          
          setRecommendations(dynamicRecommendations);
        } catch (error) {
          console.error('Error fetching recommendations:', error);
          // Fallback to mock recommendations if API fails
          setRecommendations(mockRecommendations);
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
        setCartItems([]);
        setRecommendations(mockRecommendations);
      } finally {
        setLoading(false);
      }
    };

    loadCartData();
  }, [searchParams]);

  if (loading) {
    return (
      <>
        <HeroNav />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading cart...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <HeroNav />
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ShoppingCartContent
          cartItems={cartItems}
          recommendations={recommendations}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onAddToCart={handleAddToCart}
        />
      </div>
    </>
  );
}
