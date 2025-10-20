import dbConnect from '@/lib/db';
import ProductForm from './Components/ProductForm';
import { StoreServices } from '@/lib/modules/vendor-store/vendorStore.service';
import { CategoryServices } from '@/lib/modules/ecommerce-category/services/ecomCategory.service';
import { BrandServices as ProductConfigBrandServices } from '@/lib/modules/product-config/services/brandName.service';
import { ProductFlagServices } from '@/lib/modules/product-config/services/productFlag.service';
import { ProductUnitServices } from '@/lib/modules/product-config/services/productUnit.service';
import { ModelFormServices } from '@/lib/modules/product-config/services/modelCreate.service';
import { ProductWarrantyServices } from '@/lib/modules/product-config/services/warranty.service';
import { ProductColorServices } from '@/lib/modules/product-config/services/productColor.service';
import { ProductSimTypeServices } from '@/lib/modules/product-config/services/productSimType.service';
import { ProductSizeServices } from '@/lib/modules/product-config/services/productSize.service';
import { DeviceConditionServices } from '@/lib/modules/product-config/services/deviceCondition.service';
import { StorageTypeServices } from '@/lib/modules/product-config/services/storageType.service';

// This is an async Server Component
export default async function AddNewProductPage() {
    await dbConnect();

    // Fetch all necessary dropdown data in parallel on the server
    const [
        storesData, 
        categoriesData, 
        brandsData, 
        flagsData, 
        unitsData,
        modelsData,     // Added
        warrantiesData  // Added
    ] = await Promise.all([
        StoreServices.getAllStoresFromDB(),
        CategoryServices.getAllCategoriesFromDB(),
        ProductConfigBrandServices.getAllBrandsFromDB(),
        ProductFlagServices.getAllProductFlagsFromDB(),
        ProductUnitServices.getAllProductUnitsFromDB(),
        ModelFormServices.getAllModelFormsFromDB(), // Assuming this service method exists
        ProductWarrantyServices.getAllProductWarrantiesFromDB(), 
        ProductSimTypeServices.getAllProductSimTypesFromDB(), // Assuming method exists
        ProductColorServices.getAllProductColorsFromDB(),     // Assuming method exists
        ProductSizeServices.getAllProductSizesFromDB(),       // Assuming method exists
        DeviceConditionServices.getAllDeviceConditionsFromDB(),
        StorageTypeServices.getAllStorageTypesFromDB(),
    ]);

    // Pass fetched data as props (convert Mongoose docs to plain objects)
    const initialData = {
        stores: JSON.parse(JSON.stringify(storesData || [])),
        categories: JSON.parse(JSON.stringify(categoriesData || [])),
        brands: JSON.parse(JSON.stringify(brandsData || [])),
        flags: JSON.parse(JSON.stringify(flagsData || [])),
        units: JSON.parse(JSON.stringify(unitsData || [])),
        models: JSON.parse(JSON.stringify(modelsData || [])),         // Added
        warranties: JSON.parse(JSON.stringify(warrantiesData || [])), // Added
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
                <div className="mb-6 sm:mb-8">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Product</h1>
                                <p className="text-sm text-gray-600">Create and manage your product listings</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Pass all initial data to the ProductForm */}
                <ProductForm initialData={initialData} />
            </div>
        </div>
    );
}