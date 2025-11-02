'use client'

import React from 'react'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useWishlist } from '@/contexts/WishlistContext'

interface WishlistIconProps {
  className?: string
  showCount?: boolean
}

export default function WishlistIcon({ className = '', showCount = true }: WishlistIconProps) {
  const { wishlistCount } = useWishlist()

  return (
    <Link 
      href="/home/UserProfile/wishlist" 
      className={`relative flex flex-col justify-center items-center font-medium cursor-pointer hover:opacity-80 transition-opacity ${className}`}
    >
      <div className="relative">
        <Heart className="w-6 h-6" />
        {showCount && wishlistCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {wishlistCount > 99 ? '99+' : wishlistCount}
          </span>
        )}
      </div>
      <span className="text-[12px] text-[#00005E]">Wishlist</span>
    </Link>
  )
}

