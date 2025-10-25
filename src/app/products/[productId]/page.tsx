import dbConnect from '@/lib/db';
import { VendorProductServices } from '@/lib/modules/product/vendorProduct.service';
import { CategoryServices } from '@/lib/modules/ecommerce-category/services/ecomCategory.service';
import { StoreServices } from '@/lib/modules/vendor-store/vendorStore.service';
import { BrandServices } from '@/lib/modules/brand/brand.service';
import { SubCategoryServices } from '@/lib/modules/ecommerce-category/services/ecomSubCategory.service';
import { ChildCategoryServices } from '@/lib/modules/ecommerce-category/services/ecomChildCategory.service';
import ProductDetailsClient from './components/ProductDetailsClient';
import HeroNav from '@/app/components/Hero/HeroNav';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: {
    id: string;
  };
}

// This is a Server Component for dynamic product routes
export default async function ProductPage({ params }: ProductPageProps) {
  await dbConnect();
  
  try {
    // Fetch the specific product by ID and all related data
    const [product, categoriesData, storesData, brandsData, subCategoriesData, childCategoriesData] = await Promise.all([
      VendorProductServices.getVendorProductByIdFromDB(params.id),
      CategoryServices.getAllCategoriesFromDB(),
      StoreServices.getAllStoresFromDB(),
      BrandServices.getAllBrandsFromDB(),
      SubCategoryServices.getAllSubCategoriesFromDB(),
      ChildCategoryServices.getAllChildCategoriesFromDB(),
    ]);
    
    if (!product) {
      notFound();
    }

    // Transform data to plain objects
    const productData = {
      product: JSON.parse(JSON.stringify(product)),
      relatedData: {
        categories: JSON.parse(JSON.stringify(categoriesData || [])),
        stores: JSON.parse(JSON.stringify(storesData || [])),
        brands: JSON.parse(JSON.stringify(brandsData || [])),
        subCategories: JSON.parse(JSON.stringify(subCategoriesData || [])),
        childCategories: JSON.parse(JSON.stringify(childCategoriesData || [])),
        models: [], // Empty for now since we don't have getAllProductModelsFromDB
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* HeroNav - Category Navigation */}
        <HeroNav />

        <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Product Details</h1>
                  <p className="text-sm text-gray-600">View and manage product information</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Component */}
          <ProductDetailsClient productData={productData} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  await dbConnect();
  
  try {
    const product = await VendorProductServices.getVendorProductByIdFromDB(params.id);
    
    if (!product) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      };
    }

    return {
      title: `${product.productTitle} - Product Details`,
      description: product.shortDescription || `View details for ${product.productTitle}`,
      keywords: product.productTag?.join(', ') || product.productTitle,
    };
  } catch {
    return {
      title: 'Product Details',
      description: 'View product information',
    };
  }
}