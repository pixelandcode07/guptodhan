import dbConnect from '@/lib/db';
import { StoreServices } from '@/lib/modules/vendor-store/vendorStore.service';
import { VendorProductServices } from '@/lib/modules/product/vendorProduct.service';
import { notFound } from 'next/navigation';
import StoreDetailsClient from './components/StoreDetailsClient';
import { HeroNav } from '@/app/components/Hero/HeroNav';
import { MainCategory } from '@/types/navigation-menu';

interface StorePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function StorePage({ params }: StorePageProps) {
  await dbConnect();
  const { id } = await params;
  
  try {
    const [store, products] = await Promise.all([
      StoreServices.getStoreByIdFromDB(id),
      VendorProductServices.getVendorProductsByVendorIdFromDB(id)
    ]);
    
    if (!store) {
      notFound();
    }

    // Convert to plain objects
    const storeData = JSON.parse(JSON.stringify(store));
    const productsData = JSON.parse(JSON.stringify(products || []));

    const categoriesInfo: MainCategory[] = [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* HeroNav - Category Navigation */}
        <HeroNav categories={categoriesInfo} />
        

        <div className="container mx-auto px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 p-3 sm:p-4 md:p-6">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Store Details</h1>
                  <p className="text-xs sm:text-sm text-gray-600">View and manage store information</p>
                </div>
              </div>
            </div>
          </div>

          {/* Store Details Component */}
          <StoreDetailsClient storeData={storeData} products={productsData} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching store:', error);
    notFound();
  }
}

