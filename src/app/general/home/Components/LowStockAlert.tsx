import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import Image from "next/image";

export default function LowStockAlert({ products }: { products: any[] }) {
  return (
    <Card className="shadow-sm border border-red-100 bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-2">
          <AlertTriangle className="text-red-500 w-5 h-5" />
          Low Stock Alerts
        </CardTitle>
        <span className="text-xs font-medium px-2 py-1 bg-red-100 text-red-600 rounded-full">
          Action Needed
        </span>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={index} className="flex items-center justify-between border-b border-gray-50 last:border-0 pb-3 last:pb-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 relative rounded-md overflow-hidden bg-gray-100">
                    <Image src={product.thumbnailImage} alt="img" fill className="object-cover" />
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-700 line-clamp-1">{product.productTitle}</p>
                    <p className="text-xs text-gray-500">Price: ৳{product.productPrice}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-red-600">{product.stock} left</p>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <p className="text-sm text-green-600 text-center py-4">All products are well stocked! 🎉</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}