'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import axios from 'axios';

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

type CartContextType = {
  cartItems: CartItem[];
  cartItemCount: number;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  isLoading: boolean;
  // Modal state
  showAddToCartModal: boolean;
  lastAddedProduct: CartItem | null;
  closeAddToCartModal: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<CartItem | null>(null);

  // Calculate total item count
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.product.quantity, 0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        setCartItems(cartData);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        setCartItems([]);
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    setIsLoading(true);
    try {
      // Check if product is already in cart
      const existingItemIndex = cartItems.findIndex(item => item.product.id === productId);
      
      if (existingItemIndex >= 0) {
        // Update quantity if product already exists
        const updatedCart = cartItems.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, product: { ...item.product, quantity: item.product.quantity + quantity } }
            : item
        );
        setCartItems(updatedCart);
        setLastAddedProduct(updatedCart[existingItemIndex]);
        
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
            quantity: quantity,
            shippingCost: productData.shippingCost || 0,
            freeShippingThreshold: productData.freeShippingThreshold || 0,
            discountPercentage: productData.discountPercentage || 0,
          },
        };
        
        setCartItems(prev => [...prev, newCartItem]);
        setLastAddedProduct(newCartItem);
        
        toast.success('Product added to cart!', {
          description: `${productData.productTitle} has been added to your cart.`,
          duration: 2000,
        });
      }

      // Show the modal
      setShowAddToCartModal(true);
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast.error('Failed to add product to cart', {
        description: 'Please try again later.',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    const updatedCart = cartItems.map(item => 
      item.id === itemId 
        ? { ...item, product: { ...item.product, quantity: newQuantity } }
        : item
    );
    setCartItems(updatedCart);
  };

  const removeFromCart = (itemId: string) => {
    const item = cartItems.find(item => item.id === itemId);
    const updatedCart = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedCart);
    
    if (item) {
      toast.success('Item removed!', {
        description: `${item.product.name} has been removed from your cart.`,
        duration: 2000,
      });
    }
  };

  const clearCart = () => {
    setCartItems([]);
    toast.success('Cart cleared!', {
      description: 'All items have been removed from your cart.',
      duration: 2000,
    });
  };

  const closeAddToCartModal = () => {
    setShowAddToCartModal(false);
    setLastAddedProduct(null);
  };

  const value: CartContextType = {
    cartItems,
    cartItemCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isLoading,
    showAddToCartModal,
    lastAddedProduct,
    closeAddToCartModal,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
