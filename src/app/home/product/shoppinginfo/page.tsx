'use client';

import React, { useState, useEffect } from 'react';
import ShoppingInfoContent from './ShoppingInfoContent';
import HeroNav from '@/app/components/Hero/HeroNav';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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

export default function ShoppingInfoPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load cart items from localStorage
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
      } finally {
        setLoading(false);
      }
    };

    loadCartItems();
  }, [router]);

  if (loading) {
    return (
      <>
        <HeroNav />
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading checkout information...</p>
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
        <ShoppingInfoContent cartItems={cartItems} />
      </div>
    </>
  );
}
