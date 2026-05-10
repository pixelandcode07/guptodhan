'use client';

import React, { useState, useEffect } from 'react';
import ShoppingCartContent from '../ShoppingCartContent';
import { useCart } from '@/hooks/useCart';
import ShoppingCartSkeleton from './ShoppingCartSkeleton';

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
    shippingCost?: number;
    freeShippingThreshold?: number;
    discountPercentage?: number;
  };
};

export default function ShoppingCartClient() {
  const [loading, setLoading] = useState(true);
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  // Cart management functions
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    // Context-এর ফাংশন কল করা হলো। টোস্ট মেসেজ Context থেকেই আসবে।
    updateQuantity(itemId, newQuantity);
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <ShoppingCartSkeleton />;
  }

  return (
    <ShoppingCartContent
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
    />
  );
}