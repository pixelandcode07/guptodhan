import { ApiResponse } from '@/types/FeaturedCategoryType';
import { IStory } from '../modules/story/story.interface';

export async function fetchStory(): Promise<IStory[]> {
  const baseUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL;
  try {
    const res = await fetch(`${baseUrl}/api/v1/story`, { cache: 'no-store' });
    if (!res.ok) return [];
    const json: ApiResponse<IStory[]> = await res.json();
    return json?.success && Array.isArray(json.data) ? json.data : [];
  } catch (error) {
    console.error('❌ Failed to fetch Story:', error);
    return [];
  }
}