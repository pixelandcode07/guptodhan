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

// ✅ Force dynamic — Redis cache update হলে নতুন data আসবে
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.guptodhan.com';

// ─── Image URL absolute করা ────────────────────────────────────────────────
// ✅ এটাই wrong image এর মূল সমাধান
// thumbnailImage relative হলে absolute URL বানাবে
// Cloudinary/ibb.co/external URL হলে সেটাই রাখবে
function toAbsoluteUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  // Already absolute
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  // Relative path
  return `${BASE_URL}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
}

// ─── Product এর সব image collect করা ─────────────────────────────────────────
function getProductImages(product: any): string[] {
  const images: string[] = [];

  // thumbnailImage প্রথমে (main image)
  const thumb = toAbsoluteUrl(product.thumbnailImage);
  if (thumb) images.push(thumb);

  // photoGallery থেকে বাকিগুলো
  if (Array.isArray(product.photoGallery)) {
    for (const img of product.photoGallery) {
      const abs = toAbsoluteUrl(img);
      if (abs && !images.includes(abs)) images.push(abs);
    }
  }

  return images;
}

// ─── Date helper ──────────────────────────────────────────────────────────────
function toISOString(date: any): string {
  if (!date) return new Date().toISOString();
  if (date instanceof Date) return date.toISOString();
  try { return new Date(date).toISOString(); } catch { return new Date().toISOString(); }
}

// ─── priceValidUntil — সবসময় future date ────────────────────────────────────
function getValidPriceUntil(offerDeadline?: any): string {
  const deadline = offerDeadline ? new Date(offerDeadline) : null;
  const now = new Date();
  if (deadline && deadline > now) {
    return deadline.toISOString().split('T')[0];
  }
  // 90 দিন future
  return new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
}

// ─── Clean meta description ───────────────────────────────────────────────────
function buildMetaDescription(product: any): string {
  // metaDescription ভালো হলে সেটা ব্যবহার করো
  const raw = product.metaDescription?.trim() ?? '';
  const isGood = raw.length > 50 && !raw.includes('\n') && raw.split(',').length < 8;
  if (isGood) return raw.slice(0, 160);

  // shortDescription থেকে
  if (product.shortDescription) {
    const clean = product.shortDescription.replace(/\n/g, ' ').trim();
    if (clean.length > 50) return clean.slice(0, 160);
  }

  // Auto-generate
  const brand = product.brand?.name || product.brand?.brandName || '';
  const category = product.category?.name || '';
  const price = product.discountPrice || product.productPrice;
  const parts = [
    `Buy ${product.productTitle}`,
    brand ? `by ${brand}` : '',
    category ? `in ${category}` : '',
    price ? `at ৳${price}` : '',
    '— Guptodhan Bangladesh. Cash on Delivery. Fast delivery guaranteed.',
  ].filter(Boolean);
  return parts.join(' ').slice(0, 160);
}

// ─── Page title ───────────────────────────────────────────────────────────────
function buildPageTitle(product: any): string {
  // metaTitle থাকলে সেটা, নইলে auto-build
  if (product.metaTitle?.trim()) {
    // Template: %s | Guptodhan → layout এ যোগ হবে
    return product.metaTitle.trim().slice(0, 60);
  }

  const price = product.discountPrice || product.productPrice;
  const discountPct =
    product.productPrice && product.discountPrice
      ? Math.round(((product.productPrice - product.discountPrice) / product.productPrice) * 100)
      : 0;

  const parts: string[] = [product.productTitle];
  if (price) parts.push(`৳${price}`);
  if (discountPct > 0) parts.push(`${discountPct}% Off`);

  // 60 char এর মধ্যে রাখো
  const title = parts.join(' - ');
  return title.length > 60 ? title.slice(0, 57) + '...' : title;
}

// ─── Related products ─────────────────────────────────────────────────────────
async function getRelatedProducts(categorySlug: string, currentProductId: string) {
  try {
    const res = await fetch(
      `${BASE_URL}/api/v1/ecommerce-category/ecomCategory/slug/${categorySlug}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    const json = await res.json();
    if (!json.success || !json.data?.products) return [];
    return (json.data.products as any[]).filter(
      (p) => p._id?.toString() !== currentProductId
    );
  } catch {
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
        title: 'Product Not Found',
        description: 'This product does not exist.',
        robots: { index: false, follow: false },
      };
    }

    const pageTitle = buildPageTitle(product);
    const description = buildMetaDescription(product);
    // ✅ Canonical: /product/ (singular) — actual route এর সাথে match
    const canonicalUrl = `${BASE_URL}/product/${slug}`;

    // ✅ Product এর নিজের image — absolute URL নিশ্চিত
    const images = getProductImages(product);
    const primaryImage = images[0] || `${BASE_URL}/og-image.jpg`;

    const keywords = [
      product.productTitle,
      product.brand?.name || product.brand?.brandName,
      product.category?.name,
      product.subCategory?.name,
      'Bangladesh',
      'Guptodhan',
      'buy online BD',
      ...(product.productTag || []).slice(0, 5),
    ].filter(Boolean).join(', ');

    return {
      // ✅ %s | Guptodhan → layout template এ যাবে
      title: pageTitle,
      description,
      keywords,

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

      // ✅ Product এর thumbnailImage — layout এর default image replace হবে
      openGraph: {
        title: pageTitle,
        description,
        url: canonicalUrl,
        siteName: 'Guptodhan',
        locale: 'en_US',
        type: 'website',
        images: images.slice(0, 4).map((img) => ({
          url: img,
          width: 1200,
          height: 630,
          alt: product.productTitle,
        })),
      },

      // ✅ Twitter card — product এর নিজের image
      twitter: {
        card: 'summary_large_image',
        title: pageTitle,
        description,
        images: [primaryImage],
        site: '@guptodhan',
      },
    };
  } catch (error) {
    console.error('Metadata error:', error);
    return {
      title: 'Product | Guptodhan',
      description: 'Shop quality products at Guptodhan Bangladesh.',
    };
  }
}

// =====================================================================
// ✅ PAGE COMPONENT
// =====================================================================
export default async function ProductPage({ params }: ProductPageProps) {
  try {
    await dbConnect();
    const { slug } = await params;

    // ✅ Parallel data fetching — সব একসাথে
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

    // Related products
    let relatedProducts: any[] = [];
    const categorySlug = (rawProduct.category as any)?.slug;
    if (categorySlug) {
      relatedProducts = await getRelatedProducts(categorySlug, rawProduct._id.toString());
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
      .map((cat: any, i: number) => ({
        ...cat,
        mainCategoryId: cat._id || `temp-cat-${i}`,
        subCategories: (cat.subCategories || [])
          .filter((sub: any) => sub?._id)
          .map((sub: any, si: number) => ({
            ...sub,
            subCategoryId: sub._id || `temp-sub-${i}-${si}`,
            children: (sub.children || [])
              .filter((child: any) => child?._id)
              .map((child: any, ci: number) => ({
                ...child,
                childCategoryId: child._id || `temp-child-${i}-${si}-${ci}`,
              })),
          })),
      }));

    const averageRating = rawProduct.ratingStats?.[0]?.averageRating || 0;
    const totalReviews = rawProduct.ratingStats?.[0]?.totalReviews || 0;
    const productUrl = `${BASE_URL}/product/${slug}`;

    // ✅ Product images — absolute URL নিশ্চিত
    const productImages = getProductImages(rawProduct);

    // ─── Product Schema (JSON-LD) ─────────────────────────────────────
    const productSchema = {
      '@context': 'https://schema.org/',
      '@type': 'Product',
      name: rawProduct.productTitle,
      // ✅ Product এর নিজের image list — absolute URL
      image: productImages,
      description: buildMetaDescription(rawProduct),
      sku: rawProduct.sku || rawProduct.productId || rawProduct._id?.toString(),
      mpn: rawProduct.productId || rawProduct._id?.toString(),
      brand: {
        '@type': 'Brand',
        name: rawProduct.brand?.name || rawProduct.brand?.brandName || 'Guptodhan',
      },
      ...(rawProduct.category?.name && { category: rawProduct.category.name }),
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
        price: (rawProduct.discountPrice || rawProduct.productPrice || 0).toString(),
        priceValidUntil: getValidPriceUntil(rawProduct.offerDeadline),
        availability:
          (rawProduct.stock || rawProduct.stockQuantity || 0) > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
        seller: {
          '@type': 'Organization',
          name: 'Guptodhan',
          url: BASE_URL,
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
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
        {
          '@type': 'ListItem',
          position: 2,
          name: rawProduct.category?.name || 'Products',
          item: rawProduct.category?.slug
            ? `${BASE_URL}/category/${rawProduct.category.slug}`
            : `${BASE_URL}/products`,
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
      inLanguage: 'en',
      isPartOf: {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        url: BASE_URL,
        name: 'Guptodhan',
      },
      datePublished: toISOString(rawProduct.createdAt),
      dateModified: toISOString(rawProduct.updatedAt),
    };

    return (
      <div className="min-h-screen bg-[#f2f4f8]">
        {/* ✅ JSON-LD — 3টি schema */}
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
    console.error('ProductPage error:', error);
    notFound();
  }
}