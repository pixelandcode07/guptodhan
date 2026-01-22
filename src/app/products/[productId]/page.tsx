import { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
import ProductDetailsClient from './components/ProductDetailsClient';
import { HeroNav } from '@/app/components/Hero/HeroNav';

interface ProductPageProps {
  params: Promise<{ productId: string }>;
}

// ✅ Helper function to safely convert to ISO string
function toISOString(date: any): string {
  if (!date) return new Date().toISOString();
  if (typeof date === 'string') return date;
  if (date instanceof Date) return date.toISOString();
  try {
    return new Date(date).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

// ✅ Generate Metadata
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    await dbConnect();
    const { productId } = await params;
    
    const product = await VendorProductServices.getVendorProductByIdFromDB(productId);

    if (!product) {
      return {
        title: 'Product Not Found | Guptodhan',
        description: 'The product you are looking for does not exist.',
      };
    }

    // Calculate discount percentage
    const discountPercentage = product.productPrice && product.discountPrice
      ? Math.round(((product.productPrice - product.discountPrice) / product.productPrice) * 100)
      : 0;

    // Generate title
    const titleParts = [product.productTitle];
    if (product.discountPrice && product.productPrice) {
      titleParts.push(`৳${product.discountPrice}`);
      if (discountPercentage > 0) {
        titleParts.push(`(${discountPercentage}% Off)`);
      }
    } else if (product.productPrice) {
      titleParts.push(`৳${product.productPrice}`);
    }
    titleParts.push('| Guptodhan');
    const title = titleParts.join(' ');

    // Description
    const description = product.metaDescription || 
      product.shortDescription || 
      `Buy ${product.productTitle} online at best price in Bangladesh. Free delivery available.`;

    // Images
    const images = product.photoGallery && product.photoGallery.length > 0
      ? [product.photoGallery[0]]
      : product.thumbnailImage
        ? [product.thumbnailImage]
        : [];

    // Keywords
    const keywords = [
      product.productTitle,
      product.brand?.name || product.brand?.brandName,
      product.category?.name,
      'Bangladesh',
      'Guptodhan',
      ...(product.productTag || []),
    ]
      .filter(Boolean)
      .join(', ');

    const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/products/${productId}`;

    return {
      title,
      description,
      keywords,
      
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'Guptodhan',
        images: images.map(img => ({
          url: img,
          width: 1200,
          height: 630,
          alt: product.productTitle,
        })),
        locale: 'en_BD',
        type: 'website',
      },

      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: images,
      },

      alternates: {
        canonical: canonicalUrl,
      },
      
      robots: {
        index: product.status === 'active',
        follow: true,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product | Guptodhan',
      description: 'Shop quality products at Guptodhan',
    };
  }
}

// ✅ Main Component
export default async function ProductPage({ params }: ProductPageProps) {
  try {
    await dbConnect();
    const { productId } = await params;

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

    // ✅ Get related products
    let relatedProducts: any[] = [];
    if (rawProduct.category) {
      const categoryId =
        typeof rawProduct.category === 'object' && rawProduct.category !== null
          ? (rawProduct.category as any)._id?.toString() || (rawProduct.category as any).id
          : rawProduct.category.toString();

      if (categoryId) {
        const result = await VendorProductServices.getVendorProductsByCategoryFromDB(
          categoryId,
          {},
          1,
          6
        );
        
        // ✅ FIX: Extract products array from result object
        const allCategoryProducts = Array.isArray(result?.products) 
          ? result.products 
          : Array.isArray(result) 
            ? result 
            : [];

        relatedProducts = allCategoryProducts
          .filter((p: any) => p._id?.toString() !== productId)
          .slice(0, 5)
          .map((p: any) => JSON.parse(JSON.stringify(p)));
      }
    }

    // ✅ Prepare product data
    const productData = {
      product: JSON.parse(JSON.stringify(rawProduct)),
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

    // ✅ Clean categories data
    const categoriesInfo = JSON.parse(JSON.stringify(categoriesData || []))
      .filter((cat: any) => cat && cat._id)
      .map((cat: any, index: number) => ({
        ...cat,
        mainCategoryId: cat._id || `temp-cat-${index}`,
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

    // ✅ Calculate rating
    const averageRating = rawProduct.ratingStats?.[0]?.averageRating || 0;
    const totalReviews = rawProduct.ratingStats?.[0]?.totalReviews || 0;

    // ✅ JSON-LD Schemas
    const productSchema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: rawProduct.productTitle,
      image: rawProduct.photoGallery || [rawProduct.thumbnailImage],
      description: rawProduct.fullDescription || rawProduct.shortDescription,
      sku: rawProduct.sku || productId,
      brand: {
        '@type': 'Brand',
        name: rawProduct.brand?.name || rawProduct.brand?.brandName || 'Guptodhan',
      },
      aggregateRating: totalReviews > 0 ? {
        '@type': 'AggregateRating',
        ratingValue: averageRating.toFixed(1),
        reviewCount: totalReviews,
        bestRating: '5',
        worstRating: '1',
      } : undefined,
      offers: {
        '@type': 'Offer',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${productId}`,
        priceCurrency: 'BDT',
        price: rawProduct.discountPrice || rawProduct.productPrice || 0,
        priceValidUntil: rawProduct.offerDeadline 
          ? toISOString(rawProduct.offerDeadline).split('T')[0]
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        availability: (rawProduct.stock || 0) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
        seller: {
          '@type': 'Organization',
          name: 'Guptodhan',
        },
      },
      datePublished: toISOString(rawProduct.createdAt),
      dateModified: toISOString(rawProduct.updatedAt),
    };

    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: process.env.NEXT_PUBLIC_BASE_URL,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: rawProduct.category?.name || 'Products',
          item: rawProduct.category?.slug 
            ? `${process.env.NEXT_PUBLIC_BASE_URL}/category/${rawProduct.category.slug}`
            : `${process.env.NEXT_PUBLIC_BASE_URL}/products`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: rawProduct.productTitle,
          item: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${productId}`,
        },
      ],
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {/* JSON-LD Schemas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
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
                    {rawProduct.productTitle}
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
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching product:', error);
    }
    notFound();
  }
}

// ✅ Revalidate every hour
export const revalidate = 3600;