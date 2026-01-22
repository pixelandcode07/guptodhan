import { IServiceCategory } from "@/types/ServiceCategoryType";
import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({ item }: { item: IServiceCategory }) {
    return (
        <Link
            href={`/services/${item.slug}`}
            className="group relative flex items-center gap-4 rounded-full border border-sky-900 bg-sky-300 px-2 py-2 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
            {/* Icon Circle */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white transition-transform duration-300 group-hover:scale-110">
                <Image
                    src={item.icon_url}
                    alt={item.name}
                    width={28}
                    height={28}
                    className="object-contain rounded-full"
                />
            </div>

            {/* Text */}
            <span className="text-sm font-semibold uppercase tracking-wide text-black md:text-base">
                {item.name}
            </span>
        </Link>
    );
}
