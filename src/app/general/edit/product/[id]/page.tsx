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
// Importing the SAME component from the add page location
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

    const initialData = {
      stores: JSON.parse(JSON.stringify(storesData || [])),
      categories: JSON.parse(JSON.stringify(categoriesData || [])),
      brands: JSON.parse(JSON.stringify(brandsData || [])),
      flags: JSON.parse(JSON.stringify(flagsData || [])),
      units: JSON.parse(JSON.stringify(unitsData || [])),
      warranties: JSON.parse(JSON.stringify(warrantiesData || [])),
      // We pass an empty array for models initially; the form will fetch specific models based on the brand
      models: [], 
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
          <ProductForm initialData={initialData} productId={id} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading edit product page:', error);
    notFound();
  }
}