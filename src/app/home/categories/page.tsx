import { fetchNavigationCategoryData } from '@/lib/MainHomePage';
import Image from 'next/image';
import Link from 'next/link';

export default async function BuySellCategories() {
    const categories = await fetchNavigationCategoryData();
    return (
        <div className="px-5 py-3 mb-20">
            {/* Scrollable Container */}
            <div className="grid grid-cols-2 gap-5 overflow-y-auto scrollbar-hide space-y-3">
                {categories?.map((cat) => (
                    <Link
                        key={cat.mainCategoryId}
                        href={`/category/${cat.slug}`}
                        className="group flex flex-col justify-center items-center gap-3 p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-all cursor-pointer"
                    >
                        <div className="flex shrink-0">
                            <Image
                                src={cat?.categoryIcon || '/placeholder.png'}
                                alt={cat.name}
                                width={40}
                                height={40}
                                className="object-contain group-hover:scale-110 transition-transform"
                            />
                        </div>
                        <div className="flex flex-col justify-center items-center min-w-0 flex-1">
                            <span className="font-medium text-gray-800 text-sm truncate">{cat.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
