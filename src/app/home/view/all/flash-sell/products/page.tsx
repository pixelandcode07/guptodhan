
import { fetchFlashSaleData } from '@/lib/MainHomePage';
import { generateGuptodhanMetadata } from '@/lib/metadata/generateGuptodhanMetadata';
import { ProductCardType } from '@/types/ProductCardType';
import Image from 'next/image'
import Link from 'next/link';

export async function generateMetadata() {
    return generateGuptodhanMetadata({
        title: "Flash Sell | Guptodhan",
        description:
            "Buy and sell new or used items in your city. Explore verified ads across electronics, vehicles, real estate, fashion, and more — only on Guptodhan.",
        urlPath: "/home/view/all/flash-sell/products",
        imageUrl: "/og-images/guptodhan-marketplace-banner.jpg",
    })
}

export default async function FlashProductsPage() {
    const flashSaleData: ProductCardType[] = await fetchFlashSaleData();
    return (
        <div className='max-w-7xl mx-auto py-15'>
            <h1 className="text-2xl font-bold mb-6">Flash Sell</h1>

            <div className="grid justify-center items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 px-4">
                {flashSaleData?.map((item) => (
                    <Link href={`/products/${item._id}`} key={item._id}>
                        <div className="bg-white rounded-md border-2 border-gray-200 hover:border-blue-300  overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer">
                            <div className="w-full h-36 flex items-center justify-center overflow-hidden">
                                <Image
                                    src={item.thumbnailImage}
                                    alt={item.productTitle}
                                    width={150}
                                    height={150}
                                    className="p-1 rounded-md w-full h-[20vh] border-b-2 border-gray-200"
                                />
                            </div>

                            <div className="p-2">
                                <h3 className="text-sm font-medium truncate">{item.productTitle}</h3>
                                <p className="text-[#0084CB] font-semibold text-base">₹{item.discountPrice}</p>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs text-gray-500 line-through">₹{item.productPrice}</p>
                                    <p className="text-xs text-red-500">
                                        -{Math.round(((item.productPrice - item.discountPrice) / item.productPrice) * 100)}%
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}


