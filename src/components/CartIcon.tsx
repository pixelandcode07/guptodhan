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
    <Link 
      href="/home/product/shopping-cart" 
      className={`relative flex flex-col justify-center items-center font-medium cursor-pointer hover:opacity-80 transition-opacity ${className}`}
    >
      <div className="relative">
        <Handbag className="w-6 h-6" />
        {showCount && cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
            {cartItemCount > 99 ? '99+' : cartItemCount}
          </span>
        )}
      </div>
      <span className="text-[12px]">Cart</span>
    </Link>
  );
}
