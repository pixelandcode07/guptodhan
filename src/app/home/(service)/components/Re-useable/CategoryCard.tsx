import { IServiceCategory } from "@/types/ServiceCategoryType";
import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({ item }: { item: IServiceCategory }) {
    return (
        <Link
            href={`/services/${item.slug}`}
            className="group relative flex flex-col md:flex-row items-center bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.04]"
        >
            <div className="flex-shrink-0 w-20 h-20 flex items-center justify-center bg-gray-50 transition-all duration-300 group-hover:bg-blue-50 group-hover:scale-110">
                <Image
                    src={item.icon_url}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                />
            </div>

            <div className="px-4 py-5 flex-1">
                <h6 className="text-[#00005E] font-semibold text-base leading-tight line-clamp-3">
                    {item.name}
                </h6>
            </div>

            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </Link>
    );
}