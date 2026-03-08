import { ApiResponse, MainCategory } from '@/types/navigation-menu';

export async function fetchNavigationCategoryData(): Promise<MainCategory[]> {
  const baseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${baseUrl}/api/v1/ecommerce-category/ecomCategory/mainCategory`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json: ApiResponse = await res.json();
    return json?.success && Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error('❌ Failed to fetch Main Category data:', error);
    return [];
  }
}