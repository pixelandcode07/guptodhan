import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import CategoryClient from './CategoryClient';

async function getCategoryProducts(slug: string, searchParams: Record<string, string>) {
  const params = new URLSearchParams(searchParams);
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/ecommerce-category/ecomCategory/slug/${slug}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 60 },
      cache: 'no-store'
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.success ? json.data : null;
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

export default async function CategoryPage(
  // params,
  // searchParams,
  props: any

  // :{
  //   // params: Promise<{ slug: string }>;
  //   // searchParams: Promise<Record<string, string | string[] | undefined>>;
  //   params: { slug: string };
  //   searchParams: Record<string, string | string[] | undefined>;
  // }
) {
  // const { slug } = await params;
  const params = await Promise.resolve(props.params);
  const searchParams = await Promise.resolve(props.searchParams);
  const slug = params.slug;
  // const resolvedSearchParams = await searchParams;

  // const cleanParams: Record<string, string> = {};
  // Object.entries(resolvedSearchParams).forEach(([key, value]) => {
  //   if (value && typeof value === 'string') {
  //     cleanParams[key] = value;
  //   }
  // });
  const cleanParams: Record<string, string> = {};
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      cleanParams[key] = value;
    } else if (Array.isArray(value) && value[0]) {
      cleanParams[key] = value[0];
    }
  });

  const data = await getCategoryProducts(slug, cleanParams);
  if (!data) notFound();

  const { category, products, totalProducts } = data;

  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="h-10 bg-gray-200 rounded w-64 mb-8 animate-pulse" />
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
    }>
      <CategoryClient initialData={{ category, products, totalProducts }} />
    </Suspense>
  );
}