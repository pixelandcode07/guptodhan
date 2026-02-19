"use client"

import { useState, useMemo, useCallback, useEffect } from 'react'
import type { CartItem } from '../ShoppingCartContent'

type UseCartSelectionArgs = {
  cartItems: CartItem[]
}

export function useCartSelection({ cartItems }: UseCartSelectionArgs) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize: select all items by default (only once)
  useEffect(() => {
    if (!isInitialized && cartItems.length > 0) {
      setSelectedItems(new Set(cartItems.map(item => item.id)))
      setIsInitialized(true)
    } else if (cartItems.length === 0) {
      // Reset when cart is empty
      setSelectedItems(new Set())
      setIsInitialized(false)
    } else {
      // Remove items that no longer exist in cart
      setSelectedItems(prev => {
        const cartItemIds = new Set(cartItems.map(item => item.id))
        const filtered = new Set([...prev].filter(id => cartItemIds.has(id)))
        return filtered
      })
    }
  }, [cartItems, isInitialized])

  const handleToggleSelect = useCallback((itemId: string) => {
    setSelectedItems(prev => {
      const next = new Set(prev)
      if (next.has(itemId)) {
        next.delete(itemId)
      } else {
        next.add(itemId)
      }
      return next
    })
  }, [])

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(cartItems.map(item => item.id)))
    } else {
      setSelectedItems(new Set())
    }
  }, [cartItems])

  const selectedCartItems = useMemo(() => {
    return cartItems.filter(item => selectedItems.has(item.id))
  }, [cartItems, selectedItems])

  const isAllSelected = cartItems.length > 0 && selectedItems.size === cartItems.length
  const isSomeSelected = selectedItems.size > 0 && selectedItems.size < cartItems.length

  // Calculate totals for selected items only
  const selectedSubtotal = useMemo(() => {
    return selectedCartItems.reduce(
      (sum, item) => sum + (item.product.price * item.product.quantity),
      0
    )
  }, [selectedCartItems])

  const selectedTotalSavings = useMemo(() => {
    return selectedCartItems.reduce(
      (sum, item) => sum + ((item.product.originalPrice - item.product.price) * item.product.quantity),
      0
    )
  }, [selectedCartItems])

  const selectedTotalItems = useMemo(() => {
    return selectedCartItems.reduce(
      (sum, item) => sum + item.product.quantity,
      0
    )
  }, [selectedCartItems])

  return {
    selectedItems,
    selectedCartItems,
    isAllSelected,
    isSomeSelected,
    handleToggleSelect,
    handleSelectAll,
    selectedSubtotal,
    selectedTotalSavings,
    selectedTotalItems,
  }
}

