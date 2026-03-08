import { ApiResponse, FeaturedCategory } from '@/types/FeaturedCategoryType';

export async function fetchFeaturedCategories(): Promise<FeaturedCategory[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(
      `${baseUrl}/api/v1/ecommerce-category/ecomCategory/featured`,
      {
        cache: 'no-store',
      }
    );

    if (!res.ok) return [];

    const json: ApiResponse<FeaturedCategory[]> = await res.json();

    if (json?.success && Array.isArray(json.data)) {
      return json.data;
    }

    return [];
  } catch (error) {
    console.error('❌ Failed to fetch Featured Categories:', error);
    return [];
  }
}