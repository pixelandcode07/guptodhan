// src/app/home/(vendor)/vendor-shops/page.tsx

import VendorStoreCard from "@/components/ReusableComponents/VendorStoreCard";
import VendorSearch from "@/components/ReusableComponents/VendorSearch";
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
const BANNER_IMAGE = "/vendor_shop.jpg.jpeg";

interface VendorShopsPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function VendorShopsPage({
  searchParams,
}: VendorShopsPageProps) {
  try {
    // ===================================================================
    // Extract and validate search params
    // ===================================================================
    const params = await searchParams;
    const pageParam = params?.page;
    const searchQuery = params?.search?.toLowerCase() || "";
    const currentPage = pageParam ? Number(pageParam) : 1;

    if (isNaN(currentPage) || currentPage < 1) {
      // Default to page 1 if invalid
    }

    // ===================================================================
    // Fetch all data
    // ===================================================================
    let allPublicVendors: any[] = [];
    let categories: any[] = [];

    try {
      allPublicVendors = await fetchAllPublicStores();
    } catch (error: any) {
      console.error("❌ Error fetching stores:", error?.message);
      allPublicVendors = [];
    }

    try {
      categories = await fetchNavigationCategoryData();
    } catch (error: any) {
      console.error("❌ Error fetching categories:", error?.message);
      categories = [];
    }

    // ===================================================================
    // Validate and normalize data
    // ===================================================================
    let vendorData = Array.isArray(allPublicVendors) ? allPublicVendors : [];
    const categoryData = Array.isArray(categories) ? categories : [];

    // ===================================================================
    // Server-side filtering
    // ===================================================================
    if (searchQuery) {
      vendorData = vendorData.filter((store) =>
        store?.storeName?.toLowerCase().includes(searchQuery)
      );
    }

    // ===================================================================
    // Calculate pagination
    // ===================================================================
    const totalPages =
      vendorData.length > 0
        ? Math.ceil(vendorData.length / ITEMS_PER_PAGE)
        : 1;

    const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));

    // ===================================================================
    // Get paginated stores
    // ===================================================================
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
    const endIndex = validPage * ITEMS_PER_PAGE;

    const paginatedStores = vendorData.slice(startIndex, endIndex).map((store) => ({
      ...store,
      isVerified: true,
      verified: true,
    }));

    // Helper: build page URL preserving search query
    const getPageUrl = (page: number) =>
      `?page=${page}${searchQuery ? `&search=${searchQuery}` : ""}`;

    // ===================================================================
    // ✅ SHARED BLOCKS — reused in every render path
    // ===================================================================
    const HeroBanner = (
      <section className="relative w-full aspect-[1920/600] min-h-[300px] max-h-[600px] overflow-hidden bg-gray-900">
        <Image
          src={BANNER_IMAGE}
          alt="Vendor Stores Banner"
          fill
          className="object-cover object-center"
          priority
        />
      </section>
    );

    const PageHeader = (
      <div className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 pt-8 pb-6">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-5">
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

        {/* Title LEFT — Search RIGHT — items-center */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="shrink-0">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#00005E] leading-tight">
              Explore Our Trusted Vendor Stores
            </h1>
            <p className="text-gray-500 mt-1.5 text-sm md:text-base">
              Discover quality products directly from our verified sellers.
            </p>
          </div>
          <div className="w-full md:w-80 lg:w-96 shrink-0">
            <VendorSearch />
          </div>
        </div>
      </div>
    );

    // ===================================================================
    // RENDER: Empty state
    // ===================================================================
    if (vendorData.length === 0) {
      return (
        <div className="container mx-auto">
          {HeroBanner}
          {PageHeader}

          <section className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 pb-20">
            <div className="text-center py-32 bg-white rounded-2xl border border-dashed border-gray-200">
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-xl text-gray-400">
                {searchQuery
                  ? `No stores found matching "${searchQuery}"`
                  : "No stores available at the moment. Please check back soon!"}
              </p>
              {searchQuery && (
                <Link
                  href="/home/vendor-shops?page=1"
                  className="inline-block mt-6 px-6 py-2 bg-[#0097E9] text-white rounded-lg hover:bg-[#007ec5] transition-colors text-sm font-medium"
                >
                  Clear Search
                </Link>
              )}
            </div>
          </section>
        </div>
      );
    }

    // ===================================================================
    // RENDER: Main page with stores
    // ===================================================================
    return (
      <div className="container mx-auto">
        {HeroBanner}
        {PageHeader}

        {/* Sticky Nav */}
        {categoryData && categoryData.length > 0 && (
          <StickyNavTrigger categories={categoryData} />
        )}

        {/* Stores Grid + Pagination */}
        <section className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 pb-20 bg-gray-50/50">
          {/* Stores Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedStores.map((store) => {
              if (!store || !store._id) return null;
              return <VendorStoreCard key={store._id} store={store} />;
            })}
          </div>

          {/* Pagination — only if multiple pages */}
          {totalPages > 1 && (
            <Pagination className="mt-10">
              <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                  <PaginationPrevious
                    href={validPage > 1 ? getPageUrl(validPage - 1) : "#"}
                    className={
                      validPage <= 1
                        ? "pointer-events-none opacity-40 cursor-not-allowed"
                        : "hover:text-[#0097E9] border-none shadow-sm cursor-pointer"
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
                  .flatMap((page, idx, arr) => {
                    const items = [];
                    if (idx > 0 && page - arr[idx - 1] > 1) {
                      items.push(
                        <PaginationItem key={`ellipsis-${page}`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    items.push(
                      <PaginationItem key={`page-${page}`}>
                        <PaginationLink
                          href={getPageUrl(page)}
                          isActive={page === validPage}
                          className={
                            page === validPage
                              ? "bg-[#0097E9] text-white hover:bg-[#0097E9]/90 border-none shadow-md cursor-pointer"
                              : "hover:text-[#0097E9] border-none bg-white shadow-sm cursor-pointer"
                          }
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    );
                    return items;
                  })}

                {/* Next */}
                <PaginationItem>
                  <PaginationNext
                    href={
                      validPage < totalPages ? getPageUrl(validPage + 1) : "#"
                    }
                    className={
                      validPage >= totalPages
                        ? "pointer-events-none opacity-40 cursor-not-allowed"
                        : "hover:text-[#0097E9] border-none shadow-sm cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </section>
      </div>
    );
  } catch (error) {
    console.error("❌ VendorShopsPage Error:", error);

    return (
      <div className="container mx-auto">
        <div className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 pt-10 pb-20">
          <section className="relative w-full aspect-[1920/600] min-h-[300px] max-h-[600px] overflow-hidden bg-gray-900">
            <Image
              src={BANNER_IMAGE}
              alt="Vendor Stores Banner"
              fill
              className="object-cover object-center"
              priority
            />
          </section>

          <div className="pt-10 pb-6">
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
              Oops! Something went wrong
            </h1>
          </div>

          <section className="pb-20">
            <div className="text-center py-32 bg-white rounded-2xl border border-red-200">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <p className="text-xl text-red-500 mb-2">Failed to load stores</p>
              <p className="text-sm text-gray-400 mb-6">
                {(error as any)?.message || "An unexpected error occurred"}
              </p>
              <Link
                href="/home/vendor-shops?page=1"
                className="inline-block px-6 py-2 bg-[#0097E9] text-white rounded-lg hover:bg-[#0097E9]/90 transition-colors"
              >
                Try Again
              </Link>
            </div>
          </section>
        </div>
      </div>
    );
  }
}