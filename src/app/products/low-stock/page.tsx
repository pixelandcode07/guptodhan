import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AlertTriangle, Package, ArrowLeft, Edit, ExternalLink } from 'lucide-react';

// ✅ Force dynamic rendering to always show fresh stock data
export const dynamic = 'force-dynamic';

async function getLowStockProducts() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        
        // Fetching products (limit 1000 to cover inventory check)
        const res = await fetch(`${baseUrl}/api/v1/public/product?limit=1000`, { 
            cache: 'no-store' 
        });
        
        if (!res.ok) return [];
        const data = await res.json();
        const products = data?.data?.products || [];
        
        // ✅ Filter out products with stock <= 10 (Low Stock Threshold)
        return products
            .filter((p: any) => typeof p.stock === 'number' && p.stock <= 10)
            .sort((a: any, b: any) => a.stock - b.stock); // Show lowest stock first
            
    } catch (error) {
        console.error("Error fetching low stock products:", error);
        return [];
    }
}

export default async function LowStockProductsPage() {
    const products = await getLowStockProducts();

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* ── HEADER SECTION ── */}
            <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-20">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3.5 bg-red-100 rounded-xl shadow-inner border border-red-200">
                            <AlertTriangle className="w-7 h-7 text-red-600" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Low Stock Inventory</h1>
                            <p className="text-sm font-medium text-gray-500 mt-0.5">
                                Products that need immediate restocking (10 or fewer items left)
                            </p>
                        </div>
                    </div>
                    
                    <Link 
                        href="/general/home" 
                        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:text-blue-600 transition-all font-semibold text-sm shadow-sm"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                        {products.map((product: any) => (
                            <div 
                                key={product._id} 
                                className="bg-white rounded-2xl border border-red-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-red-300 transition-all group flex flex-col relative"
                            >
                                {/* Stock Badge */}
                                <div className="absolute top-3 left-3 z-10">
                                    <span className={`px-3 py-1 rounded-full text-xs font-black shadow-md border ${
                                        product.stock === 0 
                                            ? 'bg-red-600 text-white border-red-700' 
                                            : 'bg-red-100 text-red-800 border-red-200'
                                    }`}>
                                        {product.stock === 0 ? 'OUT OF STOCK' : `${product.stock} LEFT IN STOCK`}
                                    </span>
                                </div>

                                {/* Image Section */}
                                <div className="relative aspect-square bg-gray-50/80 p-6 overflow-hidden">
                                    <Image 
                                        src={product.thumbnailImage || '/img/demo_products_img.png'}
                                        alt={product.productTitle}
                                        fill
                                        className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 p-6"
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                    />
                                    
                                    {/* View Live Product Button */}
                                    <Link 
                                        href={`/product/${product.slug || product._id}`}
                                        target="_blank"
                                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-gray-500 hover:text-blue-600 hover:bg-white shadow-sm transition-all opacity-0 group-hover:opacity-100"
                                        title="View Live Product"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </div>

                                {/* Details Section */}
                                <div className="p-5 flex flex-col flex-1 border-t border-gray-100">
                                    <h3 className="font-bold text-gray-800 line-clamp-2 mb-3 text-sm leading-snug group-hover:text-blue-600 transition-colors">
                                        {product.productTitle}
                                    </h3>
                                    
                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-dashed border-gray-200">
                                        <div>
                                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">Price</p>
                                            <p className="font-black text-gray-900 text-base">
                                                ৳{(product.discountPrice || product.productPrice)?.toLocaleString()}
                                            </p>
                                        </div>
                                        
                                        {/* Action Button: Edit Product */}
                                        <Link 
                                            href={`/general/edit/product/${product._id}`}
                                            className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-xs font-bold shadow-sm"
                                        >
                                            <Edit className="w-3.5 h-3.5" />
                                            Update
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    /* ── EMPTY STATE (No Low Stock) ── */
                    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-dashed border-gray-300 shadow-sm mt-8">
                        <div className="p-5 bg-green-50 border border-green-100 rounded-full mb-6 shadow-inner">
                            <Package className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">Inventory looks great! 🎉</h2>
                        <p className="text-gray-500 text-sm font-medium max-w-md text-center leading-relaxed">
                            You currently don't have any products running low on stock. All your products are well stocked and ready to sell.
                        </p>
                        <Link 
                            href="/general/view/all/product" 
                            className="mt-8 px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                        >
                            View All Products
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}