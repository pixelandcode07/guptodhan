import dbConnect from '@/lib/db';
import { VendorProductServices } from '@/lib/modules/product/vendorProduct.service';
import { CategoryServices } from '@/lib/modules/ecommerce-category/services/ecomCategory.service';
import { StoreServices } from '@/lib/modules/vendor-store/vendorStore.service';
import { ProductFlagServices } from '@/lib/modules/product-config/services/productFlag.service';
import ProductTableClient from './components/ProductTableClient';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // 1 ঘণ্টা পর পর রিভ্যালিডেট

export default async function ViewAllProductsPage() {
  try {
    await dbConnect();

    // ✅ নতুন ফাংশন ব্যবহার করুন - সব প্রোডাক্ট (active + inactive)
    const [productsResult, categoriesData, storesData, flagsData] = await Promise.all([
      VendorProductServices.getAllProductsNoLimitForAdmin(), // ✅ নো লিমিট
      CategoryServices.getAllCategoriesFromDB(),
      StoreServices.getAllStoresFromDB(),
      ProductFlagServices.getAllProductFlagsFromDB(),
    ]);

    // ✅ ডেটা সঠিকভাবে এক্সট্র্যাক্ট করুন
    const productsArray = Array.isArray(productsResult?.products) 
      ? productsResult.products 
      : [];

    const totalCount = productsResult?.total || productsArray.length;

    console.log(`📦 সর্বমোট প্রোডাক্ট (Active + Inactive): ${totalCount}`);

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
          {/* হেডার সেকশন */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                    সকল প্রোডাক্ট
                  </h1>
                  <p className="mt-1 text-sm text-gray-600">
                    মোট {totalCount} টি প্রোডাক্ট (সক্রিয় + নিষ্ক্রিয়)
                  </p>
                </div>
                
                {/* কুইক স্ট্যাটস */}
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {productsArray.filter(p => p.status === 'active').length}
                    </div>
                    <div className="text-gray-500">সক্রিয়</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {productsArray.filter(p => p.status === 'inactive').length}
                    </div>
                    <div className="text-gray-500">নিষ্ক্রিয়</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ক্লায়েন্ট কম্পোনেন্ট */}
          <ProductTableClient initialData={initialData} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('❌ প্রোডাক্ট লোডিং এরর:', error);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              প্রোডাক্ট লোড হচ্ছে না
            </h2>
            <p className="text-red-600">
              দয়া করে পরে আবার চেষ্টা করুন
            </p>
          </div>
        </div>
      </div>
    );
  }
}
