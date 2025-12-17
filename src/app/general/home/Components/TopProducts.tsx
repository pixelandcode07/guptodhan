import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function TopProducts({ products }: { products: any[] }) {
  return (
    <Card className="shadow-sm border-none bg-white col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">Top Selling Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {products.map((product, index) => (
            <div key={index} className="flex items-center">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                <Image 
                    src={product.image || '/placeholder.png'} 
                    alt={product.name} 
                    fill 
                    className="object-cover" 
                />
              </div>
              <div className="ml-4 flex-1">
                <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                <p className="text-xs text-gray-500">{product.totalSold} items sold</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900">৳{product.revenue.toLocaleString()}</p>
              </div>
            </div>
          ))}
          {products.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No sales data yet.</p>}
        </div>
      </CardContent>
    </Card>
  );
}