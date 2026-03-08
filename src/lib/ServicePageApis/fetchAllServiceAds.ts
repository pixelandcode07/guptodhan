import { AllServicesResponse, ServiceData } from "@/types/ServiceDataType";
import axios from "axios";

export const fetchAllServiceAds = async (
    token: string | undefined
): Promise<ServiceData[]> => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

    if (!token) {
        console.warn("No token provided for fetching service ads.");
        return [];
    }

    try {
        const response = await axios.get<AllServicesResponse>(
            `${baseUrl}/api/v1/service-section/provide-service`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Cache-Control": "no-store",
                    "Pragma": "no-cache",
                },
            }
        );

        return response.data.data?.services || [];
    } catch (error: any) {
        console.error('Error fetching service ads:', error?.response?.data?.message || error.message);
        return [];
    }
};