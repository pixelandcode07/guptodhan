import dbConnect from '@/lib/db';
import { VendorProductServices } from '@/lib/modules/product/vendorProduct.service';
import { CategoryServices } from '@/lib/modules/ecommerce-category/services/ecomCategory.service';
import { StoreServices } from '@/lib/modules/vendor-store/vendorStore.service';
import { ProductFlagServices } from '@/lib/modules/product-config/services/productFlag.service';
import ProductTableClient from './components/ProductTableClient';

// ✅ Dynamic rendering because admin data changes frequently
export const dynamic = 'force-dynamic'; 

export default async function ViewAllProductsPage() {
  await dbConnect();

  console.log("📥 [ViewAllProductsPage] Starting to fetch all products...");

  try {
    // ✅ FIXED: Fetch ALL products with unlimited limit
    const [productsResult, categoriesData, storesData, flagsData] = await Promise.all([
      VendorProductServices.getAllVendorProductsFromDB(1, 999999), // ✅ Request ALL products
      CategoryServices.getAllCategoriesFromDB(),
      StoreServices.getAllStoresFromDB(),
      ProductFlagServices.getAllProductFlagsFromDB(),
    ]);

    // ✅ FIXED: Extract the array from the result object
    const productsArray = productsResult?.products || [];
    const pagination = productsResult?.pagination || {};

    console.log(`✅ [ViewAllProductsPage] Fetched:`);
    console.log(`   - Products: ${productsArray.length}`);
    console.log(`   - Categories: ${categoriesData?.length || 0}`);
    console.log(`   - Stores: ${storesData?.length || 0}`);
    console.log(`   - Flags: ${flagsData?.length || 0}`);
    console.log(`   - Pagination: Page ${pagination.page || 1} of ${pagination.pages || 1}`);

    // ✅ Transform data to plain objects for Client Component
    const initialData = {
      products: JSON.parse(JSON.stringify(productsArray)), 
      categories: JSON.parse(JSON.stringify(categoriesData || [])),
      stores: JSON.parse(JSON.stringify(storesData || [])),
      flags: JSON.parse(JSON.stringify(flagsData || [])),
    };

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
                <p className="text-sm text-gray-600 mt-1">
                  ✅ Total: {productsArray.length} products loaded
                </p>
              </div>
            </div>
          </div>
          
          {/* ✅ Client Component with All Data */}
          <ProductTableClient initialData={initialData} />
        </div>
      </div>
    );
  } catch (error) {
    console.error("❌ [ViewAllProductsPage] Error fetching data:", error);

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-xl sm:text-2xl font-semibold text-red-600">
              Error Loading Products
            </h1>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-700">
              Failed to load products. Please try refreshing the page.
            </p>
            <pre className="mt-4 text-xs text-red-600 bg-white p-4 rounded overflow-auto">
              {String(error)}
            </pre>
          </div>
        </div>
      </div>
    );
  }
}