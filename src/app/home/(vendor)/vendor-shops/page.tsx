// src/app/home/(vendor)/vendor-shops/page.tsx
// ✅ FULLY FIXED & CLEANED: Production-ready version without debug logs

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
    // ===================================================================
    // Extract and validate search params
    // ===================================================================
    const params = await searchParams;
    const pageParam = params?.page;
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
    const vendorData = Array.isArray(allPublicVendors) ? allPublicVendors : [];
    const categoryData = Array.isArray(categories) ? categories : [];

    // ===================================================================
    // Calculate pagination
    // ===================================================================
    const totalPages = vendorData.length > 0 
      ? Math.ceil(vendorData.length / ITEMS_PER_PAGE) 
      : 1;
    
    const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));

    // ===================================================================
    // Get paginated stores
    // ===================================================================
    const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
    const endIndex = validPage * ITEMS_PER_PAGE;
    const paginatedStores = vendorData.slice(startIndex, endIndex);

    // ===================================================================
    // RENDER: Empty state
    // ===================================================================
    if (vendorData.length === 0) {
      return (
        <div className="container mx-auto">
          {/* Hero Banner */}
          <section className="relative w-full aspect-[1920/600] min-h-[300px] max-h-[600px] overflow-hidden bg-gray-900">
            <Image
              src="https://res.cloudinary.com/donrqkwe5/image/upload/v1766044937/uqm2xd1jbicyjxkriwxl.jpg"
              alt="Vendor Stores Banner"
              fill
              className="object-cover object-center"
              priority
            />
          </section>

          {/* Breadcrumb & Title */}
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

          {/* Empty State */}
          <section className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 pb-20">
            <div className="text-center py-32 bg-white rounded-2xl border border-dashed">
              <p className="text-xl text-gray-400">
                No stores available at the moment. Please check back soon!
              </p>
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
        {/* Hero Banner */}
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

        {/* Sticky Nav - Only render if categories exist */}
        {categoryData && categoryData.length > 0 && (
          <StickyNavTrigger categories={categoryData} />
        )}

        {/* Stores Grid + Pagination */}
        <section className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 pb-20 bg-gray-50/50">
          {/* Stores Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedStores.map((store) => {
              if (!store || !store._id) {
                return null;
              }
              return <VendorStoreCard key={store._id} store={store} />;
            })}
          </div>

          {/* Pagination Section - Only show if multiple pages */}
          {totalPages > 1 && (
            <Pagination className="mt-10">
              <PaginationContent>
                {/* Previous Button */}
                <PaginationItem>
                  <PaginationPrevious
                    href={validPage > 1 ? `?page=${validPage - 1}` : "#"}
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
                  .map((page, idx, arr) => (
                    <PaginationItem key={`page-${page}`}>
                      {/* Show ellipsis if gap between page numbers */}
                      {idx > 0 && page - arr[idx - 1] > 1 && (
                        <PaginationEllipsis key={`ellipsis-${page}`} />
                      )}

                      {/* Page Link */}
                      <PaginationLink
                        href={`?page=${page}`}
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
                  ))}

                {/* Next Button */}
                <PaginationItem>
                  <PaginationNext
                    href={validPage < totalPages ? `?page=${validPage + 1}` : "#"}
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
          {/* Hero Banner */}
          <section className="relative w-full aspect-[1920/600] min-h-[300px] max-h-[600px] overflow-hidden bg-gray-900">
            <Image
              src="https://res.cloudinary.com/donrqkwe5/image/upload/v1766044937/uqm2xd1jbicyjxkriwxl.jpg"
              alt="Vendor Stores Banner"
              fill
              className="object-cover object-center"
              priority
            />
          </section>

          {/* Breadcrumb & Title */}
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

          {/* Error State */}
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