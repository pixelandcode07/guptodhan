'use client';

import React, { useState, useEffect } from 'react';
import ShoppingInfoContent from '../ShoppingInfoContent';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

// Cart item type definition (same as shopping cart)
export type CartItem = {
  id: string;
  seller: {
    id: string;
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
  const searchParams = useSearchParams();
  const isBuyNow = searchParams?.get('buyNow') === 'true';

  useEffect(() => {
    // Load cart items from localStorage
    // This is instant, so no need for loading state - ShoppingInfoContent will handle loading
    const loadCartItems = () => {
      try {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart);
          let finalCartItems: CartItem[] = [];
          
          // If "Buy Now" mode, filter to show only the selected product
          if (isBuyNow) {
            const buyNowProductId = sessionStorage.getItem('buyNowProductId');
            if (buyNowProductId) {
              // Filter cart items to show only the "Buy Now" product
              const filteredCart = parsedCart.filter((item: CartItem) => 
                item.product.id === buyNowProductId
              );
              
              if (filteredCart.length === 0) {
                toast.error('Product not found in cart', {
                  description: 'The selected product is not available in your cart.',
                  duration: 3000,
                });
                sessionStorage.removeItem('buyNowProductId');
                router.push('/home/product/shopping-cart');
                return;
              }
              
              finalCartItems = filteredCart;
              // Clear the buyNow flag after use
              sessionStorage.removeItem('buyNowProductId');
            } else {
              // If no product ID stored, show all items
              finalCartItems = parsedCart;
            }
          } else {
            // Normal mode - show all cart items
            finalCartItems = parsedCart;
          }
          
          // Redirect to cart if empty
          if (finalCartItems.length === 0) {
            toast.error('Your cart is empty', {
              description: 'Please add items to your cart before proceeding to checkout.',
              duration: 3000,
            });
            router.push('/home/product/shopping-cart');
            return;
          }
          
          setCartItems(finalCartItems);
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
  }, [router, isBuyNow]);

  return <ShoppingInfoContent cartItems={cartItems} />;
}
