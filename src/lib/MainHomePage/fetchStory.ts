import { ApiResponse } from '@/types/FeaturedCategoryType';
import axios from 'axios';
import { IStory } from '../modules/story/story.interface';

export async function fetchStory(): Promise<IStory[]> {
    const baseUrl = process.env.NEXTAUTH_URL;

    try {
        const res = await axios.get<ApiResponse<IStory[]>>(
            `${baseUrl}/api/v1/story`,
            {
                headers: { 'Cache-Control': 'no-store' },
            }
        );

        if (res.data?.success && Array.isArray(res.data.data)) {
            return res.data.data;
        }

        return [];
    } catch (error) {
        console.error('❌ Failed to fetch Featured Categories:', error);
        return [];
    }
}
