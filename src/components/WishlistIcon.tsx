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
      className={`relative flex flex-col justify-center items-center text-[#00005E] font-medium min-w-fit cursor-pointer ${className}`}
    >
      <div className="relative flex flex-col items-center gap-0.5 group">
        <div className="p-1 group-hover:bg-blue-50 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 lg:size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </div>

        {showCount && wishlistCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {wishlistCount > 99 ? '99+' : wishlistCount}
          </span>
        )}
      </div>
      <span className="text-[#00005E] text-[10px] lg:text-[12px] whitespace-nowrap">Wishlist</span>
    </Link>
  )
}

