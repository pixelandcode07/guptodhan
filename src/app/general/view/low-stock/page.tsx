import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle, Edit, ArrowLeft, PackageSearch } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getLowStockProducts() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        
        const res = await fetch(`${baseUrl}/api/v1/public/product?limit=1000`, { 
            cache: 'no-store' 
        });
        
        if (!res.ok) return [];
        const data = await res.json();
        const products = data?.data?.products || [];
        
        // Filter out products with stock <= 10
        return products
            .filter((p: any) => typeof p.stock === 'number' && p.stock <= 10)
            .sort((a: any, b: any) => a.stock - b.stock);
            
    } catch (error) {
        console.error("Error fetching low stock products:", error);
        return [];
    }
}

export default async function LowStockAdminPage() {
    const products = await getLowStockProducts();

    return (
        <div className="p-4 md:p-6 w-full max-w-full overflow-x-hidden">
            
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 md:p-5 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-50 border border-red-100 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Low Stock Inventory</h1>
                        <p className="text-sm text-gray-500">Products with 10 or fewer items in stock</p>
                    </div>
                </div>
                <Link 
                    href="/general/home" 
                    className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 hover:text-blue-600 transition-colors text-sm font-semibold shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden w-full">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300">
                    <table className="w-full text-left text-sm text-gray-600 min-w-[800px]">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-700">
                            <tr>
                                <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-xs">Product Details</th>
                                <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-xs">Category</th>
                                <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-xs">Price</th>
                                <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-xs text-center">Stock Status</th>
                                <th className="px-4 py-3.5 font-bold uppercase tracking-wider text-xs text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.length > 0 ? (
                                products.map((product: any) => (
                                    <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 relative rounded bg-gray-100 border border-gray-200 flex-shrink-0 p-1">
                                                    <Image 
                                                        src={product.thumbnailImage || '/img/demo_products_img.png'} 
                                                        alt={product.productTitle} 
                                                        fill 
                                                        className="object-contain mix-blend-multiply"
                                                        sizes="48px"
                                                    />
                                                </div>
                                                <p className="font-semibold text-gray-800 line-clamp-2 max-w-[300px]">
                                                    {product.productTitle}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-600">
                                            {product.category?.name || 'N/A'}
                                        </td>
                                        <td className="px-4 py-3 font-bold text-gray-800">
                                            ৳{(product.discountPrice || product.productPrice)?.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-bold border ${
                                                product.stock === 0 
                                                    ? 'bg-red-50 text-red-700 border-red-200' 
                                                    : 'bg-orange-50 text-orange-700 border-orange-200'
                                            }`}>
                                                {product.stock === 0 ? 'Out of Stock' : `${product.stock} Left`}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Link 
                                                href={`/general/edit/product/${product._id}`}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-md hover:bg-blue-600 hover:text-white transition-colors text-xs font-bold shadow-sm"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                                Update Stock
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <PackageSearch className="w-12 h-12 text-gray-300 mb-3" />
                                            <p className="text-lg font-semibold text-gray-700">No Low Stock Products</p>
                                            <p className="text-sm mt-1">All your products are currently well-stocked!</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}