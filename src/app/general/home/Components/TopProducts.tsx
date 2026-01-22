'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ShoppingBag } from "lucide-react";
import Image from "next/image";

interface Product {
  name: string;
  image: string;
  totalSold: number;
  revenue: number;
}

export function TopProducts({ products = [] }: { products: Product[] }) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-md overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-orange-100/50 rounded-lg">
            <TrendingUp className="w-5 h-5 text-orange-600" />
          </div>
          Top Selling Products
        </CardTitle>
        <span className="text-xs font-bold px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full border border-orange-200">
          Top 5
        </span>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-4">
          {products && products.length > 0 ? (
            products.slice(0, 5).map((product, index) => {
              const avgPrice = product.totalSold > 0 ? (product.revenue / product.totalSold) : 0;
              const rank = index + 1;

              return (
                <div key={index} className="group flex items-center justify-between p-3 rounded-lg hover:bg-gradient-to-r hover:from-orange-50/50 hover:to-amber-50/50 transition-all duration-200">
                  
                  {/* Rank Badge */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white mr-3 flex-shrink-0 ${
                    rank === 1 ? 'bg-gradient-to-br from-yellow-500 to-yellow-600' :
                    rank === 2 ? 'bg-gradient-to-br from-gray-400 to-gray-500' :
                    rank === 3 ? 'bg-gradient-to-br from-orange-600 to-orange-700' :
                    'bg-gradient-to-br from-blue-500 to-blue-600'
                  }`}>
                    {rank}
                  </div>

                  {/* Image & Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0 group-hover:shadow-md transition-shadow">
                      <Image
                        src={product.image || '/placeholder-product.jpg'}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
                        {product.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        ৳{avgPrice.toFixed(0)} <span className="text-gray-300">•</span> <span className="font-semibold text-slate-700">{product.totalSold} sold</span>
                      </p>
                    </div>
                  </div>

                  {/* Sales Badge */}
                  <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                    <ShoppingBag className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-bold text-slate-900">
                      ৳{(product.revenue / 1000).toFixed(0)}k
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShoppingBag className="w-8 h-8 text-gray-300 mb-3" />
              <p className="text-sm font-semibold text-gray-900">No sales data yet</p>
              <p className="text-xs text-gray-500 mt-1">Sales will appear here</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
