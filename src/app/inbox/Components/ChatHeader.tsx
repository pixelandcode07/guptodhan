'use client';
import Image from 'next/image';
import { MapPin } from 'lucide-react';

export default function ChatHeader() {
  return (
    <div className="flex items-center gap-3 p-4 border-b bg-white">
      <div className="w-16 h-16 bg-gray-200 rounded-md relative">
        <Image
          src="/img/product/p-1.png"
          alt="Product"
          fill
          className="object-cover rounded-md"
        />
      </div>
      <div>
        <h3 className="text-sm font-medium">iPhone 13 Pro Max</h3>
        <p className="text-blue-600 font-semibold">৳85,000</p>
        <p className="flex items-center text-xs text-gray-500 gap-1">
          <MapPin size={12} /> Dhanmondi, Dhaka
        </p>
        <span className="text-xs text-gray-400">2 hours ago</span>
      </div>
    </div>
  );
}
