import { AllServicesResponse, ServiceData } from "@/types/ServiceDataType";
import axios from "axios";

export const fetchAllServiceAds = async (
    token: string
): Promise<ServiceData[]> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!baseUrl) {
        console.error('API base URL is not configured');
        return [];
    }

    if (!token) {
        throw new Error('Authentication token is required');
    }

    try {
        const response = await axios.get<AllServicesResponse>(
            `${baseUrl}/api/v1/service-section/provide-service`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data.data?.services || [];
    } catch (error: any) {
        console.error(
            'Axios Error: Failed to fetch protected service ads',
            error.message || error
        );
        const errorMessage =
            error.response?.data?.message ||
            'Failed to fetch ads. Authentication may have expired.';

        throw new Error(errorMessage);
    }
};