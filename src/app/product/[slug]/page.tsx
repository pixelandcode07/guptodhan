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

// 🔥 Force dynamic — Redis cache update সাথে সাথে নতুন data আসবে
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

// ✅ Helper: Date কে ISO string এ convert করা
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

// ✅ Helper: priceValidUntil — সর্বদা ভবিষ্যতের date দেবে
function getValidPriceUntil(offerDeadline?: any): string {
  const deadline = offerDeadline ? new Date(offerDeadline) : null;
  const now = new Date();
  // Offer deadline যদি ভবিষ্যতে থাকে তাহলে সেটা, নইলে আজ থেকে 90 দিন পর
  if (deadline && deadline > now) {
    return deadline.toISOString().split('T')[0];
  }
  const fallback = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
  return fallback.toISOString().split('T')[0];
}

// ✅ Helper: Clean meta description — keyword stuffing এড়াতে
function buildMetaDescription(product: any): string {
  // metaDescription যদি থাকে এবং সেটা শুধু tag list না হয়
  if (
    product.metaDescription &&
    product.metaDescription.length > 50 &&
    !product.metaDescription.includes('\n') // নতুন লাইন মানে সাধারণত keyword list
  ) {
    return product.metaDescription.slice(0, 160);
  }

  // shortDescription থেকে description বানাও
  if (product.shortDescription) {
    const clean = product.shortDescription.replace(/\n/g, ' ').trim();
    if (clean.length > 50) return clean.slice(0, 160);
  }

  // Fallback: price সহ auto-generate
  const brand = product.brand?.name || product.brand?.brandName || '';
  const category = product.category?.name || '';
  const price = product.discountPrice || product.productPrice;
  const parts = [
    `Buy ${product.productTitle}`,
    brand ? `by ${brand}` : '',
    category ? `in ${category}` : '',
    price ? `at ৳${price}` : '',
    'in Bangladesh. Cash on Delivery available. Free delivery on eligible orders.',
  ].filter(Boolean);
  return parts.join(' ').slice(0, 160);
}

// ✅ Helper: Related products fetch
async function getRelatedProducts(categorySlug: string, currentProductId: string) {
  try {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecommerce-category/ecomCategory/slug/${categorySlug}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.success || !json.data?.products) return [];
    return (json.data.products as any[]).filter(
      (p) => p._id?.toString() !== currentProductId
    );
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

// =====================================================================
// ✅ METADATA GENERATION
// =====================================================================
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

    // ─── Title ────────────────────────────────────────────────────────
    // metaTitle থাকলে সেটা ব্যবহার করো, নইলে auto-build করো
    let title: string;
    if (product.metaTitle && product.metaTitle.trim().length > 0) {
      title = `${product.metaTitle.trim()} | Guptodhan`;
    } else {
      const discountPct =
        product.productPrice && product.discountPrice
          ? Math.round(
              ((product.productPrice - product.discountPrice) / product.productPrice) * 100
            )
          : 0;
      const parts = [product.productTitle];
      if (product.discountPrice) {
        parts.push(`৳${product.discountPrice}`);
        if (discountPct > 0) parts.push(`(${discountPct}% Off)`);
      } else if (product.productPrice) {
        parts.push(`৳${product.productPrice}`);
      }
      parts.push('| Guptodhan');
      title = parts.join(' ');
    }

    // ─── Description ─────────────────────────────────────────────────
    const description = buildMetaDescription(product);

    // ─── Images ──────────────────────────────────────────────────────
    const images =
      product.photoGallery?.length > 0
        ? product.photoGallery
        : product.thumbnailImage
        ? [product.thumbnailImage]
        : [];

    // ─── Keywords ────────────────────────────────────────────────────
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

    // ─── Canonical URL ────────────────────────────────────────────────
    // ⚠️ FIX: /products/ → /product/ (singular) — actual route এর সাথে match করো
    const canonicalUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/product/${slug}`;

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
        locale: 'bn_BD',         // ✅ Bangladesh locale
        type: 'website',
      },

      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images,
      },

      alternates: {
        canonical: canonicalUrl,
      },

      robots: {
        index: product.status === 'active',
        follow: true,
        googleBot: {
          index: product.status === 'active',
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },
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

// =====================================================================
// ✅ MAIN PAGE COMPONENT
// =====================================================================
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

    if (!rawProduct) notFound();

    // ✅ Related products
    let relatedProducts: any[] = [];
    if (rawProduct.category && typeof rawProduct.category === 'object') {
      const categorySlug = (rawProduct.category as any).slug;
      if (categorySlug) {
        relatedProducts = await getRelatedProducts(
          categorySlug,
          rawProduct._id.toString()
        );
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
      relatedProducts,
    };

    const categoriesInfo = JSON.parse(JSON.stringify(categoriesData || []))
      .filter((cat: any) => cat?._id)
      .map((cat: any, index: number) => ({
        ...cat,
        mainCategoryId: cat._id || `temp-cat-${index}`,
        subCategories: (cat.subCategories || [])
          .filter((sub: any) => sub?._id)
          .map((sub: any, subIndex: number) => ({
            ...sub,
            subCategoryId: sub._id || `temp-sub-${index}-${subIndex}`,
            children: (sub.children || [])
              .filter((child: any) => child?._id)
              .map((child: any, childIndex: number) => ({
                ...child,
                childCategoryId:
                  child._id || `temp-child-${index}-${subIndex}-${childIndex}`,
              })),
          })),
      }));

    const averageRating = rawProduct.ratingStats?.[0]?.averageRating || 0;
    const totalReviews = rawProduct.ratingStats?.[0]?.totalReviews || 0;

    // ─── Canonical URL (Schema) ───────────────────────────────────────
    // ⚠️ FIX: /products/ → /product/ (singular)
    const productUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/product/${slug}`;

    // ─── Product Schema (JSON-LD) ─────────────────────────────────────
    const productSchema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: rawProduct.productTitle,
      image:
        rawProduct.photoGallery?.length > 0
          ? rawProduct.photoGallery
          : [rawProduct.thumbnailImage].filter(Boolean),
      description:
        rawProduct.shortDescription?.replace(/\n/g, ' ').slice(0, 500) ||
        rawProduct.fullDescription?.replace(/<[^>]+>/g, '').slice(0, 500) ||
        rawProduct.productTitle,
      sku: rawProduct.sku || rawProduct.productId || rawProduct._id,
      mpn: rawProduct.productId || rawProduct._id,
      brand: {
        '@type': 'Brand',
        name:
          rawProduct.brand?.name ||
          rawProduct.brand?.brandName ||
          rawProduct.vendorName ||
          'Guptodhan',
      },
      ...(rawProduct.category?.name && {
        category: rawProduct.category.name,
      }),
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
        url: productUrl,
        priceCurrency: 'BDT',
        price: rawProduct.discountPrice || rawProduct.productPrice || 0,
        // ✅ FIX: Expired deadline হলে fallback date ব্যবহার করো
        priceValidUntil: getValidPriceUntil(rawProduct.offerDeadline),
        availability:
          (rawProduct.stock || 0) > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: {
          '@type': 'Organization',
          name: 'Guptodhan',
          url: process.env.NEXT_PUBLIC_BASE_URL,
        },
        shippingDetails: {
          '@type': 'OfferShippingDetails',
          shippingRate: {
            '@type': 'MonetaryAmount',
            value: '0',
            currency: 'BDT',
          },
          shippingDestination: {
            '@type': 'DefinedRegion',
            addressCountry: 'BD',
          },
          deliveryTime: {
            '@type': 'ShippingDeliveryTime',
            handlingTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 2, unitCode: 'DAY' },
            transitTime: { '@type': 'QuantitativeValue', minValue: 1, maxValue: 3, unitCode: 'DAY' },
          },
        },
        hasMerchantReturnPolicy: {
          '@type': 'MerchantReturnPolicy',
          applicableCountry: 'BD',
          returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
          merchantReturnDays: 7,
          returnMethod: 'https://schema.org/ReturnByMail',
          returnFees: 'https://schema.org/FreeReturn',
        },
      },
      datePublished: toISOString(rawProduct.createdAt),
      dateModified: toISOString(rawProduct.updatedAt),
    };

    // ─── Breadcrumb Schema ────────────────────────────────────────────
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
          item: productUrl,
        },
      ],
    };

    // ─── WebPage Schema ───────────────────────────────────────────────
    const webPageSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      '@id': productUrl,
      url: productUrl,
      name: rawProduct.metaTitle || rawProduct.productTitle,
      description: buildMetaDescription(rawProduct),
      inLanguage: 'bn-BD',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${process.env.NEXT_PUBLIC_BASE_URL}/#website`,
        url: process.env.NEXT_PUBLIC_BASE_URL,
        name: 'Guptodhan',
      },
      datePublished: toISOString(rawProduct.createdAt),
      dateModified: toISOString(rawProduct.updatedAt),
      breadcrumb: { '@id': `${productUrl}#breadcrumb` },
    };

    return (
      <div className="min-h-screen bg-[#f2f4f8]">
        {/* ✅ JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
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