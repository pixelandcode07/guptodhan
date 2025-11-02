"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { Heart, Trash2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import FancyLoadingPage from '@/app/general/loading'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/contexts/CartContext'

export interface WishlistProduct {
  _id: string
  wishlistID: string
  productID: {
    _id: string
    productTitle: string
    thumbnailImage: string
    photoGallery?: string[]
    productPrice: number
    discountPrice?: number
  } | string
  createdAt: string
}

interface WishlistClientProps {
  initialWishlistItems?: WishlistProduct[]
}

export default function WishlistClient({ initialWishlistItems = [] }: WishlistClientProps) {
  const { data: session } = useSession()
  const { refreshWishlist } = useWishlist()
  const { addToCart: addToCartContext, isLoading: isCartLoading } = useCart()
  const [wishlistItems, setWishlistItems] = useState<WishlistProduct[]>(initialWishlistItems)
  const [loading, setLoading] = useState(false)

  const fetchWishlist = useCallback(async () => {
    if (!session?.user) {
      setWishlistItems([])
      return
    }

    try {
      setLoading(true)
      const userLike = (session.user ?? {}) as { id?: string; _id?: string }
      const userId = userLike._id || userLike.id

      if (!userId) {
        setWishlistItems([])
        return
      }

      const response = await axios.get(`/api/v1/wishlist?userId=${userId}`)
      
      if (response.data.success) {
        const items = (response.data.data ?? []) as WishlistProduct[]
        setWishlistItems(items)
      } else {
        setWishlistItems([])
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      setWishlistItems([])
      toast.error('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }, [session])

  useEffect(() => {
    // Only refetch if initial items are empty or if we need to refresh
    if (initialWishlistItems.length === 0) {
      fetchWishlist()
    }
  }, [fetchWishlist, initialWishlistItems.length])

  const handleRemoveFromWishlist = async (wishlistId: string) => {
    try {
      const response = await axios.delete(`/api/v1/wishlist/${wishlistId}`)
      
      if (response.data.success) {
        toast.success('Removed from wishlist')
        // Remove from local state immediately
        setWishlistItems(prev => prev.filter(item => item._id !== wishlistId))
        // Refresh wishlist count in context
        await refreshWishlist()
      } else {
        toast.error('Failed to remove from wishlist')
      }
    } catch (error: unknown) {
      console.error('Error removing from wishlist:', error)
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to remove from wishlist'
      toast.error(errorMessage)
    }
  }

  const handleAddToCart = async (productId: string | { _id: string }, wishlistItemId: string) => {
    // Extract product ID
    const id = typeof productId === 'object' ? productId._id : productId
    
    if (!id) {
      toast.error('Invalid product ID')
      return
    }
    
    try {
      // Step 1: Add to cart (handles API, DB update, localStorage, UI update)
      await addToCartContext(id, 1)
      
      // Step 2: Remove from wishlist after successful cart addition
      try {
        const deleteResponse = await axios.delete(`/api/v1/wishlist/${wishlistItemId}`)
        
        if (deleteResponse.data.success) {
          // Remove from local state immediately
          setWishlistItems(prev => prev.filter(item => item._id !== wishlistItemId))
          // Refresh wishlist count in context (updates navbar badge)
          await refreshWishlist()
          
          // Show confirmation toast
          toast.success('Added to cart and removed from wishlist', {
            description: 'Product has been moved to your shopping cart',
            duration: 3000,
          })
        } else {
          console.warn('Product added to cart but failed to remove from wishlist')
        }
      } catch (wishlistError) {
        console.error('Error removing from wishlist after adding to cart:', wishlistError)
        // Don't show error to user as cart addition was successful
        // The item will still be removed from wishlist on next page refresh
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      // Error toast is handled by CartContext
      throw error
    }
  }

  if (loading && wishlistItems.length === 0) {
    return <FancyLoadingPage />
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your wishlist</p>
          <Link href="/">
            <Button>Go to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return <WishlistGrid items={wishlistItems} onRemove={handleRemoveFromWishlist} onAddToCart={handleAddToCart} />
}

interface WishlistGridProps {
  items: WishlistProduct[]
  onRemove: (wishlistId: string) => void
  onAddToCart: (productId: string | { _id: string }, wishlistItemId: string) => void
}

function WishlistGrid({ items, onRemove, onAddToCart }: WishlistGridProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-12 text-center">
        <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-600 mb-6">Start adding products you love to your wishlist</p>
        <Link href="/home/product/filter">
          <Button>Browse Products</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {items.map((item) => (
        <WishlistItem
          key={item._id}
          item={item}
          onRemove={onRemove}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  )
}

interface WishlistItemProps {
  item: WishlistProduct
  onRemove: (wishlistId: string) => void
  onAddToCart: (productId: string | { _id: string }, wishlistItemId: string) => void
}

function WishlistItem({ item, onRemove, onAddToCart }: WishlistItemProps) {
  const { isLoading: isCartLoading } = useCart()
  const [isAddingToCart, setIsAddingToCart] = React.useState(false)
  
  const handleAddToCartClick = async () => {
    setIsAddingToCart(true)
    try {
      // Pass both productId and wishlist item _id so it can be removed after adding to cart
      await onAddToCart(item.productID, item._id)
    } finally {
      setIsAddingToCart(false)
    }
  }
  // Extract product data
  const product = typeof item.productID === 'object' && item.productID !== null
    ? item.productID
    : null
  
  const productId = product?._id || (typeof item.productID === 'string' ? item.productID : '')
  const productTitle = product?.productTitle || 'Product'
  const productPrice = product?.productPrice || 0
  const discountPrice = product?.discountPrice
  const thumbnailImage = product?.thumbnailImage || 
    (product?.photoGallery && product.photoGallery.length > 0 ? product.photoGallery[0] : '') ||
    '/img/product/p-1.png'

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/products/${productId}`}>
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={thumbnailImage}
            alt={productTitle}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/products/${productId}`}>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
            {productTitle}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-blue-600">
            ৳ {discountPrice ? discountPrice.toLocaleString() : productPrice.toLocaleString()}
          </span>
          {discountPrice && discountPrice < productPrice && (
            <span className="text-sm text-gray-500 line-through">
              ৳ {productPrice.toLocaleString()}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleAddToCartClick}
            disabled={isAddingToCart || isCartLoading}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAddingToCart || isCartLoading ? 'Adding...' : 'Add to Cart'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onRemove(item._id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

