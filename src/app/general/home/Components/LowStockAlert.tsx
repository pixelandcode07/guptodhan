import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function LowStockAlert({ products }: { products: any[] }) {
  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-md overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-gray-100">
        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-red-100/50 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          Low Stock Alerts
        </CardTitle>
        <span className="text-xs font-bold px-3 py-1.5 bg-red-100 text-red-700 rounded-full border border-red-200">
          {products.length} Items
        </span>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="space-y-4">
          {products && products.length > 0 ? (
            products.slice(0, 5).map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50/50 transition-colors duration-200 group">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                    <Image 
                      src={product.thumbnailImage || '/placeholder-product.jpg'} 
                      alt={product.productTitle} 
                      fill 
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {product.productTitle}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Price: <span className="font-bold text-slate-900">৳{product.productPrice}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className={`px-3 py-1.5 rounded-lg font-bold text-sm ${
                    product.stock <= 5 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {product.stock} left
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="p-3 bg-green-100/50 rounded-full mb-3">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-semibold text-green-700">All products well stocked!</p>
              <p className="text-xs text-green-600/70 mt-1">Great inventory management</p>
            </div>
          )}
        </div>

        {products.length > 0 && (
          <Link 
            href="/products/low-stock" 
            className="mt-4 w-full py-2 bg-gradient-to-r from-red-500/10 to-orange-500/10 text-red-600 rounded-lg text-sm font-bold hover:from-red-500/20 hover:to-orange-500/20 transition-all duration-200 block text-center"
          >
            View All Low Stock Products →
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
