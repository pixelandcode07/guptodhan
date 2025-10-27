'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import api from '@/lib/axios';
import axios from 'axios';

export type CartItem = {
  id: string;
  cartId?: string; // Add cartId from API
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
  updateQuantity: (itemId: string, newQuantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
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
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<CartItem | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Calculate total item count
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.product.quantity, 0);

  // Get user ID from session
  const getUserId = (): string | null => {
    const userLike = (session?.user ?? {}) as { id?: string; _id?: string };
    return userLike.id || userLike._id || null;
  };

  // Get user info from session
  const getUserInfo = () => {
    const user = session?.user;
    return {
      name: user?.name || 'Guest User',
      email: user?.email || 'guest@example.com',
    };
  };

  // Fetch cart items from API
  const fetchCartItems = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      console.log('No user ID found, skipping cart fetch');
      setIsInitialLoad(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await api.get(`/add-to-cart/get-cart/${userId}`);
      
      if (response.data?.success && response.data?.data) {
        const apiCartItems = response.data.data;
        
        // Transform API cart items to match CartItem type
        interface ApiCartItem {
          _id?: string;
          cartID?: string;
          productID?: string | { toString: () => string };
          productName?: string;
          productImage?: string;
          unitPrice?: number;
          quantity?: number;
        }
        
        const transformedItems: CartItem[] = apiCartItems.map((item: ApiCartItem) => {
          const productIdStr = typeof item.productID === 'string' ? item.productID : item.productID?.toString();
          
          return {
            id: productIdStr || item._id?.toString() || '',
            cartId: item.cartID || item._id?.toString() || '',
            seller: {
              name: 'Store',
              verified: true,
            },
            product: {
              id: productIdStr || '',
              name: item.productName || 'Unknown Product',
              image: item.productImage || '/img/product/p-1.png',
              size: 'Standard',
              color: 'Default',
              price: item.unitPrice || 0,
              originalPrice: item.unitPrice || 0,
              quantity: item.quantity || 1,
              shippingCost: 0,
              freeShippingThreshold: 0,
              discountPercentage: 0,
            },
          };
        });
        
        setCartItems(transformedItems);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
      // Fallback to localStorage if API fails
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          setCartItems(cartData);
        } catch (parseError) {
          console.error('Error parsing localStorage cart:', parseError);
        }
      }
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  // Load cart on mount and when session changes
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  // Save to localStorage as backup
  useEffect(() => {
    if (!isInitialLoad && cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialLoad]);

  const addToCart = async (productId: string, quantity: number = 1) => {
    const userId = getUserId();
    if (!userId) {
      toast.error('Please login to add items to cart');
      return;
    }

    setIsLoading(true);
    try {
      // Fetch product details
      const response = await axios.get(`/api/v1/product/${productId}`);
      const productData = response.data.data;
      
      const { name, email } = getUserInfo();
      
      const cartPayload = {
        cartID: `CID-${Math.random().toString(36).substring(2, 10)}`,
        userID: userId,
        userName: name,
        userEmail: email,
        productID: productData._id,
        productName: productData.productTitle,
        productImage: productData.thumbnailImage,
        quantity: quantity,
        unitPrice: productData.discountPrice || productData.productPrice,
        totalPrice: quantity * (productData.discountPrice || productData.productPrice),
      };

      // Add to cart via API
      const apiResponse = await api.post('/add-to-cart', cartPayload);
      
      if (apiResponse.data?.success) {
        // Refetch cart items from API
        await fetchCartItems();
        
        // Create cart item for modal display
        const newCartItem: CartItem = {
          id: productData._id,
          cartId: cartPayload.cartID,
          seller: {
            name: 'Store',
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
            shippingCost: 0,
            freeShippingThreshold: 0,
            discountPercentage: 0,
          },
        };
        
        // Set last added product and show modal
        setLastAddedProduct(newCartItem);
        setShowAddToCartModal(true);
        
        // Show success message
        toast.success('Product added to cart!', {
          description: `${productData.productTitle} has been added to your cart.`,
          duration: 2000,
        });
      }
    } catch (error: unknown) {
      console.error('Error adding product to cart:', error);
      let errorMessage = 'Please try again later.';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error('Failed to add product to cart', {
        description: errorMessage,
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    const userId = getUserId();
    if (!userId || !itemId) return;

    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    try {
      setIsLoading(true);
      
      // Find the cart item to get its cartId
      const cartItem = cartItems.find(item => item.id === itemId);
      if (!cartItem || !cartItem.cartId) {
        toast.error('Cart item not found');
        return;
      }

      // Calculate new total price
      const newTotalPrice = newQuantity * cartItem.product.price;

      // Update via API
      const response = await api.patch(`/add-to-cart/get-cart/${userId}/${cartItem.cartId}`, {
        quantity: newQuantity,
        totalPrice: newTotalPrice,
      });

      if (response.data?.success) {
        // Refetch cart items
        await fetchCartItems();
        
        toast.success('Quantity updated!', {
          description: `Quantity changed to ${newQuantity}.`,
          duration: 2000,
        });
      }
    } catch (error: unknown) {
      console.error('Error updating cart quantity:', error);
      let errorMessage = 'Please try again later.';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error('Failed to update quantity', {
        description: errorMessage,
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = async (itemId: string) => {
    const userId = getUserId();
    if (!userId || !itemId) return;

    const item = cartItems.find(item => item.id === itemId);
    if (!item) return;

    try {
      setIsLoading(true);

      if (!item.cartId) {
        toast.error('Cart item not found');
        return;
      }

      // Delete via API
      const response = await api.delete(`/add-to-cart/get-cart/${userId}/${item.cartId}`);

      if (response.data?.success) {
        // Refetch cart items
        await fetchCartItems();
        
        toast.success('Item removed!', {
          description: `${item.product.name} has been removed from your cart.`,
          duration: 2000,
        });
      }
    } catch (error: unknown) {
      console.error('Error removing from cart:', error);
      let errorMessage = 'Please try again later.';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error('Failed to remove item', {
        description: errorMessage,
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      setIsLoading(true);

      // Clear via API
      const response = await api.delete(`/add-to-cart/get-cart/${userId}`);

      if (response.data?.success) {
        setCartItems([]);
        localStorage.removeItem('cart');
        
        toast.success('Cart cleared!', {
          description: 'All items have been removed from your cart.',
          duration: 2000,
        });
      }
    } catch (error: unknown) {
      console.error('Error clearing cart:', error);
      let errorMessage = 'Please try again later.';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error('Failed to clear cart', {
        description: errorMessage,
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
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
