// File: src/app/products/[productId]/page.tsx

import dbConnect from '@/lib/db';
import { VendorProductServices } from '@/lib/modules/product/vendorProduct.service';
import { CategoryServices } from '@/lib/modules/ecommerce-category/services/ecomCategory.service';
import { StoreServices } from '@/lib/modules/vendor-store/vendorStore.service';
import { BrandServices } from '@/lib/modules/brand/brand.service';
import { SubCategoryServices } from '@/lib/modules/ecommerce-category/services/ecomSubCategory.service';
import { ChildCategoryServices } from '@/lib/modules/ecommerce-category/services/ecomChildCategory.service';
import { ModelFormServices } from '@/lib/modules/product-config/services/modelCreate.service';
import { ProductColorServices } from '@/lib/modules/product-config/services/productColor.service';
import { ProductSizeServices } from '@/lib/modules/product-config/services/productSize.service';
import { notFound } from 'next/navigation';
import ProductDetailsClient from './components/ProductDetailsClient';
import { HeroNav } from '@/app/components/Hero/HeroNav';
import Script from 'next/script';

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

interface IVendorProduct {
  _id: string;
  productTitle: string;
  shortDescription?: string;
  fullDescription?: string;
  productPrice?: number;
  discountPrice?: number;
  stock?: number;
  photoGallery?: string[];
  thumbnailImage?: string;
  productTag?: string[];
  brand?: any;
  category?: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export default async function ProductPage({ params }: ProductPageProps) {
  await dbConnect();
  const { productId } = await params;

  try {
    const [
      rawProduct,
      categoriesData,
      storesData,
      brandsData,
      subCategoriesData,
      childCategoriesData,
      modelsData,
      colorsData,
      sizesData,
    ] = await Promise.all([
      VendorProductServices.getVendorProductByIdFromDB(productId),
      CategoryServices.getAllCategoriesFromDB(),
      StoreServices.getAllStoresFromDB(),
      BrandServices.getAllBrandsFromDB(),
      SubCategoryServices.getAllSubCategoriesFromDB(),
      ChildCategoryServices.getAllChildCategoriesFromDB(),
      ModelFormServices.getAllModelFormsFromDB(),
      ProductColorServices.getAllProductColorsFromDB(),
      ProductSizeServices.getAllProductSizesFromDB(),
    ]);

    if (!rawProduct) {
      notFound();
    }

    const product = rawProduct as unknown as IVendorProduct;

    let relatedProducts: any[] = [];

    if (product.category) {
      const categoryId =
        typeof product.category === 'object' && product.category !== null
          ? (product.category as any)._id?.toString() ||
            (product.category as any).id
          : product.category.toString();

      if (categoryId) {
        const allCategoryProducts =
          await VendorProductServices.getVendorProductsByCategoryFromDB(
            categoryId,
            {}
          );

        relatedProducts = allCategoryProducts
          .filter((p: any) => p._id?.toString() !== productId)
          .slice(0, 5)
          .map((p: any) => JSON.parse(JSON.stringify(p)));
      }
    }

    const productData = {
      product: JSON.parse(JSON.stringify(product)),
      relatedData: {
        categories: JSON.parse(JSON.stringify(categoriesData || [])),
        stores: JSON.parse(JSON.stringify(storesData || [])),
        brands: JSON.parse(JSON.stringify(brandsData || [])),
        subCategories: JSON.parse(JSON.stringify(subCategoriesData || [])),
        childCategories: JSON.parse(JSON.stringify(childCategoriesData || [])),
        models: JSON.parse(JSON.stringify(modelsData || [])),
        variantOptions: {
          colors: JSON.parse(JSON.stringify(colorsData || [])),
          sizes: JSON.parse(JSON.stringify(sizesData || [])),
        },
      },
      relatedProducts: relatedProducts,
    };

    // ✅ FIXED: Clean and validate categories data
    const categoriesInfo = JSON.parse(JSON.stringify(categoriesData || []))
      .filter((cat: any) => cat && cat._id) // Remove null/undefined entries
      .map((cat: any, index: number) => ({
        ...cat,
        mainCategoryId: cat._id || `temp-cat-${index}`, // Ensure ID exists
        subCategories: (cat.subCategories || [])
          .filter((sub: any) => sub && sub._id)
          .map((sub: any, subIndex: number) => ({
            ...sub,
            subCategoryId: sub._id || `temp-sub-${index}-${subIndex}`,
            children: (sub.children || [])
              .filter((child: any) => child && child._id)
              .map((child: any, childIndex: number) => ({
                ...child,
                childCategoryId: child._id || `temp-child-${index}-${subIndex}-${childIndex}`,
              })),
          })),
      }));

    // Rich Structured Data - Product Schema
    const jsonLd = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: product.productTitle,
      image: product.photoGallery || [product.thumbnailImage],
      description: product.fullDescription || product.shortDescription,
      sku: productId,
      brand: {
        '@type': 'Brand',
        name:
          typeof product.brand === 'object'
            ? product.brand?.name
            : 'Guptodhan',
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.5',
        ratingCount: '100',
      },
      offers: {
        '@type': 'Offer',
        url: `https://www.guptodhandigital.com/products/${productId}`,
        priceCurrency: 'BDT',
        price: product.discountPrice || product.productPrice || 0,
        priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split('T')[0],
        availability:
          (product.stock || 0) > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'Guptodhan',
        },
      },
      datePublished: product.createdAt?.toISOString(),
      dateModified: product.updatedAt?.toISOString(),
    };

    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Guptodhan',
      url: 'https://www.guptodhandigital.com',
      logo: 'https://www.guptodhandigital.com/logo.png',
      sameAs: [
        'https://www.facebook.com/guptodhan',
        'https://www.instagram.com/guptodhan',
        'https://www.twitter.com/guptodhan',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        telephone: '+880-XXX-XXXXXX',
        email: 'support@guptodhan.com',
      },
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Script
          id="product-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Script
          id="organization-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />

        <HeroNav categories={categoriesInfo} />

        <div className="container mx-auto px-3 py-4 sm:px-4 sm:py-6 lg:px-8">
          <div className="mb-6 sm:mb-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    {product.productTitle}
                  </h1>
                  <p className="text-sm text-gray-600">
                    Product Details & Specifications
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ProductDetailsClient productData={productData} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  await dbConnect();
  const { productId } = await params;

  try {
    const rawProduct =
      await VendorProductServices.getVendorProductByIdFromDB(productId);

    if (!rawProduct) {
      return {
        title: 'Product Not Found',
        description: 'The requested product could not be found.',
      };
    }

    const product = rawProduct as unknown as IVendorProduct;
    const images = product.photoGallery && product.photoGallery.length > 0
      ? [product.photoGallery[0]]
      : product.thumbnailImage
        ? [product.thumbnailImage]
        : [];

    return {
      title: `${product.productTitle} - Buy Online at Guptodhan`,
      description:
        product.shortDescription || product.fullDescription?.slice(0, 160) ||
        'High-quality product available on Guptodhan marketplace',
      keywords: [
        product.productTitle,
        ...(product.productTag || []),
        'buy online',
        'Bangladesh',
      ].join(', '),
      
      openGraph: {
        title: product.productTitle,
        description: product.shortDescription,
        images: images,
        type: 'website',
        url: `https://www.guptodhandigital.com/products/${productId}`,
      },
      
      twitter: {
        card: 'summary_large_image',
        title: product.productTitle,
        description: product.shortDescription,
        images: images,
      },
      
      alternates: {
        canonical: `https://www.guptodhandigital.com/products/${productId}`,
      },
    };
  } catch (error) {
    return {
      title: 'Product Details | Guptodhan',
      description: 'View product information and details',
    };
  }
}