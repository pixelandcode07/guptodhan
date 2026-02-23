'use client';

import React from 'react';
import Link from 'next/link';
import { Handbag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

interface CartIconProps {
  className?: string;
  showCount?: boolean;
}

export default function CartIcon({ className = '', showCount = true }: CartIconProps) {
  const { cartItemCount } = useCart();

  return (
    // <Link
    //   href="/home/products/shopping-cart"
    //   className={`relative flex flex-col justify-center items-center text-[#00005E] font-medium cursor-pointer ${className}`}
    // >
    <Link
      href="/home/products/shopping-cart"
      className={`relative flex flex-col justify-center items-center text-[#00005E] font-medium min-w-fit cursor-pointer ${className}`}
    >
      <div className="relative flex flex-col items-center gap-0.5 group">
        <div className="p-1 group-hover:bg-blue-50 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 lg:size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </div>

        {showCount && cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {cartItemCount > 99 ? '99+' : cartItemCount}
          </span>
        )}
      </div>
      {/* <span className="text-[#00005E] text-[10px] lg:text-[12px] whitespace-nowrap">Cart</span> */}
      <span className="text-[#00005E] text-[10px] lg:text-[12px] whitespace-nowrap">Cart</span>
    </Link>
  );
}
