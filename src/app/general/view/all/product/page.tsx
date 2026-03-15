import dbConnect from '@/lib/db';
import { VendorProductModel } from '@/lib/modules/product/vendorProduct.model';
import { CategoryServices } from '@/lib/modules/ecommerce-category/services/ecomCategory.service';
import { StoreServices } from '@/lib/modules/vendor-store/vendorStore.service';
import { ProductFlagServices } from '@/lib/modules/product-config/services/productFlag.service';
import ProductTableClient from './components/ProductTableClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: { page?: string };
}

export default async function ViewAllProductsPage({ searchParams }: PageProps) {
  await dbConnect();

  // ✅ Server এ page number পড়া — client এ useSearchParams দরকার নেই
  const currentPage = Math.max(0, (Number(searchParams.page) || 1) - 1);

  const [productsRaw, categoriesData, storesData, flagsData] = await Promise.all([
    VendorProductModel.find({})
      .populate('brand',         'name')
      .populate('category',      'name')
      .populate('subCategory',   'name')
      .populate('childCategory', 'name')
      .populate('vendorStoreId', 'storeName')
      .populate('flag',          'name colorCode')
      .sort({ createdAt: -1 })
      .lean(),
    CategoryServices.getAllCategoriesFromDB(),
    StoreServices.getAllStoresFromDB(),
    ProductFlagServices.getAllProductFlagsFromDB(),
  ]);

  const initialData = {
    products:   JSON.parse(JSON.stringify(productsRaw    || [])),
    categories: JSON.parse(JSON.stringify(categoriesData || [])),
    stores:     JSON.parse(JSON.stringify(storesData     || [])),
    flags:      JSON.parse(JSON.stringify(flagsData      || [])),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">All Products</h1>
        </div>
        {/* ✅ Suspense নেই — initialPage সরাসরি prop হিসেবে pass */}
        <ProductTableClient
          initialData={initialData}
          initialPage={currentPage}
        />
      </div>
    </div>
  );
}