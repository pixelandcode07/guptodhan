"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { Heart, Trash2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import FancyLoadingPage from '@/app/general/loading'
import { useWishlist } from '@/contexts/WishlistContext'
import { useCart } from '@/hooks/useCart'
import { useWishlistSelection } from './useWishlistSelection'
import type { WishlistProduct } from '../types'

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

  const handleAddToCart = async (productId: string | { _id: string }, wishlistItemId: string, color?: string, size?: string) => {
    // Extract product ID
    const id = typeof productId === 'object' ? productId._id : productId
    
    if (!id) {
      toast.error('Invalid product ID')
      return
    }
    
    try {
      // Step 1: Add to cart (handles API, DB update, localStorage, UI update)
      await addToCartContext(id, 1, {
        color: color || undefined,
        size: size || undefined
      })
      
      // Step 2: Remove from wishlist after successful cart addition
      try {
        const deleteResponse = await axios.delete(`/api/v1/wishlist/${wishlistItemId}`)
        
        if (deleteResponse.data.success) {
          // Remove from local state immediately
          setWishlistItems(prev => prev.filter(item => item._id !== wishlistItemId))
          // Deselect if selected
          deselect(wishlistItemId)
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

  const {
    selectedItems,
    isAddingSelected,
    isAllSelected,
    handleToggleSelect,
    handleSelectAll,
    handleAddSelectedToCart,
    deselect,
  } = useWishlistSelection({ 
    wishlistItems, 
    addToCart: addToCartContext, 
    refreshWishlist,
    removeFromLocal: (ids: string[]) => {
      setWishlistItems(prev => prev.filter(i => !ids.includes(i._id)))
    }
  })

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

  return (
    <WishlistGrid 
      items={wishlistItems} 
      onRemove={handleRemoveFromWishlist} 
      onAddToCart={handleAddToCart}
      selectedItems={selectedItems}
      onToggleSelect={handleToggleSelect}
      onSelectAll={handleSelectAll}
      isAllSelected={isAllSelected}
      onAddSelectedToCart={handleAddSelectedToCart}
      isAddingSelected={isAddingSelected}
      isCartLoading={isCartLoading}
    />
  )
}

interface WishlistGridProps {
  items: WishlistProduct[]
  onRemove: (wishlistId: string) => void
  onAddToCart: (productId: string | { _id: string }, wishlistItemId: string) => void
  selectedItems: Set<string>
  onToggleSelect: (wishlistItemId: string) => void
  onSelectAll: (checked: boolean) => void
  isAllSelected: boolean
  onAddSelectedToCart: () => void
  isAddingSelected: boolean
  isCartLoading: boolean
}

function WishlistGrid({ 
  items, 
  onRemove, 
  onAddToCart,
  selectedItems,
  onToggleSelect,
  onSelectAll,
  isAllSelected,
  onAddSelectedToCart,
  isAddingSelected,
  isCartLoading
}: WishlistGridProps) {
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
    <div className="space-y-4">
      {/* Selection Controls */}
      {items.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-2 border-gray-200">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={isAllSelected}
              onCheckedChange={onSelectAll}
              aria-label="Select all items"
              className="w-5 h-5"
            />
            <label 
              className="text-sm font-medium text-gray-700 cursor-pointer select-none" 
              onClick={() => onSelectAll(!isAllSelected)}
            >
              Select All
            </label>
            {selectedItems.size > 0 && (
              <span className="text-sm text-blue-600 font-semibold">
                ({selectedItems.size} {selectedItems.size === 1 ? 'item' : 'items'} selected)
              </span>
            )}
          </div>
          {selectedItems.size > 0 && (
            <Button
              onClick={onAddSelectedToCart}
              disabled={isAddingSelected || isCartLoading}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
            >
              <ShoppingCart className="w-4 h-4" />
              {isAddingSelected || isCartLoading ? 'Adding...' : `Add ${selectedItems.size} to Cart`}
            </Button>
          )}
        </div>
      )}

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((item) => (
          <WishlistItem
            key={item._id}
            item={item}
            onRemove={onRemove}
            onAddToCart={onAddToCart}
            isSelected={selectedItems.has(item._id)}
            onToggleSelect={onToggleSelect}
          />
        ))}
      </div>
    </div>
  )
}

interface WishlistItemProps {
  item: WishlistProduct
  onRemove: (wishlistId: string) => void
  onAddToCart: (productId: string | { _id: string }, wishlistItemId: string, color?: string, size?: string) => void
  isSelected: boolean
  onToggleSelect: (wishlistItemId: string) => void
}

function WishlistItem({ item, onRemove, onAddToCart, isSelected, onToggleSelect }: WishlistItemProps) {
  const { isLoading: isCartLoading } = useCart()
  const [isAddingToCart, setIsAddingToCart] = React.useState(false)
  
  const handleAddToCartClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsAddingToCart(true)
    try {
      // Pass both productId, wishlist item _id, color, and size so it can be added to cart with variant info
      await onAddToCart(item.productID, item._id, item.color, item.size)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onRemove(item._id)
  }

  const handleCardClick = () => {
    onToggleSelect(item._id)
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
    <div 
      className={`bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer border-2 ${
        isSelected 
          ? 'border-blue-500 shadow-blue-100 bg-blue-50/30' 
          : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={handleCardClick}
    >
      {/* Checkbox overlay on image */}
      <div className="relative aspect-square bg-gray-100 group">
        <Link href={`/products/${productId}`} onClick={(e) => e.stopPropagation()}>
          <Image
            src={thumbnailImage}
            alt={productTitle}
            fill
            className={`object-cover transition-opacity ${isSelected ? 'opacity-90' : ''}`}
          />
        </Link>
        
        {/* Selection overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
            <div className="bg-blue-500 text-white rounded-full p-2 shadow-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}

        {/* Checkbox in top-left corner */}
        <div 
          className="absolute top-3 left-3 z-10 bg-white/95 backdrop-blur-sm rounded-md p-1.5 shadow-md hover:bg-white transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onToggleSelect(item._id)}
            aria-label={`Select ${productTitle}`}
            className="w-5 h-5"
          />
        </div>
      </div>
      
      <div className="p-4">
        <Link href={`/products/${productId}`} onClick={(e) => e.stopPropagation()}>
          <h3 className={`font-semibold mb-2 line-clamp-2 transition-colors ${
            isSelected 
              ? 'text-blue-700' 
              : 'text-gray-900 hover:text-blue-600'
          }`}>
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

        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="outline"
            size="sm"
            className={`flex-1 ${isSelected ? 'border-blue-500 text-blue-600 hover:bg-blue-50' : ''}`}
            onClick={handleAddToCartClick}
            disabled={isAddingToCart || isCartLoading}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            {isAddingToCart || isCartLoading ? 'Adding...' : 'Add to Cart'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRemoveClick}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

