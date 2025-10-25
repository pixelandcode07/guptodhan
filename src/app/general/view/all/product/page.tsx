import dbConnect from '@/lib/db';
import { VendorProductServices } from '@/lib/modules/product/vendorProduct.service';
import { CategoryServices } from '@/lib/modules/ecommerce-category/services/ecomCategory.service';
import { StoreServices } from '@/lib/modules/vendor-store/vendorStore.service';
import { ProductFlagServices } from '@/lib/modules/product-config/services/productFlag.service';
import ProductTableClient from './components/ProductTableClient';

// This is now a Server Component
export default async function ViewAllProductsPage() {
  await dbConnect();

  // Fetch all necessary data on the server
  const [productsData, categoriesData, storesData, flagsData] = await Promise.all([
    VendorProductServices.getAllVendorProductsFromDB(),
    CategoryServices.getAllCategoriesFromDB(),
    StoreServices.getAllStoresFromDB(),
    ProductFlagServices.getAllProductFlagsFromDB(),
  ]);

  // Transform data to plain objects
  const initialData = {
    products: JSON.parse(JSON.stringify(productsData || [])),
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
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">All Products</h1>
          </div>
        </div>

        {/* Filters Section */}
        <div className="mb-4 sm:mb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">Filters</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-medium text-gray-700">Search by Product Name</label>
                <input
                  type="text"
                  placeholder="Search by product name..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-xs sm:text-sm focus:border-blue-500 focus:ring-blue-500 transition-colors h-10 sm:h-auto"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Client Component for Interactive Table */}
        <ProductTableClient initialData={initialData} />
      </div>
    </div>
  );
}