import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import SubCategoryClient from './SubCategoryClient';

interface Product {
  _id: string;
  productId: string;
  productTitle: string;
  thumbnailImage: string;
  productPrice: number;
  discountPrice: number;
  stock: number;
  sellCount: number;
  rewardPoints: number;
  brand?: string | null;
  subCategory?: { name: string };
  childCategory?: { name: string };
  productOptions?: Array<{
    size?: Array<{ name: string }>;
    price: number;
    discountPrice: number;
  }>;
}

interface SubCategoryData {
  subCategory: {
    name: string;
    slug: string;
    subCategoryId: string;
  };
  products: Product[];
  totalProducts: number;
}

async function getSubCategoryProducts(slug: string, searchParams: Record<string, string> = {}): Promise<SubCategoryData | null> {
  const params = new URLSearchParams(searchParams);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/public/ecommerce-category/ecomSubCategory/slug/${slug}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    return null;
  }
}

// Skeleton Loading
function SubCategorySkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="h-12 bg-gray-200 rounded w-96 mb-6 animate-pulse" />
      <div className="h-6 bg-gray-200 rounded w-48 mb-12 animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <div className="aspect-square bg-gray-200 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-6 bg-gray-300 rounded w-1/2 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function SubCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const cleanParams: Record<string, string> = {};
  Object.entries(resolvedSearchParams).forEach(([key, value]) => {
    if (value && typeof value === 'string') cleanParams[key] = value;
  });

  const data = await getSubCategoryProducts(slug, cleanParams);
  if (!data || !data.subCategory) notFound();

  return (
    <Suspense fallback={<SubCategorySkeleton />}>
      <SubCategoryClient initialData={data} />
    </Suspense>
  );
}

// SEO Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getSubCategoryProducts(slug);

  if (!data) {
    return { title: 'SubCategory Not Found', description: 'The requested subcategory does not exist.' };
  }

  return {
    title: `${data.subCategory.name} - ${data.totalProducts} Products`,
    description: `Browse ${data.totalProducts} products in ${data.subCategory.name} category at best prices.`,
  };
}