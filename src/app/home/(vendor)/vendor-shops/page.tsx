// src/app/home/(vendor)/vendor-shops/page.tsx
// ✅ FULLY FIXED: Complete null safety + error handling + debugging

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
    // ✅ STEP 1: Extract and validate search params
    // ===================================================================
    console.log("\n========== 📄 VendorShopsPage START ==========");

    const params = await searchParams;
    const pageParam = params?.page;
    
    console.log("1️⃣ [searchParams] Raw pageParam:", pageParam);
    console.log("1️⃣ [searchParams] Type:", typeof pageParam);

    const currentPage = pageParam ? Number(pageParam) : 1;
    console.log("1️⃣ [currentPage] Parsed:", currentPage);

    if (isNaN(currentPage) || currentPage < 1) {
      console.warn("⚠️ Invalid page number, defaulting to 1");
    }

    // ===================================================================
    // ✅ STEP 2: Fetch all data (with error handling)
    // ===================================================================
    console.log("\n2️⃣ [DATA FETCH] Starting parallel fetches...");

    let allPublicVendors: any[] = [];
    let categories: any[] = [];

    // ✅ Fetch stores with try-catch
    try {
      console.log("2️⃣ [STORES] Fetching stores...");
      allPublicVendors = await fetchAllPublicStores();
      console.log("2️⃣ [STORES] Fetch complete");
      console.log("   - Type:", typeof allPublicVendors);
      console.log("   - Is Array:", Array.isArray(allPublicVendors));
      console.log("   - Length:", allPublicVendors?.length || 0);
    } catch (error: any) {
      console.error("❌ [STORES] Error:", error?.message);
      allPublicVendors = [];
    }

    // ✅ Fetch categories with try-catch
    try {
      console.log("2️⃣ [CATEGORIES] Fetching categories...");
      categories = await fetchNavigationCategoryData();
      console.log("2️⃣ [CATEGORIES] Fetch complete");
      console.log("   - Type:", typeof categories);
      console.log("   - Is Array:", Array.isArray(categories));
      console.log("   - Length:", categories?.length || 0);
    } catch (error: any) {
      console.error("❌ [CATEGORIES] Error:", error?.message);
      categories = [];
    }

    // ===================================================================
    // ✅ STEP 3: Validate and normalize data
    // ===================================================================
    console.log("\n3️⃣ [VALIDATION] Normalizing data...");

    // ✅ Ensure vendors is always an array
    const vendorData = Array.isArray(allPublicVendors) 
      ? allPublicVendors 
      : [];
    
    console.log("3️⃣ [VENDORS] After validation - Length:", vendorData.length);

    // ✅ Ensure categories is always an array
    const categoryData = Array.isArray(categories) 
      ? categories 
      : [];
    
    console.log("3️⃣ [CATEGORIES] After validation - Length:", categoryData.length);

    // ===================================================================
    // ✅ STEP 4: Calculate pagination
    // ===================================================================
    console.log("\n4️⃣ [PAGINATION] Calculating...");

    const totalPages = vendorData.length > 0 
      ? Math.ceil(vendorData.length / ITEMS_PER_PAGE) 
      : 1;
    
    console.log("4️⃣ [PAGINATION] Total stores:", vendorData.length);
    console.log("4️⃣ [PAGINATION] Items per page:", ITEMS_PER_PAGE);
    console.log("4️⃣ [PAGINATION] Total pages:", totalPages);

    const validPage = Math.max(1, Math.min(currentPage, totalPages || 1));
    console.log("4️⃣ [PAGINATION] Current page (requested):", currentPage);
    console.log("4️⃣ [PAGINATION] Valid page (adjusted):", validPage);

    // ===================================================================
    // ✅ STEP 5: Slice data for current page
    // ===================================================================
    console.log("\n5️⃣ [SLICE] Getting paginated data...");

    const startIndex = (validPage - 1) * ITEMS_PER_PAGE;
    const endIndex = validPage * ITEMS_PER_PAGE;

    console.log("5️⃣ [SLICE] Start index:", startIndex);
    console.log("5️⃣ [SLICE] End index:", endIndex);

    const paginatedStores = vendorData.slice(startIndex, endIndex);
    
    console.log("5️⃣ [SLICE] Paginated stores count:", paginatedStores.length);

    console.log("\n========== ✅ VendorShopsPage READY ==========\n");

    // ===================================================================
    // ✅ RENDER: Empty state
    // ===================================================================
    if (vendorData.length === 0) {
      console.log("📋 [RENDER] No stores - showing empty state");
      
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
    // ✅ RENDER: Main page with stores
    // ===================================================================
    console.log("📋 [RENDER] Showing stores for page", validPage);

    return (
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

        {/* Sticky Nav - Only render if categories exist */}
        {categoryData && categoryData.length > 0 ? (
          <StickyNavTrigger categories={categoryData} />
        ) : (
          console.log("⏭️ [STICKY NAV] Skipping - no categories")
        )}

        {/* Stores Grid + Pagination */}
        <section className="max-w-[95vw] xl:max-w-[90vw] mx-auto px-4 pb-20 bg-gray-50/50">
          {/* Stores Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {paginatedStores.map((store) => {
              if (!store || !store._id) {
                console.warn("⚠️ Invalid store object:", store);
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
    // ===================================================================
    // ❌ ERROR HANDLING
    // ===================================================================
    console.error("\n========== ❌ VendorShopsPage ERROR ==========");
    console.error("Error type:", typeof error);
    console.error("Error message:", (error as any)?.message);
    console.error("Error stack:", (error as any)?.stack);
    console.error("Full error:", error);
    console.error("=============================================\n");

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
              <p className="text-xl text-red-500 mb-2">
                Failed to load stores
              </p>
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