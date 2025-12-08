import VendorStoreCard from "@/components/ReusableComponents/VendorStoreCard";
import StickyNavTrigger from "../components/StickyNavTrigger";
import { fetchNavigationCategoryData } from "@/lib/MainHomePage";
import { fetchAllPublicStores } from "@/lib/MultiVendorApis/fetchAllStore";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ITEMS_PER_PAGE = 6;

interface VendorShopsPageProps {
    searchParams: Promise<{ page?: string }>;
}

export default async function VendorShopsPage({ searchParams }: VendorShopsPageProps) {
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;
    const [allPublicVendors, categories] = await Promise.all([
        fetchAllPublicStores(),
        fetchNavigationCategoryData(),
    ]);

    const totalPages = Math.ceil(allPublicVendors.length / ITEMS_PER_PAGE);
    const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));

    const paginatedStores = allPublicVendors.slice(
        (validPage - 1) * ITEMS_PER_PAGE,
        validPage * ITEMS_PER_PAGE
    );

    return (
        <>
            {/* Hero Banner */}
            <section className="relative h-96 md:h-[520px] w-full overflow-hidden">
                <Image
                    src="https://res.cloudinary.com/donrqkwe5/image/upload/v1764791110/stores/banner/v2vz7iq1y6vgwumazixs.jpg"
                    alt="Discover Vendor Stores"
                    fill
                    className="object-cover brightness-75"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-6">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl">
                        Discover Vendor Stores
                    </h1>
                    <p className="text-lg md:text-2xl max-w-4xl drop-shadow-lg">
                        Explore trusted sellers and shop directly from the best stores
                    </p>
                </div>
            </section>

            {/* Breadcrumb */}
            <div className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 py-8">
                <Breadcrumb>
                    <BreadcrumbList className="flex items-center gap-2 text-sm md:text-base">
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link href="/" className="flex items-center gap-2 hover:text-[#0097E9]">
                                    <Home size={18} />
                                    Home
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className="font-medium text-gray-900">
                                Vendor Stores
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Sticky Nav */}
            <StickyNavTrigger categories={categories} />

            {/* Stores Grid + Pagination */}
            <section className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 pb-20 bg-gray-50">
                {allPublicVendors.length === 0 ? (
                    <div className="text-center py-32">
                        <p className="text-xl text-gray-500">No stores available yet.</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-12">
                            {paginatedStores.map((store) => (
                                <VendorStoreCard key={store._id} store={store} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Pagination className="mt-10">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={`?page=${validPage - 1}`}
                                            className={validPage <= 1 ? "pointer-events-none opacity-50" : "hover:text-[#0097E9]"}
                                        />
                                    </PaginationItem>

                                    {/* Show first page */}
                                    {validPage > 3 && (
                                        <>
                                            <PaginationItem>
                                                <PaginationLink href="?page=1">1</PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationEllipsis />
                                            </PaginationItem>
                                        </>
                                    )}

                                    {/* Show pages around current */}
                                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                                        .filter((page) => page === 1 || page === totalPages || Math.abs(page - validPage) <= 2)
                                        .map((page, idx, arr) => (
                                            <PaginationItem key={page}>
                                                {idx > 0 && page - arr[idx - 1] > 1 && <PaginationEllipsis />}
                                                <PaginationLink
                                                    href={`?page=${page}`}
                                                    isActive={page === validPage}
                                                    className={page === validPage ? "bg-[#0097E9] text-white hover:bg-[#0097E9]/90" : ""}
                                                >
                                                    {page}
                                                </PaginationLink>
                                            </PaginationItem>
                                        ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            href={`?page=${validPage + 1}`}
                                            className={validPage >= totalPages ? "pointer-events-none opacity-50" : "hover:text-[#0097E9]"}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </>
                )}
            </section>
        </>
    );
}