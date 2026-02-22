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

// 🔥 FIX: Next.js কে নির্দেশ দেওয়া হচ্ছে যেন এই পেজটি কখনোই স্ট্যাটিক ক্যাশ না করে। 
// ফলে ব্যাকএন্ডে (Redis) ডাটা আপডেট হওয়া মাত্রই এখানে নতুন ডাটা চলে আসবে।
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

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

async function getRelatedProducts(categorySlug: string, currentProductId: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecommerce-category/ecomCategory/slug/${categorySlug}`;

    // 🔥 FIX: fetch এর ক্যাশ ও সম্পূর্ণ অফ করা হলো
    const res = await fetch(url, {
      cache: 'no-store'
    });

    if (!res.ok) return [];

    const json = await res.json();

    if (!json.success || !json.data) return [];

    const { products } = json.data;

    if (!Array.isArray(products)) return [];

    return products.filter((p: any) => p._id?.toString() !== currentProductId);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

// ✅ Metadata Generation using Slug
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    await dbConnect();
    const { slug } = await params;

    const product = await VendorProductServices.getVendorProductBySlugFromDB(slug);

    if (!product) {
      return {
        title: 'Product Not Found | Guptodhan',
        description: 'The product you are looking for does not exist.',
        robots: { index: false, follow: false },
      };
    }

    const discountPercentage = product.productPrice && product.discountPrice
      ? Math.round(((product.productPrice - product.discountPrice) / product.productPrice) * 100)
      : 0;

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

    const description = product.metaDescription ||
      product.shortDescription ||
      `Buy ${product.productTitle} online at best price in Bangladesh. Free delivery available.`;

    const images = product.photoGallery && product.photoGallery.length > 0
      ? [product.photoGallery[0]]
      : product.thumbnailImage
        ? [product.thumbnailImage]
        : [];

    const keywords = [
      product.productTitle,
      product.brand?.name || product.brand?.brandName,
      product.category?.name,
      'Bangladesh',
      'online shopping',
      'Guptodhan',
      ...(product.productTag || []),
    ]
      .filter(Boolean)
      .join(', ');

    const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/products/${slug}`;

    return {
      title,
      description,
      keywords,

      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: 'Guptodhan',
        images: images.map((img: string) => ({
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

// ✅ Main Page Component
export default async function ProductPage({ params }: ProductPageProps) {
  try {
    await dbConnect();
    const { slug } = await params;

    // ✅ Parallel Data Fetching
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
      VendorProductServices.getVendorProductBySlugFromDB(slug),
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

    // ✅ Related products
    let relatedProducts: any[] = [];
    if (rawProduct.category && typeof rawProduct.category === 'object') {
      const categorySlug = (rawProduct.category as any).slug;
      if (categorySlug) {
        relatedProducts = await getRelatedProducts(categorySlug, rawProduct._id.toString());
      }
    }

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

    const averageRating = rawProduct.ratingStats?.[0]?.averageRating || 0;
    const totalReviews = rawProduct.ratingStats?.[0]?.totalReviews || 0;

    // ✅ JSON-LD Schema — slug-based URL
    const productSchema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: rawProduct.productTitle,
      image: rawProduct.photoGallery || [rawProduct.thumbnailImage],
      description: rawProduct.fullDescription || rawProduct.shortDescription,
      sku: rawProduct.sku || rawProduct._id,
      brand: {
        '@type': 'Brand',
        name: rawProduct.brand?.name || rawProduct.brand?.brandName || 'Guptodhan',
      },
      ...(totalReviews > 0 && {
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: averageRating.toFixed(1),
          reviewCount: totalReviews,
          bestRating: '5',
          worstRating: '1',
        },
      }),
      offers: {
        '@type': 'Offer',
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${slug}`,
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
          item: `${process.env.NEXT_PUBLIC_BASE_URL}/products/${slug}`,
        },
      ],
    };

    return (
      <div className="min-h-screen bg-[#f2f4f8]">
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
          <ProductDetailsClient productData={productData} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Fatal error in ProductPage:', error);
    notFound();
  }
}