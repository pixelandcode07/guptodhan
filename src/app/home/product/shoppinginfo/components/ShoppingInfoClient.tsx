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
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isBuyNow = searchParams?.get('buyNow') === 'true';

  useEffect(() => {
    // Load cart items from localStorage
    const loadCartItems = () => {
      try {
        const savedCart = localStorage.getItem('cart');

        if (!savedCart) {
          console.warn('⚠️ No cart found in localStorage');
          toast.error('Your cart is empty', {
            description: 'Please add items to your cart before proceeding to checkout.',
            duration: 3000,
          });
          router.push('/home/product/shopping-cart');
          setLoading(false);
          return;
        }

        const parsedCart = JSON.parse(savedCart);

        // Validate cart is an array
        if (!Array.isArray(parsedCart)) {
          console.error('❌ Cart is not an array:', parsedCart);
          toast.error('Invalid cart data', {
            description: 'Please refresh and try again.',
            duration: 3000,
          });
          router.push('/home/product/shopping-cart');
          setLoading(false);
          return;
        }

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
              console.warn('⚠️ Buy Now product not found in cart');
              toast.error('Product not found in cart', {
                description: 'The selected product is not available in your cart.',
                duration: 3000,
              });
              sessionStorage.removeItem('buyNowProductId');
              router.push('/home/product/shopping-cart');
              setLoading(false);
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
          console.warn('⚠️ Cart is empty after filtering');
          toast.error('Your cart is empty', {
            description: 'Please add items to your cart before proceeding to checkout.',
            duration: 3000,
          });
          router.push('/home/product/shopping-cart');
          setLoading(false);
          return;
        }

        console.log('✅ Cart items loaded:', finalCartItems.length);
        setCartItems(finalCartItems);
        setLoading(false);
      } catch (error) {
        console.error('❌ Error loading cart items:', error);
        toast.error('Error loading cart', {
          description: 'Please try again.',
          duration: 3000,
        });
        router.push('/home/product/shopping-cart');
        setLoading(false);
      }
    };

    loadCartItems();
  }, [router, isBuyNow]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Show error state if no items
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            <p className="font-bold">Your Cart is Empty</p>
            <p className="text-sm">Please add items to your cart before proceeding to checkout.</p>
          </div>
        </div>
      </div>
    );
  }

  // Render shopping info with cart items
  return <ShoppingInfoContent cartItems={cartItems} />;
}