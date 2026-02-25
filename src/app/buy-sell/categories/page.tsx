import { fetchAllBuySellData } from '@/lib/BuyandSellApis/fetchAllBuySellData';
import Image from 'next/image';
import Link from 'next/link';

export default async function BuySellCategories() {
    const allCategory = await fetchAllBuySellData();
    return (
        <div className="px-5 py-3 mb-20">
            {/* Scrollable Container */}
            <div className="grid grid-cols-2 gap-5 overflow-y-auto scrollbar-hide space-y-3">
                {allCategory?.map((cat) => (
                    <Link
                        key={cat._id}
                        href={`/buy-sell/buy-sell/category/category-items/${cat._id}`}
                        className="group flex flex-col justify-center items-center gap-3 p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all cursor-pointer"
                    >
                        <div className="flex shrink-0">
                            <Image
                                src={cat.icon || '/placeholder.png'}
                                alt={cat.name}
                                width={40}
                                height={40}
                                className="object-contain group-hover:scale-110 transition-transform"
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center min-w-0 flex-1">
                            <span className="font-medium text-gray-800 text-sm truncate">{cat.name}</span>
                            <span className="text-xs text-gray-500">{cat.adCount ?? 0} ads</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
