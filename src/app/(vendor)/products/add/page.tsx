export const dynamic = 'force-dynamic';
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
import { ProductCountryService } from '@/lib/modules/product-config/country/productCountry.service';

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
        modelsData,
        warrantiesData,
        simTypesData,
        colorsData,
        sizesData,
        conditionsData,
        storageTypesData,
        countriesData // ✅ Fetch Countries
    ] = await Promise.all([
        StoreServices.getAllStoresFromDB(),
        CategoryServices.getAllCategoriesFromDB(),
        ProductConfigBrandServices.getAllBrandsFromDB(),
        ProductFlagServices.getAllProductFlagsFromDB(),
        ProductUnitServices.getAllProductUnitsFromDB(),
        ModelFormServices.getAllModelFormsFromDB(),
        ProductWarrantyServices.getAllProductWarrantiesFromDB(),
        ProductSimTypeServices.getActiveProductSimTypesFromDB(),
        ProductColorServices.getAllProductColorsFromDB(),
        ProductSizeServices.getAllProductSizesFromDB(),
        DeviceConditionServices.getAllDeviceConditionsFromDB(),
        StorageTypeServices.getAllStorageTypesFromDB(),
        ProductCountryService.getAllCountriesFromDB(true), // ✅ Only active countries
    ]);

    // Pass fetched data as props (convert Mongoose docs to plain objects)
    const initialData = {
        stores: JSON.parse(JSON.stringify(storesData || [])),
        categories: JSON.parse(JSON.stringify(categoriesData || [])),
        brands: JSON.parse(JSON.stringify(brandsData || [])),
        flags: JSON.parse(JSON.stringify(flagsData || [])),
        units: JSON.parse(JSON.stringify(unitsData || [])),
        models: JSON.parse(JSON.stringify(modelsData || [])),
        warranties: JSON.parse(JSON.stringify(warrantiesData || [])),
        variantOptions: {
            warranties: JSON.parse(JSON.stringify(warrantiesData || [])),
            conditions: JSON.parse(JSON.stringify(conditionsData || [])),
            simTypes: JSON.parse(JSON.stringify(simTypesData || [])),
            colors: JSON.parse(JSON.stringify(colorsData || [])),
            sizes: JSON.parse(JSON.stringify(sizesData || [])),
            storageTypes: JSON.parse(JSON.stringify(storageTypesData || [])),
            countries: JSON.parse(JSON.stringify(countriesData || [])), // ✅ Add countries to variant options
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <h1 className="text-center text-3xl pb-8 font-bold text-gray-900 underline underline-offset-4">Add New Product</h1>
            {/* Pass all initial data to the ProductForm */}
            <ProductForm initialData={initialData} />
        </div>
    );
}