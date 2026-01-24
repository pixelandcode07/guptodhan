// src/app/home/(vendor)/vendor-shops/page.tsx
// ✅ FIXED: Complete null/undefined safety + better error handling

import VendorStoreCard from "@/components/ReusableComponents/VendorStoreCard";
import StickyNavTrigger from "../components/StickyNavTrigger";
import { fetchNavigationCategoryData } from "@/lib/MainHomePage";
import { fetchAllPublicStores } from "@/lib/MultiVendorApis/fetchAllStore";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const ITEMS_PER_PAGE = 6;

interface VendorShopsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function VendorShopsPage({
  searchParams,
}: VendorShopsPageProps) {
  try {
    const { page } = await searchParams;
    const currentPage = Number(page) || 1;

    // ✅ Fetch data with Promise.all
    const [allPublicVendors, categories] = await Promise.all([
      fetchAllPublicStores(),
      fetchNavigationCategoryData(),
    ]);

    // ✅ CRITICAL: Null/Undefined safety checks
    const vendorData = Array.isArray(allPublicVendors) ? allPublicVendors : [];
    const categoryData = Array.isArray(categories) ? categories : [];

    console.log(`📊 [Page] Loading page ${currentPage} with ${vendorData.length} total stores`);

    // ✅ Calculate pagination safely
    const totalPages = vendorData.length > 0 ? Math.ceil(vendorData.length / ITEMS_PER_PAGE) : 1;
    const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));

    // ✅ Get paginated stores
    const paginatedStores = vendorData.slice(
      (validPage - 1) * ITEMS_PER_PAGE,
      validPage * ITEMS_PER_PAGE
    );

    console.log(`📄 [Page] Page ${validPage}/${totalPages} showing ${paginatedStores.length} stores`);

    return (
      <>
        <div className="container mx-auto">
          {/* Hero Banner - Optimized for 1920x600 Image */}
          <section className="relative w-full aspect-[1920/600] min-h-[300px] max-h-[600px] overflow-hidden bg-gray-900">
            <Image
              src="https://res.cloudinary.com/donrqkwe5/image/upload/v1766044937/uqm2xd1jbicyjxkriwxl.jpg"
              alt="Vendor Stores Banner"
              fill
              className="object-cover object-center"
              priority
            />
          </section>

          {/* Breadcrumb & Title Section */}
          <div className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 pt-10 pb-6">
            <Breadcrumb className="mb-4">
              <BreadcrumbList className="flex items-center gap-2 text-sm md:text-base">
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      href="/"
                      className="flex items-center gap-2 hover:text-[#0097E9] transition-colors"
                    >
                      <Home size={18} />
                      Home
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-medium text-gray-900 uppercase tracking-wider">
                    Vendor Stores
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <h1 className="text-3xl md:text-4xl font-extrabold text-[#00005E]">
              Explore Our Trusted Vendor Stores
            </h1>
            <p className="text-gray-500 mt-2">
              Discover quality products directly from our verified sellers.
            </p>
          </div>

          {/* Sticky Nav */}
          {categoryData.length > 0 && (
            <StickyNavTrigger categories={categoryData} />
          )}

          {/* Stores Grid + Pagination */}
          <section className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 pb-20 bg-gray-50/50">
            {vendorData.length === 0 ? (
              // ✅ Empty state
              <div className="text-center py-32 bg-white rounded-2xl border border-dashed">
                <p className="text-xl text-gray-400">
                  No stores available at the moment.
                </p>
              </div>
            ) : (
              <>
                {/* ✅ Stores Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                  {paginatedStores.map((store) => (
                    <VendorStoreCard key={store._id} store={store} />
                  ))}
                </div>

                {/* ✅ Pagination Section - Only show if multiple pages */}
                {totalPages > 1 && (
                  <Pagination className="mt-10">
                    <PaginationContent>
                      {/* Previous Button */}
                      <PaginationItem>
                        <PaginationPrevious
                          href={`?page=${validPage - 1}`}
                          className={
                            validPage <= 1
                              ? "pointer-events-none opacity-40"
                              : "hover:text-[#0097E9] border-none shadow-sm"
                          }
                        />
                      </PaginationItem>

                      {/* Page Numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === totalPages ||
                            Math.abs(page - validPage) <= 1
                        )
                        .map((page, idx, arr) => (
                          <PaginationItem key={page}>
                            {idx > 0 && page - arr[idx - 1] > 1 && (
                              <PaginationEllipsis />
                            )}
                            <PaginationLink
                              href={`?page=${page}`}
                              isActive={page === validPage}
                              className={
                                page === validPage
                                  ? "bg-[#0097E9] text-white hover:bg-[#0097E9]/90 border-none shadow-md"
                                  : "hover:text-[#0097E9] border-none bg-white shadow-sm"
                              }
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                      {/* Next Button */}
                      <PaginationItem>
                        <PaginationNext
                          href={`?page=${validPage + 1}`}
                          className={
                            validPage >= totalPages
                              ? "pointer-events-none opacity-40"
                              : "hover:text-[#0097E9] border-none shadow-sm"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                )}
              </>
            )}
          </section>
        </div>
      </>
    );
  } catch (error) {
    console.error("❌ [VendorShopsPage] Error:", error);

    // ✅ Fallback error UI
    return (
      <div className="container mx-auto">
        <div className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 pt-10 pb-20">
          <div className="text-center py-32 bg-white rounded-2xl border border-dashed">
            <p className="text-xl text-red-500 mb-2">
              Failed to load stores
            </p>
            <p className="text-sm text-gray-400">
              Please refresh the page or try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }
}