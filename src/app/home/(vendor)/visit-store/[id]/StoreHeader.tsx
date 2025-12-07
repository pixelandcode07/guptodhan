import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { ChevronRight } from 'lucide-react';

type Store = {
    storeLogo: string;
    storeBanner: string;
    storeName: string;
    storeAddress: string;
    storeMetaDescription: string;
};

export default function StoreHeader({ store }: { store: Store }) {
    return (
        <>
            {/* Hero Banner - Mobile & Desktop Responsive */}
            <div className="relative w-full h-[300px] sm:h-[400px] lg:h-96 overflow-hidden rounded-2xl mb-8">
                <Image
                    src={store.storeBanner}
                    alt={store.storeName}
                    fill
                    className="object-cover brightness-50"
                    priority
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-12">
                    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 text-white">
                        {/* Store Logo */}
                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-white shadow-2xl overflow-hidden flex-shrink-0">
                            <Image
                                src={store.storeLogo}
                                alt={store.storeName}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Store Info */}
                        <div className="flex-1">
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 line-clamp-2">
                                {store.storeName}
                            </h1>

                            <div className="flex items-center gap-2 text-base sm:text-lg mb-3">
                                <MapPin className="w-5 h-5 flex-shrink-0" />
                                <span className="line-clamp-1">{store.storeAddress}</span>
                            </div>

                            <p className="text-sm sm:text-base lg:text-lg text-gray-200 line-clamp-2 sm:line-clamp-3 max-w-3xl">
                                {store.storeMetaDescription}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Breadcrumb - Responsive */}
            <div className="px-4 sm:px-6 lg:px-0 mb-6">
                <Breadcrumb>
                    <BreadcrumbList className="flex flex-wrap text-sm sm:text-base">
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/">Home</Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRight className="w-4 h-4" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/home/vendor-shops" className="hidden sm:inline">
                                    Vendor Stores
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/home/vendor-shops" className="sm:hidden">
                                    Stores
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator>
                            <ChevronRight className="w-4 h-4" />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>
                            <BreadcrumbPage className="max-w-48 sm:max-w-none truncate">
                                {store.storeName}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
        </>
    );
}