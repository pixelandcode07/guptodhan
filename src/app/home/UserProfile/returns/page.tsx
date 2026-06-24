import React from 'react';
import MyReturn from './Components/MyReturns';
import Link from 'next/link'; // ✅ Link ইম্পোর্ট করা হলো
import { ShoppingBag } from 'lucide-react'; // ✅ আইকন ইম্পোর্ট করা হলো

export default function ReturnsPage() {
  return (
    <div className="bg-white rounded-md p-6 pt-0">
      {/* ✅ My Returns Heading এবং Shop Now বাটন */}
      <div className="flex items-center justify-between pt-6 mb-4">
        <h1 className="text-xl font-semibold">My Returns</h1>
        
        <Link 
          href="/products" 
          className="flex items-center gap-2 bg-[#0097E9] hover:bg-[#0097E9]/90 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap"
        >
          <ShoppingBag className="w-4 h-4" />
          Shop Now
        </Link>
      </div>
      
      <MyReturn />
    </div>
  );
}