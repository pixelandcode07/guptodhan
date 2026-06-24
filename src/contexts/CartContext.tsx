'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import api from '@/lib/axios';
import axios from 'axios';

export type CartItem = {
  id: string;
  cartId?: string; 
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

type AddToCartOptions = {
  skipModal?: boolean;
  silent?: boolean;
  color?: string;
  size?: string;
};

type FetchCartOptions = {
  silent?: boolean;
};

type CartContextType = {
  cartItems: CartItem[];
  cartItemCount: number;
  addToCart: (
    productId: string,
    quantity?: number,
    options?: boolean | AddToCartOptions
  ) => Promise<void>;
  updateQuantity: (itemId: string, newQuantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  isAddingToCart: boolean;
  showAddToCartModal: boolean;
  lastAddedProduct: CartItem | null;
  closeAddToCartModal: () => void;
};

export const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<CartItem | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.product.quantity, 0);

  const getUserId = (): string | null => {
    const userLike = (session?.user ?? {}) as { id?: string; _id?: string };
    return userLike.id || userLike._id || null;
  };

  const getUserInfo = () => {
    const user = session?.user;
    return {
      name: user?.name || 'Guest User',
      email: user?.email || 'guest@example.com',
    };
  };

  const fetchCartItems = useCallback(async (options: FetchCartOptions = {}) => {
    const { silent = false } = options;
    const userId = getUserId();
    if (!userId) {
      setIsInitialLoad(false);
      return;
    }

    try {
      if (!silent) setIsLoading(true);
      const response = await api.get(`/add-to-cart/get-cart/${userId}`);
      
      if (response.data?.success && response.data?.data) {
        const apiCartItems = response.data.data;
        
        interface ApiCartItem {
          _id?: string;
          cartID?: string;
          productID?: string | { toString: () => string };
          productName?: string;
          productImage?: string;
          storeName?: string;
          color?: string;
          size?: string;
          unitPrice?: number;
          totalPrice?: number;
          quantity?: number;
        }
        
        const transformedItems: CartItem[] = apiCartItems.map((item: ApiCartItem, index: number) => {
          const productIdStr = typeof item.productID === 'string' ? item.productID : item.productID?.toString();
          const resolvedCartId = item.cartID || item._id?.toString() || `${productIdStr || 'item'}-${index}`;
          
          return {
            id: resolvedCartId,
            cartId: resolvedCartId,
            seller: {
              name: item.storeName || 'Store',
              verified: true,
            },
            product: {
              id: productIdStr || '',
              name: item.productName || 'Unknown Product',
              image: item.productImage || '/img/product/p-1.png',
              size: item.size ?? '—',
              color: item.color ?? '—', 
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
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const cartData = JSON.parse(savedCart);
          setCartItems(cartData);
        } catch (parseError) {}
      }
    } finally {
      if (!silent) setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [session]);

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  useEffect(() => {
    if (!isInitialLoad && cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialLoad]);

  const normalizeAddToCartOptions = (
    options?: boolean | AddToCartOptions
  ): AddToCartOptions & { skipModal: boolean; silent: boolean } => {
    if (typeof options === 'boolean') {
      return { skipModal: options, silent: false };
    }
    return {
      skipModal: options?.skipModal ?? false,
      silent: options?.silent ?? false,
      color: options?.color,
      size: options?.size,
    };
  };

  const addToCart = async (
    productId: string,
    quantity: number = 1,
    options?: boolean | AddToCartOptions
  ) => {
    const normalizedOptions = normalizeAddToCartOptions(options);
    const { skipModal, silent, color, size } = normalizedOptions;
    const userId = getUserId();
    if (!userId) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (!silent) {
      setIsAddingToCart(true);
      setIsLoading(true);
    }
    try {
      const normalizedColor = (color || '').trim().toLowerCase();
      const normalizedSize = (size || '').trim().toLowerCase();
      const existingItem = cartItems.find((item) => {
        const itemColor = (item.product.color || '').trim().toLowerCase();
        const itemSize = (item.product.size || '').trim().toLowerCase();
        return (
          item.product.id === productId &&
          itemColor === normalizedColor &&
          itemSize === normalizedSize
        );
      });

      if (existingItem) {
        await updateQuantity(existingItem.id, existingItem.product.quantity + quantity);
        if (!skipModal) {
          setLastAddedProduct({
            ...existingItem,
            product: {
              ...existingItem.product,
              quantity: existingItem.product.quantity + quantity,
            },
          });
          setShowAddToCartModal(true);
        }
        return;
      }

      const response = await axios.get(`/api/v1/product/${productId}`);
      const productData = response.data.data;
      const { name, email } = getUserInfo();
      
      let storeName = '';
      if (productData.vendorStoreId) {
        if (typeof productData.vendorStoreId === 'object' && productData.vendorStoreId !== null) {
          storeName = productData.vendorStoreId.storeName || productData.vendorName || 'Unknown Store';
        } else {
          storeName = productData.vendorName || 'Unknown Store';
        }
      } else {
        storeName = productData.vendorName || 'Unknown Store';
      }
      
      let unitPrice = productData.discountPrice || productData.productPrice;
      if (productData.productOptions && (color || size)) {
        const matchedVariant = productData.productOptions.find((option: any) => {
          const optionColor = Array.isArray(option.color) ? option.color[0] : option.color;
          const optionSize = Array.isArray(option.size) ? option.size[0] : option.size;
          const colorMatch = color ? optionColor === color : true;
          const sizeMatch = size ? optionSize === size : true;
          return colorMatch && sizeMatch;
        });
        
        if (matchedVariant) {
          unitPrice = matchedVariant.discountPrice || matchedVariant.price || unitPrice;
        }
      }
      
      const cartPayload = {
        userID: userId,
        userName: name,
        userEmail: email,
        productID: productData._id,
        productName: productData.productTitle,
        productImage: productData.thumbnailImage,
        storeName: storeName,
        color: color || undefined,
        size: size || undefined,
        quantity: quantity,
        unitPrice: unitPrice,
        totalPrice: quantity * unitPrice,
      };

      const apiResponse = await api.post('/add-to-cart', cartPayload);
      
      if (apiResponse.data?.success) {
        await fetchCartItems({ silent });
        
        const createdCartItem = apiResponse.data?.data;
        const cartId = createdCartItem?.cartID || '';
        
        const newCartItem: CartItem = {
          id: cartId || productData._id,
          cartId: cartId,
          seller: { name: storeName, verified: true },
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
        
        if (!skipModal) {
          setLastAddedProduct(newCartItem);
          setShowAddToCartModal(true);
        } else {
          setLastAddedProduct(null);
          setShowAddToCartModal(false);
        }
      }
    } catch (error: unknown) {
      let errorMessage = 'Please try again later.';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error('Failed to add product to cart', { description: errorMessage, duration: 3000 });
    } finally {
      if (!silent) {
        setIsAddingToCart(false);
        setIsLoading(false);
      }
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
      const cartItem = cartItems.find(item => item.id === itemId);
      if (!cartItem || !cartItem.cartId) {
        toast.error('Cart item not found');
        return;
      }

      const newTotalPrice = newQuantity * cartItem.product.price;

      const response = await api.patch(`/add-to-cart/get-cart/${userId}/${cartItem.cartId}`, {
        quantity: newQuantity,
        unitPrice: cartItem.product.price, 
        totalPrice: newTotalPrice,
      });

      if (response.data?.success) {
        await fetchCartItems();
        // ✅ শুধু এই একটাই টোস্ট শো করবে
        toast.success('Quantity updated!', {
          description: `Quantity changed to ${newQuantity}.`,
          duration: 2000,
        });
      }
    } catch (error: unknown) {
      let errorMessage = 'Please try again later.';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error('Failed to update quantity', { description: errorMessage, duration: 3000 });
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

      const response = await api.delete(`/add-to-cart/get-cart/${userId}/${item.cartId}`);

      if (response.data?.success) {
        await fetchCartItems();
        // ✅ শুধু এই একটাই টোস্ট শো করবে
        toast.success('Item removed!', {
          description: `${item.product.name} has been removed.`,
          duration: 2000,
        });
      }
    } catch (error: unknown) {
      let errorMessage = 'Please try again later.';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error('Failed to remove item', { description: errorMessage, duration: 3000 });
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    const userId = getUserId();
    if (!userId) return;

    try {
      setIsLoading(true);
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
      let errorMessage = 'Please try again later.';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error('Failed to clear cart', { description: errorMessage, duration: 3000 });
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
    isAddingToCart,
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