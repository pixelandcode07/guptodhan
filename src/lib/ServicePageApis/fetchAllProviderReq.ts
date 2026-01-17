import { IApiResponse, IProvider } from "@/types/ProviderType";
import axios from "axios";

export const fetchAllProviderReq = async (
    token: string
): Promise<IProvider[]> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
        console.error('API base URL is not configured');
        return [];
    }

    if (!token) {
        throw new Error('Authentication token is required');
    }

    try {
        const response = await axios.get<IApiResponse>(
            `${baseUrl}/api/v1/service-section/service-provider`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data.data || [];
    } catch (error: any) {
        console.error(
            'Axios Error: Failed to fetch protected providers',
            error.message || error
        );
        const errorMessage =
            error.response?.data?.message ||
            'Failed to fetch service users. Authentication may have expired.';

        throw new Error(errorMessage);
    }
};