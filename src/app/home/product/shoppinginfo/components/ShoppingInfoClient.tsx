'use client';

import React, { useState, useEffect } from 'react';
import ShoppingInfoContent from '../ShoppingInfoContent';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
// Removed FancyLoadingPage import - no longer needed here as ShoppingInfoContent handles loading

// Cart item type definition (same as shopping cart)
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

export default function ShoppingInfoClient() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Load cart items from localStorage
    // This is instant, so no need for loading state - ShoppingInfoContent will handle loading
    const loadCartItems = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          setCartItems(parsedCart);
          
          // Redirect to cart if empty
          if (parsedCart.length === 0) {
            toast.error('Your cart is empty', {
              description: 'Please add items to your cart before proceeding to checkout.',
              duration: 3000,
            });
            router.push('/home/product/shopping-cart');
            return;
          }
        } else {
          setCartItems([]);
          toast.error('No cart found', {
            description: 'Please add items to your cart before proceeding to checkout.',
            duration: 3000,
          });
          router.push('/home/product/shopping-cart');
          return;
        }
      } catch (error) {
        console.error('Error loading cart items:', error);
        setCartItems([]);
        toast.error('Error loading cart', {
          description: 'Please try again.',
          duration: 3000,
        });
        router.push('/home/product/shopping-cart');
        return;
      }
    };

    loadCartItems();
  }, [router]);

  return <ShoppingInfoContent cartItems={cartItems} />;
}
