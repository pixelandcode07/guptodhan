'use client';

import React, { useMemo, useEffect, useState } from 'react';
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
  
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 800); 
    return () => clearTimeout(timer);
  }, []);

  const displayItems = useMemo(() => {
    if (!Array.isArray(cartItems)) return [];
    if (isBuyNow) {
      const buyNowProductId = typeof window !== 'undefined' ? sessionStorage.getItem('buyNowProductId') : null;
      if (buyNowProductId) {
        return cartItems.filter((item: CartItem) => item.product.id === buyNowProductId);
      }
    }
    if (typeof window !== 'undefined') {
      const selectedRaw = sessionStorage.getItem('selectedCartItemIds');
      if (selectedRaw) {
        try {
          const selectedIds = JSON.parse(selectedRaw) as string[];
          if (Array.isArray(selectedIds) && selectedIds.length > 0) {
            return cartItems.filter((item: CartItem) => selectedIds.includes(item.id));
          }
        } catch (error) {
          console.error('Failed to parse selectedCartItemIds:', error);
        }
      }
    }
    return cartItems;
  }, [cartItems, isBuyNow]);

  // ✅ ডাবল টোস্ট মেসেজ রিমুভ করা হলো (কারণ CartContext থেকে অলরেডি টোস্ট দেওয়া আছে)
  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    await updateQuantity(itemId, newQuantity);
  };

  // ✅ ডাবল টোস্ট রিমুভ করা হলো
  const handleRemoveItem = async (itemId: string) => {
    await removeFromCart(itemId);
    if (displayItems.length <= 1) {
      router.push('/products/shopping-cart');
    }
  };

  if (isLoading || !isReady) {
    return (
      <div className="min-h-[60vh] bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Checking your items...</p>
        </div>
      </div>
    );
  }

  if (isReady && displayItems.length === 0) {
    if (isBuyNow && typeof window !== 'undefined') {
      sessionStorage.removeItem('buyNowProductId');
    }
    toast.error('Your cart is empty', {
      description: 'Please add items to your cart before proceeding to checkout.',
      duration: 3000,
    });
    router.push('/products/shopping-cart');
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