
import axios from 'axios';
import { ApiResponse, IServiceBanner } from '@/types/ServiceBannerType';

export const fetchAllPublicServiceBanners = async (): Promise<IServiceBanner[]> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
        console.error('API base URL is not configured');
        return [];
    }

    try {
        const response = await axios.get<ApiResponse<IServiceBanner[]>>(
            `${baseUrl}/api/v1/public/service-section/service-banner`
        );

        return response.data.data || [];
    } catch (error: any) {
        console.error(
            'Axios Error: Failed to fetch public service banners',
            error.message || error
        );
        const errorMessage =
            error.response?.data?.message ||
            'Failed to fetch banners. Please try again later.';

        throw new Error(errorMessage);
    }
};

// -------------------------------------------------------------


export const fetchAllProtectedServiceBanners = async (
    token: string
): Promise<IServiceBanner[]> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
        console.error('API base URL is not configured');
        return [];
    }

    if (!token) {
        throw new Error('Authentication token is required');
    }

    try {
        const response = await axios.get<ApiResponse<IServiceBanner[]>>(
            `${baseUrl}/api/v1/service-section/service-banner`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data.data || [];
    } catch (error: any) {
        console.error(
            'Axios Error: Failed to fetch protected service banners',
            error.message || error
        );
        const errorMessage =
            error.response?.data?.message ||
            'Failed to fetch banners. Authentication may have expired.';

        throw new Error(errorMessage);
    }
};