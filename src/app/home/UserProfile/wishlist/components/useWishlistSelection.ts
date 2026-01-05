"use client"

import { useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import type { WishlistProduct } from '../types'

type AddToCartOptions =
  | boolean
  | {
      skipModal?: boolean;
      silent?: boolean;
    };

type UseWishlistSelectionArgs = {
  wishlistItems: WishlistProduct[]
  addToCart: (productId: string, quantity?: number, options?: AddToCartOptions) => Promise<void>
  refreshWishlist: () => Promise<void>
  removeFromLocal: (ids: string[]) => void
}

export function useWishlistSelection({ wishlistItems, addToCart, refreshWishlist, removeFromLocal }: UseWishlistSelectionArgs) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isAddingSelected, setIsAddingSelected] = useState(false)

  const handleToggleSelect = (wishlistItemId: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev)
      if (next.has(wishlistItemId)) next.delete(wishlistItemId)
      else next.add(wishlistItemId)
      return next
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedItems(new Set(wishlistItems.map(i => i._id)))
    else setSelectedItems(new Set())
  }

  const deselect = (wishlistItemId: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev)
      next.delete(wishlistItemId)
      return next
    })
  }

  const handleAddSelectedToCart = async () => {
    if (selectedItems.size === 0) {
      toast.error('Please select at least one item to add to cart')
      return
    }

    setIsAddingSelected(true)
    const ids = Array.from(selectedItems)
    const removedIds: string[] = []
    let successCount = 0
    let failCount = 0

    try {
      for (const wishlistItemId of ids) {
        const item = wishlistItems.find(w => w._id === wishlistItemId)
        if (!item) continue

        try {
          const productId = typeof item.productID === 'object' ? item.productID._id : item.productID
          if (!productId) {
            failCount++
            continue
          }

          await addToCart(productId, 1, { 
            skipModal: true, 
            silent: true,
            color: item.color || undefined,
            size: item.size || undefined
          })

          try {
            const res = await axios.delete(`/api/v1/wishlist/${wishlistItemId}`)
            if (res.data.success) {
              successCount++
              removedIds.push(wishlistItemId)
            } else {
              failCount++
            }
          } catch {
            successCount++
            removedIds.push(wishlistItemId)
          }
        } catch (e) {
          console.error('Error adding wishlist item to cart:', e)
          failCount++
        }
      }

      setSelectedItems(new Set())
      // Optimistically update local UI
      if (removedIds.length > 0) {
        removeFromLocal(removedIds)
      }
      await refreshWishlist()

      if (successCount > 0 && failCount === 0) {
        toast.success(`Successfully added ${successCount} item${successCount > 1 ? 's' : ''} to cart`, {
          description: 'Items have been moved to your shopping cart',
          duration: 3000,
        })
      } else if (successCount > 0 && failCount > 0) {
        toast.warning(`Added ${successCount} item${successCount > 1 ? 's' : ''} to cart`, {
          description: `${failCount} item${failCount > 1 ? 's' : ''} failed to add`,
          duration: 4000,
        })
      } else {
        toast.error('Failed to add selected items to cart')
      }
    } finally {
      setIsAddingSelected(false)
    }
  }

  const isAllSelected = wishlistItems.length > 0 && selectedItems.size === wishlistItems.length
  const isSomeSelected = selectedItems.size > 0 && selectedItems.size < wishlistItems.length

  return {
    selectedItems,
    isAddingSelected,
    isAllSelected,
    isSomeSelected,
    handleToggleSelect,
    handleSelectAll,
    handleAddSelectedToCart,
    deselect,
  }
}


