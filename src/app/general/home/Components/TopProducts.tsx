'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { MoreHorizontal } from "lucide-react";

interface Product {
  name: string;
  image: string;
  totalSold: number;
  revenue: number;
}

export default function TopProducts({ products = [] }: { products: Product[] }) {
  
  return (
    <Card className="border-0 shadow-sm bg-white rounded-2xl h-full">
      {/* --- Header --- */}
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold text-gray-900">Top selling products</CardTitle>
        <button className="p-2 hover:bg-gray-50 rounded-full transition text-gray-400">
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="space-y-6">
          {products && products.length > 0 ? (
            products.slice(0, 5).map((product, index) => {
              // Calculate Unit Price estimate for display (Revenue / Sold)
              const avgPrice = product.totalSold > 0 ? (product.revenue / product.totalSold) : 0;

              return (
                <div key={index} className="flex items-center justify-between group">
                  
                  {/* Left Side: Image & Name */}
                  <div className="flex items-center gap-4">
                    {/* Image Container */}
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                      <Image
                        src={product.image || '/placeholder-product.jpg'} // ফলব্যাক ইমেজ নিশ্চিত করুন
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    
                    {/* Product Info */}
                    <div>
                      <p className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">
                        ৳{avgPrice.toFixed(0)} <span className="text-gray-300">|</span> In Stock
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Sales Count */}
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {product.totalSold} <span className="text-gray-500 font-normal text-xs">Sales</span>
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                <span className="text-xl">🛍️</span>
              </div>
              <p className="text-sm font-medium text-gray-900">No products found</p>
              <p className="text-xs text-gray-500">Sales data will appear here.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}