import { ProductCardType } from '@/types/ProductCardType';

export async function fetchFlashSaleData(): Promise<ProductCardType[]> {
  const baseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${baseUrl}/api/v1/product/offerProduct`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json = await res.json();
    return json?.success && Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error('❌ Failed to fetch Flash Sale products:', error);
    return [];
  }
}