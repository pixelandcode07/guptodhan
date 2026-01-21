import dbConnect from '@/lib/db';
import { VendorProductServices } from '@/lib/modules/product/vendorProduct.service';
import { CategoryServices } from '@/lib/modules/ecommerce-category/services/ecomCategory.service';
import { StoreServices } from '@/lib/modules/vendor-store/vendorStore.service';
import { ProductFlagServices } from '@/lib/modules/product-config/services/productFlag.service';
import ProductTableClient from './components/ProductTableClient';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function ViewAllProductsPage() {
  try {
    await dbConnect();

    const [productsResult, categoriesData, storesData, flagsData] = await Promise.all([
      VendorProductServices.getAllProductsNoLimitForAdmin(),
      CategoryServices.getAllCategoriesFromDB(),
      StoreServices.getAllStoresFromDB(),
      ProductFlagServices.getAllProductFlagsFromDB(),
    ]);

    const productsArray = Array.isArray(productsResult?.products) 
      ? productsResult.products 
      : [];

    const totalCount = productsResult?.total || productsArray.length;

    console.log(`Total products (Active + Inactive): ${totalCount}`);

    const initialData = {
      products: JSON.parse(JSON.stringify(productsArray)),
      categories: JSON.parse(JSON.stringify(categoriesData || [])),
      stores: JSON.parse(JSON.stringify(storesData || [])),
      flags: JSON.parse(JSON.stringify(flagsData || [])),
      totalCount,
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    All Products
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    Total {totalCount} products (Active + Inactive)
                  </p>
                </div>
                
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {productsArray.filter(p => p.status === 'active').length}
                    </div>
                    <div className="text-gray-500">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {productsArray.filter(p => p.status === 'inactive').length}
                    </div>
                    <div className="text-gray-500">Inactive</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ProductTableClient initialData={initialData} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading products:', error);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Failed to Load Products
            </h2>
            <p className="text-red-600">
              There was an error loading the products. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
