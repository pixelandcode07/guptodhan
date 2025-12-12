import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import ChildCategoryClient from './ChildCategoryClient';

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
  childCategory?: { name: string };
  productOptions?: Array<{
    size?: Array<{ name: string }>;
    price: number;
    discountPrice: number;
  }>;
}

interface ChildCategoryData {
  childCategory: {
    name: string;
    slug: string;
    childCategoryId: string;
  };
  products: Product[];
  totalProducts: number;
}

async function getChildCategoryProducts(
  slug: string,
  searchParams: Record<string, string> = {}
): Promise<ChildCategoryData | null> {
  const params = new URLSearchParams(searchParams);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecommerce-category/ecomChildCategory/slug/${slug}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error('Error fetching child category:', error);
    return null;
  }
}

function ChildCategorySkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="h-12 bg-gray-200 rounded w-96 mb-6 animate-pulse" />
      <div className="h-6 bg-gray-200 rounded w-64 mb-12 animate-pulse" />
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

export default async function ChildCategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const resolved = await searchParams;

  const cleanParams: Record<string, string> = {};
  Object.entries(resolved).forEach(([k, v]) => {
    if (v && typeof v === 'string') cleanParams[k] = v;
  });

  const data = await getChildCategoryProducts(slug, cleanParams);
  if (!data || !data.childCategory) notFound();

  return (
    <Suspense fallback={<ChildCategorySkeleton />}>
      <ChildCategoryClient initialData={data} />
    </Suspense>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getChildCategoryProducts(slug);

  if (!data) {
    return { title: 'Child Category Not Found' };
  }

  return {
    title: `${data.childCategory.name} - ${data.totalProducts} Products`,
    description: `Shop from ${data.totalProducts} products in ${data.childCategory.name} at best prices in Bangladesh.`,
  };
}