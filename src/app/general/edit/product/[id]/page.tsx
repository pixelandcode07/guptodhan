import dbConnect from '@/lib/db';
import { StoreServices } from '@/lib/modules/vendor-store/vendorStore.service';
import { CategoryServices } from '@/lib/modules/ecommerce-category/services/ecomCategory.service';
import { BrandServices as ProductConfigBrandServices } from '@/lib/modules/product-config/services/brandName.service';
import { ProductFlagServices } from '@/lib/modules/product-config/services/productFlag.service';
import { ProductUnitServices } from '@/lib/modules/product-config/services/productUnit.service';
import { ProductWarrantyServices } from '@/lib/modules/product-config/services/warranty.service';
import { ProductColorServices } from '@/lib/modules/product-config/services/productColor.service';
import { ProductSimTypeServices } from '@/lib/modules/product-config/services/productSimType.service';
import { ProductSizeServices } from '@/lib/modules/product-config/services/productSize.service';
import { DeviceConditionServices } from '@/lib/modules/product-config/services/deviceCondition.service';
import { StorageTypeServices } from '@/lib/modules/product-config/services/storageType.service';
import { notFound } from 'next/navigation';
import ProductForm from '@/app/general/add/new/product/Components/ProductForm';

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  await dbConnect();
  const { id } = await params;
  
  if (!id || id === 'undefined' || id.trim() === '') {
    notFound();
  }

  try {
    // ✅ সব ড্রপডাউন অপশন সার্ভার থেকে একবারেই আনা হচ্ছে
    const [
      storesData, 
      categoriesData, 
      brandsData, 
      flagsData, 
      unitsData,
      warrantiesData,
      simTypesData,
      colorsData,
      sizesData,
      conditionsData,
      storageTypesData
    ] = await Promise.all([
      StoreServices.getAllStoresFromDB(),
      CategoryServices.getAllCategoriesFromDB(),
      ProductConfigBrandServices.getAllBrandsFromDB(),
      ProductFlagServices.getAllProductFlagsFromDB(),
      ProductUnitServices.getAllProductUnitsFromDB(),
      ProductWarrantyServices.getAllProductWarrantiesFromDB(), 
      ProductSimTypeServices.getActiveProductSimTypesFromDB(),
      ProductColorServices.getAllProductColorsFromDB(),
      ProductSizeServices.getAllProductSizesFromDB(),
      DeviceConditionServices.getAllDeviceConditionsFromDB(),
      StorageTypeServices.getAllStorageTypesFromDB(),
    ]);

    // ✅ JSON সিরিয়ালাইজেশন (Warning এড়ানোর জন্য)
    const initialData = {
      stores: JSON.parse(JSON.stringify(storesData || [])),
      categories: JSON.parse(JSON.stringify(categoriesData || [])),
      brands: JSON.parse(JSON.stringify(brandsData || [])),
      flags: JSON.parse(JSON.stringify(flagsData || [])),
      units: JSON.parse(JSON.stringify(unitsData || [])),
      warranties: JSON.parse(JSON.stringify(warrantiesData || [])),
      variantOptions: {
        warranties: JSON.parse(JSON.stringify(warrantiesData || [])),
        conditions: JSON.parse(JSON.stringify(conditionsData || [])),
        simTypes: JSON.parse(JSON.stringify(simTypesData || [])),
        colors: JSON.parse(JSON.stringify(colorsData || [])),
        sizes: JSON.parse(JSON.stringify(sizesData || [])),
        storageTypes: JSON.parse(JSON.stringify(storageTypesData || [])),
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Product</h1>
                  <p className="text-sm text-gray-600">Update and manage your product listing</p>
                </div>
              </div>
            </div>
          </div>
          <ProductForm initialData={initialData} productId={id} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading edit product page:', error);
    notFound();
  }
}