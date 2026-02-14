'use client';

import React, { useMemo } from 'react';
import ShoppingInfoContent from '../ShoppingInfoContent';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import type { CartItem } from '../../shopping-cart/ShoppingCartContent';

export type { CartItem };

export default function ShoppingInfoClient() {
  const { cartItems, updateQuantity, removeFromCart, isLoading } = useCart();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams?.get('buyNow') === 'true';

  const displayItems = useMemo(() => {
    if (!Array.isArray(cartItems)) return [];
    if (isBuyNow) {
      const buyNowProductId = typeof window !== 'undefined' ? sessionStorage.getItem('buyNowProductId') : null;
      if (buyNowProductId) {
        const filtered = cartItems.filter((item: CartItem) => item.product.id === buyNowProductId);
        return filtered;
      }
    }
    return cartItems;
  }, [cartItems, isBuyNow]);

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    try {
      await updateQuantity(itemId, newQuantity);
    } catch {
      // toast handled in context
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeFromCart(itemId);
      if (displayItems.length <= 1) {
        router.push('/home/product/shopping-cart');
      }
    } catch {
      // toast handled in context
    }
  };

  if (isLoading && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (displayItems.length === 0) {
    if (isBuyNow && typeof window !== 'undefined') {
      sessionStorage.removeItem('buyNowProductId');
    }
    toast.error('Your cart is empty', {
      description: 'Please add items to your cart before proceeding to checkout.',
      duration: 3000,
    });
    router.push('/home/product/shopping-cart');
    return null;
  }

  return (
    <ShoppingInfoContent
      cartItems={displayItems}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
    />
  );
}
