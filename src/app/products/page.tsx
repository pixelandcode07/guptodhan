import FilterContent from './FilterContent';
async function getProducts(searchParams: any) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.guptodhandigital.com';

    // ✅ FIX 1: Safe query parameter generation
    const params = new URLSearchParams();
    params.set('page', searchParams?.page || '1');
    params.set('limit', '10');
    
    if (searchParams?.search) params.set('search', searchParams.search);
    if (searchParams?.brand) params.set('brand', searchParams.brand);
    if (searchParams?.color) params.set('color', searchParams.color);
    if (searchParams?.size) params.set('size', searchParams.size);
    if (searchParams?.priceMin) params.set('priceMin', searchParams.priceMin);
    if (searchParams?.priceMax) params.set('priceMax', searchParams.priceMax);
    if (searchParams?.sortBy) params.set('sortBy', searchParams.sortBy);

    const res = await fetch(`${baseUrl}/api/v1/public/product?${params.toString()}`, {
      cache: 'no-store',
    });

    if (!res.ok) return { products: [], meta: null };
    const data = await res.json();
    return data.data || { products: [], meta: null };
  } catch {
    return { products: [], meta: null };
  }
}

async function getActiveColors() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.guptodhandigital.com';
    const res = await fetch(`${baseUrl}/api/v1/public/product-config/product-color/active`, {
      cache: 'force-cache',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function getActiveBrands() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.guptodhandigital.com';
    const res = await fetch(`${baseUrl}/api/v1/public/product-config/brand/active`, {
      cache: 'force-cache',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

async function getActiveSizes() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://www.guptodhandigital.com';
    const res = await fetch(`${baseUrl}/api/v1/public/product-config/product-size/active`, {
      cache: 'force-cache',
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch { return []; }
}

export default async function ProductFilterPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;

  const [{ products, meta }, colors, brands, sizes] = await Promise.all([
    getProducts(resolvedSearchParams),
    getActiveColors(),
    getActiveBrands(),
    getActiveSizes(),
  ]);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <FilterContent
          initialProducts={products}
          initialColors={colors}
          initialBrands={brands}
          initialSizes={sizes}
          meta={meta}
        />
      </div>
    </>
  );
}