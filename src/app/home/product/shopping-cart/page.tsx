'use client';

import React, { useState, useEffect } from 'react';
import ShoppingCartContent from './ShoppingCartContent';
import HeroNav from '@/app/components/Hero/HeroNav';
import axios from 'axios';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

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
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const { cartItems, updateQuantity, removeFromCart, addToCart } = useCart();

  // Cart management functions
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
    
    // Show toast for quantity update
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      toast.success('Quantity updated!', {
        description: `${item.product.name} quantity changed to ${newQuantity}.`,
        duration: 2000,
      });
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  const handleAddToCart = async (productId: string) => {
    try {
      await addToCart(productId);
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  useEffect(() => {
    // Fetch dynamic recommendations
    const loadRecommendations = async () => {
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
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

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
