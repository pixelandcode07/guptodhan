// src/app/general/view/all/product/page.tsx
// ✅ FIXED: With detailed console logging

import dbConnect from '@/lib/db';
import { VendorProductServices } from '@/lib/modules/product/vendorProduct.service';
import { CategoryServices } from '@/lib/modules/ecommerce-category/services/ecomCategory.service';
import { StoreServices } from '@/lib/modules/vendor-store/vendorStore.service';
import { ProductFlagServices } from '@/lib/modules/product-config/services/productFlag.service';
import ProductTableClient from './components/ProductTableClient';

export const dynamic = 'force-dynamic';

export default async function ViewAllProductsPage() {
  console.log("\n\n");
  console.log("╔═══════════════════════════════════════════════════════════════╗");
  console.log("║  🟢 SERVER: ViewAllProductsPage - START                      ║");
  console.log("╚═══════════════════════════════════════════════════════════════╝");
  
  try {
    console.log("\n📋 [STEP 1] Connecting to database...");
    const dbStartTime = Date.now();
    await dbConnect();
    const dbTime = Date.now() - dbStartTime;
    console.log(`✅ [DB] Connected in ${dbTime}ms\n`);

    console.log("📋 [STEP 2] Fetching all data in parallel...");
    const fetchStartTime = Date.now();

    const [productsResult, categoriesData, storesData, flagsData] = await Promise.all([
      (async () => {
        console.log("  ┌─ Fetching Products...");
        const startTime = Date.now();
        const result = await VendorProductServices.getAllVendorProductsFromDB(1, 999999);
        const time = Date.now() - startTime;
        console.log(`  │  ✅ Got ${result.products.length} products in ${time}ms`);
        console.log(`  │  📊 Pagination: page=${result.pagination.page}, total=${result.pagination.total}, pages=${result.pagination.pages}`);
        console.log(`  └─ Products Complete\n`);
        return result;
      })(),

      (async () => {
        console.log("  ┌─ Fetching Categories...");
        const startTime = Date.now();
        const result = await CategoryServices.getAllCategoriesFromDB();
        const time = Date.now() - startTime;
        console.log(`  │  ✅ Got ${result?.length || 0} categories in ${time}ms`);
        console.log(`  └─ Categories Complete\n`);
        return result;
      })(),

      (async () => {
        console.log("  ┌─ Fetching Stores...");
        const startTime = Date.now();
        const result = await StoreServices.getAllStoresFromDB();
        const time = Date.now() - startTime;
        console.log(`  │  ✅ Got ${result?.length || 0} stores in ${time}ms`);
        console.log(`  └─ Stores Complete\n`);
        return result;
      })(),

      (async () => {
        console.log("  ┌─ Fetching Flags...");
        const startTime = Date.now();
        const result = await ProductFlagServices.getAllProductFlagsFromDB();
        const time = Date.now() - startTime;
        console.log(`  │  ✅ Got ${result?.length || 0} flags in ${time}ms`);
        console.log(`  └─ Flags Complete\n`);
        return result;
      })(),
    ]);

    const totalFetchTime = Date.now() - fetchStartTime;
    console.log(`⏱️  [TIMING] Total fetch time: ${totalFetchTime}ms\n`);

    console.log("📋 [STEP 3] Processing data...");
    const productsArray = productsResult?.products || [];
    console.log(`  ✅ Extracted ${productsArray.length} products from result`);
    console.log(`  ✅ Categories: ${categoriesData?.length || 0}`);
    console.log(`  ✅ Stores: ${storesData?.length || 0}`);
    console.log(`  ✅ Flags: ${flagsData?.length || 0}\n`);

    console.log("📋 [STEP 4] Serializing for client...");
    const initialData = {
      products: JSON.parse(JSON.stringify(productsArray)), 
      categories: JSON.parse(JSON.stringify(categoriesData || [])),
      stores: JSON.parse(JSON.stringify(storesData || [])),
      flags: JSON.parse(JSON.stringify(flagsData || [])),
    };
    console.log(`  ✅ Serialization complete\n`);

    console.log("╔═══════════════════════════════════════════════════════════════╗");
    console.log("║  🟢 SERVER: ViewAllProductsPage - SUCCESS                    ║");
    console.log("║  📊 Total Products to Display: " + productsArray.length.toString().padEnd(34) + "║");
    console.log("╚═══════════════════════════════════════════════════════════════╝");
    console.log("\n");

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  All Products
                </h1>
                <p className="text-sm text-green-600 mt-1 font-semibold">
                  ✅ Total Products Loaded: {productsArray.length}
                </p>
              </div>
            </div>
          </div>
          
          {/* Client Component with Instant Data */}
          <ProductTableClient initialData={initialData} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("\n\n");
    console.error("╔═══════════════════════════════════════════════════════════════╗");
    console.error("║  🔴 SERVER: ViewAllProductsPage - ERROR                      ║");
    console.error("╚═══════════════════════════════════════════════════════════════╝");
    console.error("\n❌ [ERROR MESSAGE]");
    console.error((error as any)?.message);
    console.error("\n❌ [ERROR STACK]");
    console.error((error as any)?.stack);
    console.error("\n");

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-red-600">
              ❌ Error Loading Products
            </h1>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700 mb-4 font-semibold">
              Failed to load products. Please try refreshing the page.
            </p>
            <div className="bg-white p-4 rounded text-xs text-red-600 overflow-auto max-h-64 font-mono">
              <pre>{(error as any)?.message}</pre>
            </div>
          </div>
        </div>
      </div>
    );
  }
}