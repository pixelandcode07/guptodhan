import { IServiceCategory } from "@/types/ServiceCategoryType";
import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({ item }: { item: IServiceCategory }) {
    return (
        <Link
            href={`/services/${item.slug}`}
            className="group flex w-full items-stretch overflow-hidden rounded-xl border border-sky-400 bg-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
        >
            {/* Left Side: Icon Container (White Background) */}
            <div className="flex w-16 shrink-0 items-center justify-center bg-white px-2">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-110">
                    <Image
                        src={item.icon_url}
                        alt={item.name}
                        width={40}
                        height={40}
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>

            {/* Right Side: Text Container (Blue Background) */}
            <div className="flex grow items-center justify-center bg-sky-300 px-4 py-3">
                <span className="text-lg font-semibold uppercase tracking-wide text-white">
                    {item.name}
                </span>
            </div>
        </Link>
    );
}