'use client';

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
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

type AddToCartOptions = {
  skipModal?: boolean;
  silent?: boolean;
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
    options?: boolean | AddToCartOptions,
    size?: string,
    price?: number,
    color?: string
  ) => Promise<void>;

  updateQuantity: (itemId: string, newQuantity: number) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
  isAddingToCart: boolean;
  // Modal state
  showAddToCartModal: boolean;
  lastAddedProduct: CartItem | null;
  closeAddToCartModal: () => void;
};

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { data: session } = useSession();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showAddToCartModal, setShowAddToCartModal] = useState(false);
  const [lastAddedProduct, setLastAddedProduct] = useState<CartItem | null>(
    null
  );
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Calculate total item count
  const cartItemCount = cartItems.reduce(
    (sum, item) => sum + item.product.quantity,
    0
  );

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
  const fetchCartItems = useCallback(
    async (options: FetchCartOptions = {}) => {
      const { silent = false } = options;
      const userId = getUserId();
      if (!userId) {
        console.log('No user ID found, skipping cart fetch');
        setIsInitialLoad(false);
        return;
      }

      try {
        if (!silent) {
          setIsLoading(true);
        }
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

          const transformedItems: CartItem[] = apiCartItems.map(
            (item: ApiCartItem) => {
              console.log('item ========= ', item);
              const productIdStr =
                typeof item.productID === 'string'
                  ? item.productID
                  : item.productID?.toString();

              return {
                id: productIdStr || item._id?.toString() || '',
                cartId: item.cartID || '', // Always use cartID from database
                seller: {
                  name: item.storeName || 'Store',
                  verified: true,
                },
                product: {
                  id: productIdStr || '',
                  name: item.productName || 'Unknown Product',
                  image: item.productImage || '/img/product/p-1.png',
                  size: item.size || 'Standard',
                  color: item.color || 'Default',
                  price: item.unitPrice || 0,
                  originalPrice: item.unitPrice || 0,
                  quantity: item.quantity || 1,
                  shippingCost: 0,
                  freeShippingThreshold: 0,
                  discountPercentage: 0,
                },
              };
            }
          );

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
        if (!silent) {
          setIsLoading(false);
        }
        setIsInitialLoad(false);
      }
    },
    [session]
  );

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

  const normalizeAddToCartOptions = (
    options?: boolean | AddToCartOptions
  ): Required<AddToCartOptions> => {
    if (typeof options === 'boolean') {
      return { skipModal: options, silent: false };
    }
    return {
      skipModal: options?.skipModal ?? false,
      silent: options?.silent ?? false,
    };
  };

  const addToCart = async (
    productId: string,
    quantity: number = 1,
    options?: boolean | AddToCartOptions,
    size?: string,
    price?: number,
    color?: string
  ) => {
    const { skipModal, silent } = normalizeAddToCartOptions(options);
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
      // Fetch product details
      const response = await axios.get(`/api/v1/product/${productId}`);
      const productData = response.data.data;

      const { name, email } = getUserInfo();

      // Extract store name from product data
      // vendorStoreId can be an object (populated) or a string (ID)
      let storeName = '';
      if (productData.vendorStoreId) {
        if (
          typeof productData.vendorStoreId === 'object' &&
          productData.vendorStoreId !== null
        ) {
          storeName =
            productData.vendorStoreId.storeName ||
            productData.vendorName ||
            'Unknown Store';
        } else {
          // If it's just an ID, use vendorName as fallback
          storeName = productData.vendorName || 'Unknown Store';
        }
      } else {
        // Fallback to vendorName if vendorStoreId is not available
        storeName = productData.vendorName || 'Unknown Store';
      }

      // Backend generates cartID, so we don't need to send it
      const cartPayload = {
        userID: userId,
        userName: name,
        userEmail: email,

        productID: productData._id,
        productName: productData.productTitle,
        productImage: productData.thumbnailImage,
        storeName: storeName,

        color: color ?? null,
        size: size ?? null,

        quantity,
        unitPrice:
          price ?? (productData.discountPrice || productData.productPrice),

        totalPrice:
          quantity *
          (price ?? (productData.discountPrice || productData.productPrice)),
      };

      // Add to cart via API
      const apiResponse = await api.post('/add-to-cart', cartPayload);

      if (apiResponse.data?.success) {
        // Refetch cart items from API to get the actual cartID from backend
        await fetchCartItems({ silent });

        // Get the cartID from the response or use the newly created item
        const createdCartItem = apiResponse.data?.data;
        const cartId = createdCartItem?.cartID || '';

        // Create cart item for modal display
        const newCartItem: CartItem = {
          id: productData._id,
          cartId,
          seller: {
            name: storeName,
            verified: true,
          },
          product: {
            id: productData._id,
            name: productData.productTitle,
            image: productData.thumbnailImage,

            size: size || 'Standard',
            color: color || 'Default',

            price: price ?? productData.productPrice,
            originalPrice: productData.productPrice,
            quantity,
            shippingCost: 0,
            freeShippingThreshold: 0,
            discountPercentage: 0,
          },
        };

        // Set last added product and show modal only if not skipping
        if (!skipModal) {
          setLastAddedProduct(newCartItem);
          setShowAddToCartModal(true);
        } else {
          setLastAddedProduct(null);
          setShowAddToCartModal(false);
        }
      }
    } catch (error: unknown) {
      console.error('Error adding product to cart:', error);
      let errorMessage = 'Please try again later.';
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }
      toast.error('Failed to add product to cart', {
        description: errorMessage,
        duration: 3000,
      });
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

      // Find the cart item to get its cartId
      const cartItem = cartItems.find(item => item.id === itemId);
      if (!cartItem || !cartItem.cartId) {
        toast.error('Cart item not found');
        return;
      }

      // Calculate new total price
      const newTotalPrice = newQuantity * cartItem.product.price;

      console.log('🛒 Updating cart item:', {
        cartId: cartItem.cartId,
        userId,
        quantity: newQuantity,
        unitPrice: cartItem.product.price,
        totalPrice: newTotalPrice,
      });

      // Update via API
      const response = await api.patch(
        `/add-to-cart/get-cart/${userId}/${cartItem.cartId}`,
        {
          quantity: newQuantity,
          unitPrice: cartItem.product.price, // Backend needs this to calculate totalPrice
          totalPrice: newTotalPrice,
        }
      );

      console.log('✅ Update response:', response.data);

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
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
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
      const response = await api.delete(
        `/add-to-cart/get-cart/${userId}/${item.cartId}`
      );

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
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
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
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
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
    isAddingToCart,
    showAddToCartModal,
    lastAddedProduct,
    closeAddToCartModal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
