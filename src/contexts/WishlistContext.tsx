"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { toast } from 'sonner'
import api from '@/lib/axios'

type WishlistContextType = {
  wishlistCount: number
  refreshWishlist: () => Promise<void>
  addToWishlist: (productId: string) => Promise<boolean>
  removeFromWishlist: (wishlistId: string) => Promise<void>
  isInWishlist: (productId: string) => Promise<boolean>
  getWishlistItemId: (productId: string) => Promise<string | null>
  isLoading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}

type WishlistProviderProps = {
  children: ReactNode
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const { data: session } = useSession()
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Get user ID from session
  const getUserId = (): string | null => {
    const userLike = (session?.user ?? {}) as { id?: string; _id?: string }
    return userLike.id || userLike._id || null
  }

  // Get user info from session
  const getUserInfo = () => {
    const user = session?.user
    return {
      name: user?.name || 'Guest User',
      email: user?.email || 'guest@example.com',
    }
  }

  // Fetch wishlist count
  const refreshWishlist = useCallback(async () => {
    const userId = getUserId()
    if (!userId) {
      setWishlistCount(0)
      return
    }

    try {
      setIsLoading(true)
      const response = await axios.get(`/api/v1/wishlist?userId=${userId}`)
      
      if (response.data.success) {
        const items = response.data.data || []
        setWishlistCount(items.length)
      } else {
        setWishlistCount(0)
      }
    } catch (error) {
      console.error('Error fetching wishlist count:', error)
      setWishlistCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [session])

  // Check if product is in wishlist
  const isInWishlist = useCallback(async (productId: string): Promise<boolean> => {
    const userId = getUserId()
    if (!userId) return false

    try {
      const response = await axios.get(`/api/v1/wishlist?userId=${userId}`)
      if (response.data.success) {
        const items = response.data.data || []
        return items.some((item: { productID: string | { _id: string } }) => {
          const pid = typeof item.productID === 'object' && item.productID !== null
            ? item.productID._id
            : item.productID
          return pid === productId
        })
      }
    } catch (error) {
      console.error('Error checking wishlist:', error)
    }
    return false
  }, [session])

  // Get wishlist item ID by productId
  const getWishlistItemId = useCallback(async (productId: string): Promise<string | null> => {
    const userId = getUserId()
    if (!userId) return null

    try {
      const response = await axios.get(`/api/v1/wishlist?userId=${userId}`)
      if (response.data.success) {
        const items = response.data.data || []
        const item = items.find((item: { productID: string | { _id: string }; _id: string }) => {
          const pid = typeof item.productID === 'object' && item.productID !== null
            ? item.productID._id
            : item.productID
          return pid === productId
        })
        return item?._id || null
      }
    } catch (error) {
      console.error('Error getting wishlist item ID:', error)
    }
    return null
  }, [session])

  // Add to wishlist
  const addToWishlist = useCallback(async (productId: string): Promise<boolean> => {
    const userId = getUserId()
    if (!userId) {
      toast.error('Please login to add items to wishlist')
      return false
    }

    // Check if already in wishlist
    const alreadyInWishlist = await isInWishlist(productId)
    if (alreadyInWishlist) {
      toast.info('Product is already in your wishlist')
      return false
    }

    try {
      setIsLoading(true)
      const userInfo = getUserInfo()
      
      const response = await axios.post('/api/v1/wishlist', {
        userID: userId,
        productID: productId,
        userName: userInfo.name,
        userEmail: userInfo.email,
        wishlistID: `WL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      })

      if (response.data.success) {
        toast.success('Added to wishlist!')
        await refreshWishlist()
        return true
      } else {
        toast.error('Failed to add to wishlist')
        return false
      }
    } catch (error: unknown) {
      console.error('Error adding to wishlist:', error)
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to add to wishlist'
      toast.error(errorMessage)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [session, isInWishlist, refreshWishlist])

  // Remove from wishlist
  const removeFromWishlist = useCallback(async (wishlistId: string) => {
    try {
      setIsLoading(true)
      const response = await axios.delete(`/api/v1/wishlist/${wishlistId}`)
      
      if (response.data.success) {
        toast.success('Removed from wishlist')
        await refreshWishlist()
      } else {
        toast.error('Failed to remove from wishlist')
      }
    } catch (error: unknown) {
      console.error('Error removing from wishlist:', error)
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to remove from wishlist'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [refreshWishlist])

  // Initial load and when session changes
  useEffect(() => {
    if (session?.user) {
      refreshWishlist()
    } else {
      setWishlistCount(0)
    }
  }, [session, refreshWishlist])

  const value: WishlistContextType = {
    wishlistCount,
    refreshWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    getWishlistItemId,
    isLoading,
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

