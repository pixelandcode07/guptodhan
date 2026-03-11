// app/search/page.tsx
import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Search Results',
}

export default async function SearchPage({
    searchParams,
}: {
    searchParams: { q?: string }
}) {
    const query = searchParams.q || ''
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/product/liveSearch?q=${encodeURIComponent(query)}&type=results`,
        { cache: 'no-store' }
    )
    const result = await res.json()

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6">
                Search Results for: <span className="text-blue-600">"{query}"</span>
            </h1>

            {result.success && result.data.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {result.data.map((product: any) => (
                        <Link href={`/product/${product.slug}`} key={product._id}>
                            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                                <img src={product.thumbnailImage || product.productImage} alt="" className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="font-semibold truncate">{product.productTitle}</h3>
                                    <p className="text-sm text-gray-600 mt-1">{product.vendorStoreId?.storeName}</p>
                                    <p className="text-lg font-bold text-green-600 mt-2">₹{product.discountPrice || product.productPrice}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 text-lg">No products found.</p>
            )}
        </div>
    )
}