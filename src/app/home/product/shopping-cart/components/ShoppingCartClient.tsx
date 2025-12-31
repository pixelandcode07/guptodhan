'use client';

import React, { useState, useEffect } from 'react';
import ShoppingCartContent from '../ShoppingCartContent';
import { toast } from 'sonner';
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
  console.log(cartItems);
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
