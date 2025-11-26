// import { Suspense } from 'react';

// interface Props {
//   params: Promise<{ slug: string }>; // ✅ Changed to Promise
// }

// interface ChildCategoryData {
//   childCategory: {
//     name: string;
//     slug: string;
//     childCategoryId: string;
//   };
//   productIds: string[];
// }

// async function getChildCategoryProducts(slug: string): Promise<ChildCategoryData | null> {
//   try {
//     const res = await fetch(
//       `${process.env.NEXTAUTH_URL}/api/v1/ecommerce-category/ecomChildCategory/slug/${slug}`,
//       { 
//         cache: 'no-store',
//         headers: {
//           'Content-Type': 'application/json',
//         }
//       }
//     );

//     const result = await res.json();

//     if (!result.success) {
//       return null;
//     }

//     return result.data;
//   } catch (error) {
//     console.error('Error fetching child category products:', error);
//     return null;
//   }
// }

// // Loading component
// function ChildCategorySkeleton() {
//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
//       <div className="h-10 bg-gray-200 rounded w-1/4 mb-4"></div>
//       <div className="h-6 bg-gray-200 rounded w-1/6 mb-8"></div>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {[...Array(8)].map((_, i) => (
//           <div key={i} className="h-64 bg-gray-200 rounded"></div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // Main content component
// async function ChildCategoryContent({ slug }: { slug: string }) {
//   const data = await getChildCategoryProducts(slug);

//   if (!data) {
//     return (
//       <div className="max-w-7xl mx-auto px-4 py-16 text-center">
//         <h1 className="text-3xl font-bold text-gray-800 mb-4">
//           Child Category Not Found
//         </h1>
//         <p className="text-gray-600">
//           The child category you're looking for doesn't exist.
//         </p>
//       </div>
//     );
//   }

//   const { childCategory, productIds } = data;

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-4xl font-bold text-gray-900 mb-2">
//           {childCategory.name}
//         </h1>
//         <p className="text-gray-600">
//           {productIds.length} {productIds.length === 1 ? 'product' : 'products'} found
//         </p>
//       </div>

//       {/* Products Grid */}
//       {productIds.length === 0 ? (
//         <div className="text-center py-16">
//           <p className="text-xl text-gray-500">No products available in this child category</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//           {productIds.map((productId) => (
//             <div 
//               key={productId} 
//               className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow"
//             >
//               {/* Replace this with your actual ProductCard component */}
//               <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
//                 <p className="text-sm text-gray-400">Product Image</p>
//               </div>
//               <p className="text-sm text-gray-500 truncate">
//                 Product ID: {productId}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// // Main page export
// export default async function ChildCategoryPage({ params }: Props) {
//   const { slug } = await params; // ✅ Added await

//   return (
//     <Suspense fallback={<ChildCategorySkeleton />}>
//       <ChildCategoryContent slug={slug} />
//     </Suspense>
//   );
// }

// // Generate metadata for SEO
// export async function generateMetadata({ params }: Props) {
//   const { slug } = await params; // ✅ Added await
//   const data = await getChildCategoryProducts(slug);

//   return {
//     title: data ? `${data.childCategory.name} - Products` : 'Child Category Not Found',
//     description: data 
//       ? `Browse ${data.productIds.length} products in ${data.childCategory.name}` 
//       : 'Child category not found',
//   };
// }


// app/childcategory/[slug]/page.tsx
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
  const url = `${process.env.NEXTAUTH_URL}/api/v1/ecommerce-category/ecomChildCategory/slug/${slug}?${params.toString()}`;

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